import type { Metadata } from "next";
import Link from "next/link";
import type { ContactStatus, Prisma } from "@prisma/client";
import { requireUser } from "@/lib/server/auth";
import { can } from "@/lib/server/rbac";
import { getPrisma } from "@/lib/server/db";
import { CONTACT_STATUSES, Card, Empty, PAGE_SIZE, PageHeader, Pagination, StatusBadge, Td, Th, btnCls, btnGhostCls, buildQuery, fmtDate, inputCls, pageParam, param } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Contact messages" };

export default async function ContactsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const q = param(sp, "q");
  const status = param(sp, "status", 20);
  const page = pageParam(sp);
  const where: Prisma.ContactMessageWhereInput = {};
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { topic: { contains: q, mode: "insensitive" } }, { message: { contains: q, mode: "insensitive" } }];
  if (status && (CONTACT_STATUSES as string[]).includes(status)) where.status = status as ContactStatus;
  const prisma = getPrisma();
  const [total, rows] = await Promise.all([prisma.contactMessage.count({ where }), prisma.contactMessage.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE })]);
  const pageCount = Math.ceil(total / PAGE_SIZE);
  return (
    <>
      <PageHeader title="Contact messages" description="General enquiries from the Contact form." actions={can(user.role, "export") ? <a href="/admin/api/export?type=contacts" className={btnGhostCls}>Export CSV</a> : undefined} />
      <Card className="mb-4">
        <form method="get" className="grid gap-3 md:grid-cols-4">
          <input name="q" defaultValue={q} placeholder="Search name, email, topic, message" className={`${inputCls} md:col-span-2`} />
          <select name="status" defaultValue={status} className={inputCls}>
            <option value="">All statuses</option>
            {CONTACT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button type="submit" className={btnCls}>
              Filter
            </button>
            <Link href="/admin/contacts" className={btnGhostCls}>
              Reset
            </Link>
          </div>
        </form>
      </Card>
      <Card>
        {rows.length === 0 ? (
          <Empty>No contact messages match these filters.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <Th>From</Th>
                  <Th>Topic</Th>
                  <Th>Message</Th>
                  <Th>Status</Th>
                  <Th>Received</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <Td>
                      <Link href={`/admin/contacts/${r.id}`} className="font-medium text-navy hover:underline">
                        {r.name}
                      </Link>
                      <div className="text-xs text-slate-500">{r.email}</div>
                    </Td>
                    <Td>{r.topic}</Td>
                    <Td className="max-w-md truncate text-slate-600">{r.message.slice(0, 120)}</Td>
                    <Td>
                      <StatusBadge status={r.status} />
                    </Td>
                    <Td className="whitespace-nowrap text-slate-500">{fmtDate(r.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pageCount={pageCount} total={total} buildHref={(p) => `/admin/contacts${buildQuery({ q, status, page: p })}`} />
      </Card>
    </>
  );
}
