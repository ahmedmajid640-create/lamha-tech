import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/server/auth";
import { getPrisma } from "@/lib/server/db";
import { isEmailConfigured } from "@/lib/server/email";
import { Card, Empty, PageHeader, Stat, StatusBadge, Td, Th, fmtDate } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();
  const prisma = getPrisma();
  const now = new Date();
  const d7 = new Date(now.getTime() - 7 * 86400000);
  const d30 = new Date(now.getTime() - 30 * 86400000);

  const [inqTotal, inqNew, inq7, inq30, inqWon, appTotal, appNew, ctTotal, ctNew, inqByStatus, recentInq, recentApps, recentContacts, mine] = await Promise.all([
    prisma.projectInquiry.count(),
    prisma.projectInquiry.count({ where: { status: "NEW" } }),
    prisma.projectInquiry.count({ where: { createdAt: { gte: d7 } } }),
    prisma.projectInquiry.count({ where: { createdAt: { gte: d30 } } }),
    prisma.projectInquiry.count({ where: { status: "WON" } }),
    prisma.jobApplication.count(),
    prisma.jobApplication.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.projectInquiry.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.projectInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 8, select: { id: true, fullName: true, company: true, service: true, status: true, createdAt: true, assignedTo: { select: { name: true } } } }),
    prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, roleTitle: true, status: true, createdAt: true } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, topic: true, status: true, createdAt: true } }),
    prisma.projectInquiry.count({ where: { assignedToId: user.id, status: { notIn: ["WON", "LOST", "SPAM"] } } }),
  ]);

  const statusCount = Object.fromEntries(inqByStatus.map((s) => [s.status, s._count._all]));
  const emailConfigured = isEmailConfigured();
  const [unsentInq, unsentApps, unsentContacts] = emailConfigured
    ? await Promise.all([
        prisma.projectInquiry.count({ where: { notifiedAt: null, createdAt: { gte: d7 } } }),
        prisma.jobApplication.count({ where: { notifiedAt: null, createdAt: { gte: d7 } } }),
        prisma.contactMessage.count({ where: { notifiedAt: null, createdAt: { gte: d7 } } }),
      ])
    : [0, 0, 0];
  const unsent = unsentInq + unsentApps + unsentContacts;
  const pipeline = ["NEW", "QUALIFIED", "CONTACTED", "PROPOSAL", "WON", "LOST", "SPAM"] as const;

  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(" ")[0]}`} description={`Live data from the website database · ${fmtDate(now)} PKT`} />
      {!emailConfigured && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Email notifications are <strong>not configured</strong> (EMAIL_API_KEY is missing). Every submission is still saved here; add the key in Vercel to receive an email per lead.
        </div>
      )}
      {emailConfigured && unsent > 0 && (
        <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {unsent} submission{unsent === 1 ? "" : "s"} in the last 7 days did not produce an email notification.{" "}
          <Link href="/admin/audit?action=notification.failed" className="underline">
            See failures in the audit log
          </Link>
          . The records themselves are safe.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="New inquiries" value={inqNew} hint={`${inqTotal} total · ${inq7} in the last 7 days`} href="/admin/inquiries?status=NEW" />
        <Stat label="Inquiries · 30 days" value={inq30} hint={`${inqWon} won overall`} href="/admin/inquiries" />
        <Stat label="New applications" value={appNew} hint={`${appTotal} total`} href="/admin/applications?status=NEW" />
        <Stat label="New contact messages" value={ctNew} hint={`${ctTotal} total`} href="/admin/contacts?status=NEW" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card title="Inquiry pipeline" className="xl:col-span-1">
          <ul className="space-y-2">
            {pipeline.map((s) => (
              <li key={s} className="flex items-center justify-between text-sm">
                <Link href={`/admin/inquiries?status=${s}`} className="hover:underline">
                  <StatusBadge status={s} />
                </Link>
                <span className="font-mono tabular-nums text-slate-700">{statusCount[s] ?? 0}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
            Assigned to you (open): <span className="font-medium text-slate-800">{mine}</span>
          </p>
        </Card>

        <Card title="Latest inquiries" className="xl:col-span-2" actions={<Link href="/admin/inquiries" className="text-xs text-blue hover:underline">View all</Link>}>
          {recentInq.length === 0 ? (
            <Empty>No project inquiries yet. Submissions from the Start a Project form will appear here.</Empty>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <Th>Contact</Th>
                    <Th>Service</Th>
                    <Th>Status</Th>
                    <Th>Owner</Th>
                    <Th>Received</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentInq.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <Td>
                        <Link href={`/admin/inquiries/${r.id}`} className="font-medium text-navy hover:underline">
                          {r.fullName}
                        </Link>
                        <div className="text-xs text-slate-500">{r.company}</div>
                      </Td>
                      <Td>{r.service}</Td>
                      <Td>
                        <StatusBadge status={r.status} />
                      </Td>
                      <Td>{r.assignedTo?.name ?? <span className="text-slate-400">Unassigned</span>}</Td>
                      <Td className="whitespace-nowrap text-slate-500">{fmtDate(r.createdAt)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Latest applications" actions={<Link href="/admin/applications" className="text-xs text-blue hover:underline">View all</Link>}>
          {recentApps.length === 0 ? (
            <Empty>No job applications yet.</Empty>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentApps.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <Link href={`/admin/applications/${a.id}`} className="font-medium text-navy hover:underline">
                      {a.name}
                    </Link>
                    <div className="truncate text-xs text-slate-500">{a.roleTitle}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={a.status} />
                    <span className="whitespace-nowrap text-xs text-slate-500">{fmtDate(a.createdAt, false)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Latest contact messages" actions={<Link href="/admin/contacts" className="text-xs text-blue hover:underline">View all</Link>}>
          {recentContacts.length === 0 ? (
            <Empty>No contact messages yet.</Empty>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentContacts.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <Link href={`/admin/contacts/${c.id}`} className="font-medium text-navy hover:underline">
                      {c.name}
                    </Link>
                    <div className="truncate text-xs text-slate-500">{c.topic}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={c.status} />
                    <span className="whitespace-nowrap text-xs text-slate-500">{fmtDate(c.createdAt, false)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
