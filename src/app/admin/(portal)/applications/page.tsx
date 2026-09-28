import type { Metadata } from "next";
import Link from "next/link";
import type { ApplicationStatus, Prisma } from "@prisma/client";
import { requireUser } from "@/lib/server/auth";
import { can } from "@/lib/server/rbac";
import { getPrisma } from "@/lib/server/db";
import { APPLICATION_STATUSES, Card, Empty, PAGE_SIZE, PageHeader, Pagination, StatusBadge, Td, Th, btnCls, btnGhostCls, buildQuery, fmtDate, inputCls, pageParam, param } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Applications" };

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const q = param(sp, "q");
  const status = param(sp, "status", 20);
  const role = param(sp, "role", 120);
  const page = pageParam(sp);

  const where: Prisma.JobApplicationWhereInput = {};
  if (q) where.OR = [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { roleTitle: { contains: q, mode: "insensitive" } }];
  if (status && (APPLICATION_STATUSES as string[]).includes(status)) where.status = status as ApplicationStatus;
  if (role) where.roleSlug = role;

  const prisma = getPrisma();
  const [total, rows, roles] = await Promise.all([
    prisma.jobApplication.count({ where }),
    prisma.jobApplication.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, select: { id: true, name: true, email: true, roleTitle: true, status: true, createdAt: true, cvOriginalName: true, assignedTo: { select: { name: true } } } }),
    prisma.jobApplication.groupBy({ by: ["roleSlug", "roleTitle"], _count: { _all: true }, orderBy: { roleTitle: "asc" } }),
  ]);
  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <PageHeader title="Job applications" description="Submissions from the Careers application form." actions={can(user.role, "export") ? <a href="/admin/api/export?type=applications" className={btnGhostCls}>Export CSV</a> : undefined} />
      <Card className="mb-4">
        <form method="get" className="grid gap-3 md:grid-cols-5">
          <input name="q" defaultValue={q} placeholder="Search name, email, role" className={`${inputCls} md:col-span-2`} />
          <select name="status" defaultValue={status} className={inputCls}>
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select name="role" defaultValue={role} className={inputCls}>
            <option value="">All roles</option>
            {roles.map((r) => (
              <option key={r.roleSlug} value={r.roleSlug}>
                {r.roleTitle} ({r._count._all})
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button type="submit" className={btnCls}>
              Filter
            </button>
            <Link href="/admin/applications" className={btnGhostCls}>
              Reset
            </Link>
          </div>
        </form>
      </Card>
      <Card>
        {rows.length === 0 ? (
          <Empty>No applications match these filters.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <Th>Candidate</Th>
                  <Th>Role</Th>
                  <Th>CV</Th>
                  <Th>Status</Th>
                  <Th>Owner</Th>
                  <Th>Received</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <Td>
                      <Link href={`/admin/applications/${r.id}`} className="font-medium text-navy hover:underline">
                        {r.name}
                      </Link>
                      <div className="text-xs text-slate-500">{r.email}</div>
                    </Td>
                    <Td>{r.roleTitle}</Td>
                    <Td className="text-xs text-slate-600">{r.cvOriginalName ? "Attached" : "—"}</Td>
                    <Td>
                      <StatusBadge status={r.status} />
                    </Td>
                    <Td>{r.assignedTo?.name ?? <span className="text-slate-400">—</span>}</Td>
                    <Td className="whitespace-nowrap text-slate-500">{fmtDate(r.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pageCount={pageCount} total={total} buildHref={(p) => `/admin/applications${buildQuery({ q, status, role, page: p })}`} />
      </Card>
    </>
  );
}
