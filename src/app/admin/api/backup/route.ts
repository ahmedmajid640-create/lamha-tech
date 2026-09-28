import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { can } from "@/lib/server/rbac";
import { audit } from "@/lib/server/audit";
import { getFileStorage } from "@/lib/server/files";
import { isBackupKey } from "@/lib/server/backup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /admin/api/backup?key=backups/... — Owner-only download of an encrypted backup file. Audited. */
export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  if (!can(user.role, "backups:download")) return NextResponse.json({ ok: false, error: { code: "forbidden" } }, { status: 403 });
  const key = new URL(req.url).searchParams.get("key") ?? "";
  if (!isBackupKey(key)) return NextResponse.json({ ok: false, error: { code: "bad_request" } }, { status: 400 });
  try {
    const bytes = await getFileStorage().read(key);
    await audit({ actor: user, action: "backup.downloaded", entityType: "backup", entityId: key, details: { bytes: bytes.byteLength } });
    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "content-type": "application/octet-stream",
        "content-disposition": `attachment; filename="${key.split("/").pop()}"`,
        "cache-control": "private, no-store",
        "x-content-type-options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[admin/backup] download failed:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
  }
}
