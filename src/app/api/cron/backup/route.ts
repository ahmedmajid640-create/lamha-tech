import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { runBackup } from "@/lib/server/backup";
import { isDatabaseConfigured } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Nightly encrypted database backup (schedule in vercel.json). Vercel Cron calls this with
 * `Authorization: Bearer <CRON_SECRET>`; anything else is rejected. Never returns row data.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret ?? ""}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (!secret || secret.length < 16 || a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false, error: { code: "database_not_configured" } }, { status: 503 });
  try {
    const result = await runBackup("cron", "cron@vercel");
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[cron/backup] failed:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ ok: false, error: { code: "backup_failed" } }, { status: 500 });
  }
}
