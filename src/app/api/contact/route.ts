import { NextResponse, after } from "next/server";
import { randomUUID } from "node:crypto";
import { contactSchema } from "@/lib/validation/contact";
import type { ContactRecord } from "@/lib/server/storage";
import { getRepositories } from "@/lib/server/repositories";
import { cleanLine, cleanText } from "@/lib/server/sanitize";
import { apiError, bodyTooLarge, enforceRateLimit, flattenIssues, requestMeta } from "@/lib/server/request";
import { notify } from "@/lib/server/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

/** POST /api/contact — general inquiry (application/json). */
export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "contact", { limit: 8, windowMs: 10 * 60 * 1000 });
  if (limited) return limited;
  if (bodyTooLarge(req, 64 * 1024)) return apiError(413, "payload_too_large", "The message is too large.");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError(400, "bad_request", "Expected a JSON body.");
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  if (typeof raw.website === "string" && raw.website.length > 0) {
    return NextResponse.json({ ok: true, id: randomUUID(), discarded: true }, { status: 201 });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return apiError(400, "validation_error", "Please correct the highlighted fields.", flattenIssues(parsed.error.issues));
  }

  const d = parsed.data;
  const repositories = getRepositories();
  try {
    const meta = requestMeta(req);
    const record: ContactRecord = {
      id: randomUUID(),
      name: cleanLine(d.name, 100),
      email: cleanLine(d.email, 254),
      topic: d.topic,
      message: cleanText(d.message, 3000),
      consent: true,
      source: "website:contact",
      createdAt: new Date().toISOString(),
      status: "new",
      meta: { userAgent: meta.userAgent, referer: meta.referer },
    };

    await repositories.createContact(record);

    after(async () => {
      const result = await notify("contact.created", record);
      if (result.emailed) await repositories.markNotified("contact", record.id).catch(() => undefined);
    });

    return NextResponse.json({ ok: true, id: record.id }, { status: 201 });
  } catch (err) {
    console.error("[api/contact] failed to persist message:", err instanceof Error ? err.message : "unknown error");
    return apiError(500, "server_error", "We could not send your message right now. Please try again shortly.");
  }
}

export async function GET() {
  return apiError(405, "method_not_allowed", "Use POST to send a message.", undefined, { Allow: "POST" });
}
