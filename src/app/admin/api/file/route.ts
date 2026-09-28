import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { get } from "@vercel/blob";
import { getPrisma } from "@/lib/server/db";
import { getSessionUser } from "@/lib/server/auth";
import { can } from "@/lib/server/rbac";
import { audit } from "@/lib/server/audit";
import { DATA_DIR } from "@/lib/server/files";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /admin/api/file?kind=attachment|cv&id=<record id>
 * Streams a privately stored upload to an authorised portal user. Files are located through the
 * database record, never by client-supplied storage keys, and every download is audited.
 */
export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  if (!can(user.role, "files:download")) return NextResponse.json({ ok: false, error: { code: "forbidden" } }, { status: 403 });

  const url = new URL(req.url);
  const kind = url.searchParams.get("kind");
  const id = url.searchParams.get("id") ?? "";
  if (!/^[a-zA-Z0-9-]{8,64}$/.test(id) || (kind !== "attachment" && kind !== "cv")) {
    return NextResponse.json({ ok: false, error: { code: "bad_request" } }, { status: 400 });
  }

  const prisma = getPrisma();
  let file: { provider: string; key: string; name: string; mime: string } | null = null;
  if (kind === "attachment") {
    const a = await prisma.projectAttachment.findUnique({ where: { id } });
    if (a) file = { provider: a.storageProvider, key: a.storageKey, name: a.originalName, mime: a.mimeType };
  } else {
    const app = await prisma.jobApplication.findUnique({ where: { id }, select: { cvStorageProvider: true, cvStorageKey: true, cvOriginalName: true, cvMimeType: true } });
    if (app?.cvStorageKey) file = { provider: app.cvStorageProvider ?? "local", key: app.cvStorageKey, name: app.cvOriginalName ?? "cv", mime: app.cvMimeType ?? "application/octet-stream" };
  }
  if (!file) return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });

  const safeName = file.name.replace(/[^\w.\- ]+/g, "_");
  const headers = {
    "content-type": file.mime,
    "content-disposition": `attachment; filename="${safeName}"`,
    "cache-control": "private, no-store",
    "x-content-type-options": "nosniff",
  };

  try {
    let body: BodyInit;
    if (file.provider === "vercel-blob") {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (!token) return NextResponse.json({ ok: false, error: { code: "storage_unavailable" } }, { status: 503 });
      const result = await get(file.key, { access: "private", token });
      if (!result || result.statusCode !== 200 || !result.stream) return NextResponse.json({ ok: false, error: { code: "not_found" } }, { status: 404 });
      body = result.stream;
    } else {
      const full = path.join(DATA_DIR, "uploads", ...file.key.split("/"));
      body = new Uint8Array(await fs.readFile(full));
    }
    await audit({ actor: user, action: "file.downloaded", entityType: kind, entityId: id, details: { name: file.name } });
    return new NextResponse(body, { status: 200, headers });
  } catch (err) {
    console.error("[admin/file] download failed:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ ok: false, error: { code: "download_failed" } }, { status: 500 });
  }
}
