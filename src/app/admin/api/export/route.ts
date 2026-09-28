import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/auth";
import { can } from "@/lib/server/rbac";
import { audit } from "@/lib/server/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const cols = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : v instanceof Date ? v.toISOString() : String(v);
    // Neutralise spreadsheet formula injection and quote.
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\r\n");
}

/** GET /admin/api/export?type=inquiries|applications|contacts — CSV for MANAGER and above. */
export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  if (!can(user.role, "export")) return NextResponse.json({ ok: false }, { status: 403 });
  const type = new URL(req.url).searchParams.get("type");
  const prisma = getPrisma();
  let rows: Record<string, unknown>[] = [];
  if (type === "inquiries") {
    rows = (await prisma.projectInquiry.findMany({ orderBy: { createdAt: "desc" }, include: { assignedTo: { select: { email: true } } } })).map((r) => ({
      id: r.id, createdAt: r.createdAt, status: r.status, fullName: r.fullName, company: r.company, email: r.email, phone: r.phone, country: r.country, projectName: r.projectName, service: r.service, industry: r.industry, stage: r.stage, budget: r.budget, timeline: r.timeline, assignedTo: r.assignedTo?.email ?? "", source: r.source, description: r.description,
    }));
  } else if (type === "applications") {
    rows = (await prisma.jobApplication.findMany({ orderBy: { createdAt: "desc" }, include: { assignedTo: { select: { email: true } } } })).map((r) => ({
      id: r.id, createdAt: r.createdAt, status: r.status, role: r.roleTitle, name: r.name, email: r.email, phone: r.phone, portfolio: r.portfolio, linkedin: r.linkedin, github: r.github, cv: r.cvOriginalName, assignedTo: r.assignedTo?.email ?? "",
    }));
  } else if (type === "contacts") {
    rows = (await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } })).map((r) => ({ id: r.id, createdAt: r.createdAt, status: r.status, name: r.name, email: r.email, topic: r.topic, message: r.message }));
  } else {
    return NextResponse.json({ ok: false, error: { code: "bad_request" } }, { status: 400 });
  }
  await audit({ actor: user, action: "export.created", entityType: type, details: { rows: rows.length } });
  return new NextResponse(csv(rows), {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="lamha-${type}-${new Date().toISOString().slice(0, 10)}.csv"`, "cache-control": "private, no-store" },
  });
}
