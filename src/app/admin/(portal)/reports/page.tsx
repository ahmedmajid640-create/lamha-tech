import type { Metadata } from "next";
import { requirePermission } from "@/lib/server/auth";
import { can } from "@/lib/server/rbac";
import { getPrisma } from "@/lib/server/db";
import { Card, Empty, PageHeader, btnGhostCls, inputCls, btnCls, param } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Reports" };

function tally<T>(items: T[], key: (t: T) => string): [string, number][] {
  const m = new Map<string, number>();
  for (const it of items) {
    const k = key(it) || "—";
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function Bars({ data, total }: { data: [string, number][]; total: number }) {
  if (data.length === 0) return <Empty>No data in this period.</Empty>;
  return (
    <ul className="space-y-2">
      {data.map(([label, n]) => (
        <li key={label}>
          <div className="flex items-center justify-between text-sm">
            <span className="truncate pr-3 text-slate-800">{label}</span>
            <span className="font-mono tabular-nums text-slate-600">
              {n} <span className="text-slate-400">({total ? Math.round((n / total) * 100) : 0}%)</span>
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded bg-slate-100">
            <div className="h-1.5 rounded bg-blue" style={{ width: `${total ? Math.max(2, (n / total) * 100) : 0}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requirePermission("view:reports");
  const sp = await searchParams;
  const days = Math.min(Math.max(Number.parseInt(param(sp, "days", 4), 10) || 90, 7), 730);
  const since = new Date(new Date().getTime() - days * 86400000);
  const prisma = getPrisma();
  const [inq, apps, contacts, prevInq] = await Promise.all([
    prisma.projectInquiry.findMany({ where: { createdAt: { gte: since } }, select: { status: true, service: true, budget: true, timeline: true, stage: true, industry: true, country: true, createdAt: true, source: true } }),
    prisma.jobApplication.findMany({ where: { createdAt: { gte: since } }, select: { status: true, roleTitle: true, createdAt: true } }),
    prisma.contactMessage.findMany({ where: { createdAt: { gte: since } }, select: { status: true, topic: true } }),
    prisma.projectInquiry.count({ where: { createdAt: { gte: new Date(since.getTime() - days * 86400000), lt: since } } }),
  ]);
  const real = inq.filter((i) => i.status !== "SPAM");
  const won = real.filter((i) => i.status === "WON").length;
  const lost = real.filter((i) => i.status === "LOST").length;
  const monthKey = (d: Date) => new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "Asia/Karachi" }).format(d);
  const byMonth = tally(inq, (i) => monthKey(i.createdAt)).sort((a, b) => new Date(`01 ${a[0]}`).getTime() - new Date(`01 ${b[0]}`).getTime());
  const delta = prevInq === 0 ? null : Math.round(((inq.length - prevInq) / prevInq) * 100);

  return (
    <>
      <PageHeader
        title="Reports"
        description={`Inquiries, applications and messages received in the last ${days} days.`}
        actions={
          <form method="get" className="flex items-center gap-2">
            <select name="days" defaultValue={String(days)} className={inputCls}>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="180">Last 180 days</option>
              <option value="365">Last 12 months</option>
            </select>
            <button type="submit" className={btnCls}>
              Apply
            </button>
          </form>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Inquiries</p>
          <p className="mt-2 font-display text-3xl font-semibold text-navy tabular-nums">{inq.length}</p>
          <p className="mt-1 text-xs text-slate-500">{delta === null ? "No prior-period data" : `${delta >= 0 ? "+" : ""}${delta}% vs previous ${days} days`}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Win rate (closed)</p>
          <p className="mt-2 font-display text-3xl font-semibold text-navy tabular-nums">{won + lost ? Math.round((won / (won + lost)) * 100) : 0}%</p>
          <p className="mt-1 text-xs text-slate-500">
            {won} won · {lost} lost · {real.length - won - lost} open
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Applications</p>
          <p className="mt-2 font-display text-3xl font-semibold text-navy tabular-nums">{apps.length}</p>
          <p className="mt-1 text-xs text-slate-500">{apps.filter((a) => a.status === "HIRED").length} hired</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Contact messages</p>
          <p className="mt-2 font-display text-3xl font-semibold text-navy tabular-nums">{contacts.length}</p>
          <p className="mt-1 text-xs text-slate-500">{contacts.filter((c) => c.status === "NEW").length} awaiting reply</p>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Inquiries by month">
          <Bars data={byMonth} total={inq.length} />
        </Card>
        <Card title="Inquiries by status">
          <Bars data={tally(inq, (i) => i.status)} total={inq.length} />
        </Card>
        <Card title="Inquiries by service">
          <Bars data={tally(inq, (i) => i.service)} total={inq.length} />
        </Card>
        <Card title="Inquiries by budget">
          <Bars data={tally(inq, (i) => i.budget ?? "")} total={inq.length} />
        </Card>
        <Card title="Inquiries by industry">
          <Bars data={tally(inq, (i) => i.industry ?? "")} total={inq.length} />
        </Card>
        <Card title="Inquiries by country">
          <Bars data={tally(inq, (i) => i.country ?? "")} total={inq.length} />
        </Card>
        <Card title="Applications by role">
          <Bars data={tally(apps, (a) => a.roleTitle)} total={apps.length} />
        </Card>
        <Card title="Applications by stage">
          <Bars data={tally(apps, (a) => a.status)} total={apps.length} />
        </Card>
        <Card title="Contact messages by topic">
          <Bars data={tally(contacts, (c) => c.topic)} total={contacts.length} />
        </Card>
        {can(user.role, "export") && (
          <Card title="Exports">
            <p className="text-sm text-slate-600">Full CSV exports of every record (not limited to the selected period). Downloads are audited.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="/admin/api/export?type=inquiries" className={btnGhostCls}>
                Inquiries CSV
              </a>
              <a href="/admin/api/export?type=applications" className={btnGhostCls}>
                Applications CSV
              </a>
              <a href="/admin/api/export?type=contacts" className={btnGhostCls}>
                Contacts CSV
              </a>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
