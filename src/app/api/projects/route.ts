import { NextResponse, after } from "next/server";
import { randomUUID } from "node:crypto";
import { projectInquirySchema, ATTACHMENT_RULES } from "@/lib/validation/project";
import type { LeadRecord } from "@/lib/server/storage";
import { getRepositories } from "@/lib/server/repositories";
import { validateFiles, storeFiles } from "@/lib/server/uploads";
import { cleanLine, cleanText, formDataToObject, nullable } from "@/lib/server/sanitize";
import { apiError, bodyTooLarge, enforceRateLimit, flattenIssues, requestMeta } from "@/lib/server/request";
import { notify } from "@/lib/server/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_BODY_BYTES = ATTACHMENT_RULES.maxFiles * ATTACHMENT_RULES.maxBytesPerFile + 256 * 1024;

/**
 * POST /api/projects — project inquiry intake (multipart/form-data).
 * Flow: validation → persistence (Postgres or file) → private attachment storage → email/webhook → 201.
 */
export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "projects", { limit: 8, windowMs: 10 * 60 * 1000 });
  if (limited) return limited;

  if (bodyTooLarge(req, MAX_BODY_BYTES)) {
    return apiError(413, "payload_too_large", "The submission is too large. Please reduce attachment sizes.");
  }
  if (!(req.headers.get("content-type") ?? "").includes("multipart/form-data")) {
    return apiError(415, "unsupported_media_type", "Expected multipart/form-data.");
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return apiError(400, "bad_request", "The form data could not be read.");
  }

  const raw = formDataToObject(formData);

  // Honeypot: silently accept and discard.
  if (raw.website && raw.website.length > 0) {
    return NextResponse.json({ ok: true, id: randomUUID(), discarded: true }, { status: 201 });
  }

  const parsed = projectInquirySchema.safeParse({ ...raw, consent: raw.consent === "true" || raw.consent === "on" });
  if (!parsed.success) {
    return apiError(400, "validation_error", "Please correct the highlighted fields.", flattenIssues(parsed.error.issues));
  }

  const files = formData.getAll("attachments").filter((v): v is File => v instanceof File);
  const validation = await validateFiles(files, ATTACHMENT_RULES);
  if (!validation.ok) {
    return apiError(400, "attachment_error", validation.error.message, { attachments: validation.error.message });
  }

  const id = randomUUID();
  const d = parsed.data;
  const repositories = getRepositories();

  try {
    const attachments = await storeFiles(validation.files, `leads/${id}`);

    const record: LeadRecord = {
      id,
      fullName: cleanLine(d.fullName, 100),
      company: nullable(cleanLine(d.company ?? "", 120)),
      email: cleanLine(d.email, 254),
      phone: nullable(cleanLine(d.phone ?? "", 40)),
      country: nullable(cleanLine(d.country ?? "", 80)),
      projectName: nullable(cleanLine(d.projectName ?? "", 120)),
      service: d.service,
      industry: nullable(cleanLine(d.industry ?? "", 120)),
      description: cleanText(d.description, 5000),
      stage: nullable(d.stage ?? ""),
      budget: nullable(d.budget ?? ""),
      timeline: nullable(d.timeline ?? ""),
      attachments,
      consent: true,
      source: nullable(cleanLine(d.source ?? "", 120)) ?? "website:start-a-project",
      createdAt: new Date().toISOString(),
      status: "new",
      meta: requestMeta(req),
      integrations: { crmId: null, linkedOutId: null, dialerId: null },
    };

    await repositories.createLead(record);

    after(async () => {
      const result = await notify("lead.created", record);
      if (result.emailed) await repositories.markNotified("lead", record.id).catch(() => undefined);
    });

    return NextResponse.json({ ok: true, id: record.id }, { status: 201 });
  } catch (err) {
    console.error("[api/projects] failed to persist lead:", err instanceof Error ? err.message : "unknown error");
    return apiError(500, "server_error", "We could not save your inquiry right now. Please try again shortly.");
  }
}

export async function GET() {
  return apiError(405, "method_not_allowed", "Use POST to submit a project inquiry.", undefined, { Allow: "POST" });
}
