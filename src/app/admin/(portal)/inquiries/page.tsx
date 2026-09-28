import type { Metadata } from "next";
import Link from "next/link";
import type { InquiryStatus, Prisma } from "@prisma/client";
import { requireUser } from "@/lib/server/auth";
import { can } from "@/lib/server/rbac";
import { getPrisma } from "@/lib/server/db";
import { services } from "@/data/services";
import { Card, Empty, INQUIRY_STATUSES, PAGE_SIZE, PageHeader, Pagination, StatusBadge, Td, Th, btnCls, btnGhostCls, buildQuery, fmtDate, inputCls, pageParam, param } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Inquiries" };

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const q = param(sp, "q");
  const status = param(sp, "status", 20);
  const service = param(sp, "service", 120);
  const assignee = param(sp, "assignee", 64);
  const from = param(sp, "from", 10);
  const to = param(sp, "to", 10);
  const page = pageParam(sp);

  const where: Prisma.ProjectInquiryWhereInput = {};
  if (q) where.OR = [{ fullName: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { company: { contains: q, mode: "insensitive" } }, { projectName: { contains: q, mode: "insensitive" } }];
  if (status && (INQUIRY_STATUSES as string[]).includes(status)) where.status = status as InquiryStatus;
  if (service) where.service = service;
  if (assignee === "me") where.assignedToId = user.id;
  else if (assignee === "unassigned") where.assignedToId = null;
  else if (assignee) where.assignedToId = assignee;
  if (from || to) where.createdAt = { ...(from ? { gte: new Date(`${from}T00:00:00+05:00`) } : {}), ...(to ? { lte: new Date(`${to}T23:59:59+05:00`) } : {}) };

  const prisma = getPrisma();
  const [total, rows, team] = await Promise.all([
    prisma.projectInquiry.count({ where }),
    prisma.projectInquiry.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, select: { id: true, fullName: true, company: true, email: true, service: true, budget: true, timeline: true, status: true, createdAt: true, assignedTo: { select: { name: true } }, _count: { select: { attachments: true } } } }),
    prisma.user.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const query = { q, status, service, assignee, from, to };

  return (
    <>
      <PageHeader
        title="Project inquiries"
        description="Every submission from the Start a Project form, newest first."
        actions={can(user.role, "export") ? <a href="/admin/api/export?type=inquiries" className={btnGhostCls}>Export CSV</a> : undefined}
      />

      <Card className="mb-4">
        <form method="get" className="grid gap-3 md:grid-cols-6">
          <input name="q" defaultValue={q} placeholder="Search name, email, company, project" className={`${inputCls} md:col-span-2`} />
          <select name="status" defaultValue={status} className={inputCls}>
            <option value="">All statuses</option>
            {INQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select name="service" defaultValue={service} className={inputCls}>
            <option value="">All services</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
          <select name="assignee" defaultValue={assignee} className={inputCls}>
            <option value="">Any owner</option>
            <option value="me">Assigned to me</option>
            <option value="unassigned">Unassigned</option>
            {team.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input type="date" name="from" defaultValue={from} className={inputCls} aria-label="From date" />
            <input type="date" name="to" defaultValue={to} className={inputCls} aria-label="To date" />
          </div>
          <div className="flex gap-2 md:col-span-6">
            <button type="submit" className={btnCls}>
              Apply filters
            </button>
            <Link href="/admin/inquiries" className={btnGhostCls}>
              Reset
            </Link>
          </div>
        </form>
      </Card>

      <Card>
        {rows.length === 0 ? (
          <Empty>No inquiries match these filters.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <Th>Contact</Th>
                  <Th>Service</Th>
                  <Th>Budget · Timeline</Th>
                  <Th>Status</Th>
                  <Th>Owner</Th>
                  <Th>Files</Th>
                  <Th>Received</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <Td>
                      <Link href={`/admin/inquiries/${r.id}`} className="font-medium text-navy hover:underline">
                        {r.fullName}
                      </Link>
                      <div className="text-xs text-slate-500">
                        {r.company} · {r.email}
                      </div>
                    </Td>
                    <Td>{r.service}</Td>
                    <Td className="whitespace-nowrap text-slate-600">
                      {r.budget} · {r.timeline}
                    </Td>
                    <Td>
                      <StatusBadge status={r.status} />
                    </Td>
                    <Td>{r.assignedTo?.name ?? <span className="text-slate-400">—</span>}</Td>
                    <Td className="tabular-nums">{r._count.attachments || <span className="text-slate-400">0</span>}</Td>
                    <Td className="whitespace-nowrap text-slate-500">{fmtDate(r.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pageCount={pageCount} total={total} buildHref={(p) => `/admin/inquiries${buildQuery({ ...query, page: p })}`} />
      </Card>
    </>
  );
}
