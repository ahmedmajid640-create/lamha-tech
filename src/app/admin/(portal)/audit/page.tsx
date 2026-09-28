import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { requirePermission } from "@/lib/server/auth";
import { getPrisma } from "@/lib/server/db";
import { describeAction } from "@/components/admin/Activity";
import { Card, Empty, PAGE_SIZE, PageHeader, Pagination, Td, Th, btnCls, btnGhostCls, buildQuery, fmtDate, inputCls, pageParam, param } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Audit log" };

const ENTITY_LINK: Record<string, string> = { inquiry: "/admin/inquiries/", application: "/admin/applications/", cv: "/admin/applications/", contact: "/admin/contacts/", attachment: "/admin/inquiries" };

export default async function AuditPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requirePermission("view:audit");
  const sp = await searchParams;
  const q = param(sp, "q");
  const action = param(sp, "action", 60);
  const entity = param(sp, "entity", 40);
  const page = pageParam(sp);
  const where: Prisma.AuditLogWhereInput = {};
  if (q) where.OR = [{ actorEmail: { contains: q, mode: "insensitive" } }, { entityId: { contains: q } }];
  if (action) where.action = { startsWith: action };
  if (entity) where.entityType = entity;
  const prisma = getPrisma();
  const [total, rows, actions] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.auditLog.groupBy({ by: ["action"], _count: { _all: true }, orderBy: { action: "asc" } }),
  ]);
  const pageCount = Math.ceil(total / PAGE_SIZE);
  return (
    <>
      <PageHeader title="Audit log" description="Append-only record of sign-ins, status changes, assignments, notes, downloads, exports and user administration." />
      <Card className="mb-4">
        <form method="get" className="grid gap-3 md:grid-cols-5">
          <input name="q" defaultValue={q} placeholder="Actor email or record ID" className={`${inputCls} md:col-span-2`} />
          <select name="action" defaultValue={action} className={inputCls}>
            <option value="">All actions</option>
            {actions.map((a) => (
              <option key={a.action} value={a.action}>
                {a.action} ({a._count._all})
              </option>
            ))}
          </select>
          <select name="entity" defaultValue={entity} className={inputCls}>
            <option value="">All record types</option>
            {["inquiry", "application", "contact", "user", "cv", "attachment", "inquiries", "applications", "contacts"].map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button type="submit" className={btnCls}>
              Filter
            </button>
            <Link href="/admin/audit" className={btnGhostCls}>
              Reset
            </Link>
          </div>
        </form>
      </Card>
      <Card>
        {rows.length === 0 ? (
          <Empty>No audit entries match.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <Th>When</Th>
                  <Th>Actor</Th>
                  <Th>Action</Th>
                  <Th>Record</Th>
                  <Th>Detail</Th>
                  <Th>IP</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => {
                  const base = ENTITY_LINK[r.entityType];
                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <Td className="whitespace-nowrap text-slate-500">{fmtDate(r.createdAt)}</Td>
                      <Td className="whitespace-nowrap">{r.actorEmail}</Td>
                      <Td className="font-mono text-xs">{r.action}</Td>
                      <Td className="font-mono text-xs">
                        {r.entityType}
                        {r.entityId && (
                          <>
                            {" "}
                            {base && base.endsWith("/") ? (
                              <Link href={`${base}${r.entityId}`} className="text-blue hover:underline">
                                {r.entityId.slice(0, 8)}…
                              </Link>
                            ) : (
                              <span className="text-slate-500">{r.entityId.slice(0, 8)}…</span>
                            )}
                          </>
                        )}
                      </Td>
                      <Td className="text-slate-700">{describeAction(r)}</Td>
                      <Td className="font-mono text-xs text-slate-500">{r.ip ?? "—"}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pageCount={pageCount} total={total} buildHref={(p) => `/admin/audit${buildQuery({ q, action, entity, page: p })}`} />
      </Card>
    </>
  );
}
