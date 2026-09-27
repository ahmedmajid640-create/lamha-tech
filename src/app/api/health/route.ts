import { NextResponse } from "next/server";
import { getBackend } from "@/lib/server/repositories";
import { getPrisma } from "@/lib/server/db";
import { getFileStorage } from "@/lib/server/files";
import { isEmailConfigured } from "@/lib/server/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/health — deployment verification. Reports which backends are active and whether
 * the database answers. Never exposes secrets or connection strings.
 */
export async function GET() {
  const backend = getBackend();
  let database: "ok" | "error" | "not_configured" = "not_configured";
  if (backend === "postgres") {
    try {
      await getPrisma().$queryRaw`SELECT 1`;
      database = "ok";
    } catch {
      database = "error";
    }
  }
  const body = {
    ok: database !== "error",
    time: new Date().toISOString(),
    persistence: backend,
    database,
    storage: getFileStorage().provider,
    email: isEmailConfigured() ? "configured" : "not_configured",
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
  };
  return NextResponse.json(body, { status: body.ok ? 200 : 503, headers: { "cache-control": "no-store" } });
}
