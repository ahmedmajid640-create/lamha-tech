import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/server/auth";
import { getPrisma } from "@/lib/server/db";
import { Card, Empty, PageHeader, StatusBadge, Td, Th, btnCls, btnGhostCls, fmtDate, inputCls, param } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Customers & leads" };

type Customer = {
  email: string;
  name: string;
  company: string | null;
  inquiries: number;
  contacts: number;
  latestStatus: string;
  won: boolean;
  firstSeen: Date;
  lastSeen: Date;
};

/**
 * Customers are derived, not stored: every distinct email that has submitted a project inquiry or a
 * contact message, grouped with counts, latest pipeline status and recency. No records are invented.
 */
export default async function CustomersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireUser();
  const sp = await searchParams;
  const q = param(sp, "q").toLowerCase();
  const segment = param(sp, "segment", 20); // all | won | open | contact-only
  const prisma = getPrisma();
  const [inquiries, contacts] = await Promise.all([
    prisma.projectInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5000, select: { email: true, fullName: true, company: true, status: true, createdAt: true } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5000, select: { email: true, name: true, status: true, createdAt: true } }),
  ]);

  const map = new Map<string, Customer>();
  for (const i of inquiries) {
    const key = i.email.toLowerCase();
    const c = map.get(key);
    if (!c) map.set(key, { email: key, name: i.fullName, company: i.company, inquiries: 1, contacts: 0, latestStatus: i.status, won: i.status === "WON", firstSeen: i.createdAt, lastSeen: i.createdAt });
    else {
      c.inquiries += 1;
      c.won ||= i.status === "WON";
      if (i.createdAt < c.firstSeen) c.firstSeen = i.createdAt;
      if (i.createdAt > c.lastSeen) c.lastSeen = i.createdAt;
    }
  }
  for (const m of contacts) {
    const key = m.email.toLowerCase();
    const c = map.get(key);
    if (!c) map.set(key, { email: key, name: m.name, company: null, inquiries: 0, contacts: 1, latestStatus: `CONTACT:${m.status}`, won: false, firstSeen: m.createdAt, lastSeen: m.createdAt });
    else {
      c.contacts += 1;
      if (m.createdAt < c.firstSeen) c.firstSeen = m.createdAt;
      if (m.createdAt > c.lastSeen) c.lastSeen = m.createdAt;
    }
  }

  let rows = [...map.values()].sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
  if (q) rows = rows.filter((r) => r.email.includes(q) || r.name.toLowerCase().includes(q) || (r.company ?? "").toLowerCase().includes(q));
  if (segment === "won") rows = rows.filter((r) => r.won);
  else if (segment === "open") rows = rows.filter((r) => r.inquiries > 0 && !r.won && !["LOST", "SPAM"].includes(r.latestStatus));
  else if (segment === "contact-only") rows = rows.filter((r) => r.inquiries === 0);

  const totals = { all: map.size, won: [...map.values()].filter((r) => r.won).length, contactOnly: [...map.values()].filter((r) => r.inquiries === 0).length };

  return (
    <>
      <PageHeader title="Customers & leads" description={`${totals.all} unique contacts derived from inquiries and messages · ${totals.won} won · ${totals.contactOnly} contact-only`} />
      <Card className="mb-4">
        <form method="get" className="grid gap-3 md:grid-cols-4">
          <input name="q" defaultValue={q} placeholder="Search email, name, company" className={`${inputCls} md:col-span-2`} />
          <select name="segment" defaultValue={segment} className={inputCls}>
            <option value="">All</option>
            <option value="open">Open leads</option>
            <option value="won">Customers (won)</option>
            <option value="contact-only">Contact-form only</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className={btnCls}>
              Filter
            </button>
            <Link href="/admin/customers" className={btnGhostCls}>
              Reset
            </Link>
          </div>
        </form>
      </Card>
      <Card>
        {rows.length === 0 ? (
          <Empty>No contacts yet. This list fills automatically as people submit forms on the website.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <Th>Contact</Th>
                  <Th>Company</Th>
                  <Th>Inquiries</Th>
                  <Th>Messages</Th>
                  <Th>Latest status</Th>
                  <Th>First seen</Th>
                  <Th>Last activity</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.slice(0, 500).map((r) => (
                  <tr key={r.email} className="hover:bg-slate-50">
                    <Td>
                      <p className="font-medium text-navy">{r.name}</p>
                      <Link href={`/admin/inquiries?q=${encodeURIComponent(r.email)}`} className="text-xs text-blue hover:underline">
                        {r.email}
                      </Link>
                    </Td>
                    <Td>{r.company ?? <span className="text-slate-400">—</span>}</Td>
                    <Td className="tabular-nums">{r.inquiries}</Td>
                    <Td className="tabular-nums">{r.contacts}</Td>
                    <Td>{r.latestStatus.startsWith("CONTACT:") ? <span className="text-xs text-slate-500">Message · {r.latestStatus.slice(8)}</span> : <StatusBadge status={r.latestStatus} />}</Td>
                    <Td className="whitespace-nowrap text-slate-500">{fmtDate(r.firstSeen, false)}</Td>
                    <Td className="whitespace-nowrap text-slate-500">{fmtDate(r.lastSeen, false)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
