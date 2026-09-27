import { NextResponse, after } from "next/server";
import { randomUUID } from "node:crypto";
import { applicationSchema, CV_RULES } from "@/lib/validation/application";
import type { ApplicationRecord } from "@/lib/server/storage";
import { getRepositories } from "@/lib/server/repositories";
import { validateFiles, storeFiles } from "@/lib/server/uploads";
import { cleanLine, cleanText, formDataToObject, nullable } from "@/lib/server/sanitize";
import { apiError, bodyTooLarge, enforceRateLimit, flattenIssues, requestMeta } from "@/lib/server/request";
import { notify } from "@/lib/server/notify";
import { jobs } from "@/data/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * POST /api/applications — job application intake (multipart/form-data).
 * Flow: validation → job upsert → persistence → private CV storage → email/webhook → 201.
 */
export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "applications", { limit: 8, windowMs: 10 * 60 * 1000 });
  if (limited) return limited;

  if (bodyTooLarge(req, CV_RULES.maxBytes + 256 * 1024)) {
    return apiError(413, "payload_too_large", "The submission is too large. Please attach a smaller CV.");
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
  if (raw.website && raw.website.length > 0) {
    return NextResponse.json({ ok: true, id: randomUUID(), discarded: true }, { status: 201 });
  }

  const parsed = applicationSchema.safeParse({ ...raw, consent: raw.consent === "true" || raw.consent === "on" });
  if (!parsed.success) {
    return apiError(400, "validation_error", "Please correct the highlighted fields.", flattenIssues(parsed.error.issues));
  }

  const job = jobs.find((j) => j.slug === parsed.data.roleSlug);
  if (!job || (job.status !== "open" && job.status !== "demo")) {
    return apiError(400, "validation_error", "This role is not accepting applications.", { role: "Unknown role." });
  }

  const cvFile = formData.get("cv");
  const files = cvFile instanceof File && cvFile.size > 0 ? [cvFile] : [];
  if (files.length === 0) {
    return apiError(400, "validation_error", "Please attach your CV.", { cv: "Please attach your CV (PDF, DOC or DOCX)." });
  }
  const validation = await validateFiles(files, { maxFiles: 1, maxBytesPerFile: CV_RULES.maxBytes, allowedExtensions: CV_RULES.allowedExtensions });
  if (!validation.ok) {
    return apiError(400, "attachment_error", validation.error.message, { cv: validation.error.message });
  }

  const id = randomUUID();
  const d = parsed.data;
  const repositories = getRepositories();

  try {
    const jobId = await repositories.ensureJob(job);
    const [cv] = await storeFiles(validation.files, `applications/${id}`);
    const meta = requestMeta(req);

    const record: ApplicationRecord = {
      id,
      jobId,
      role: job.title,
      roleSlug: job.slug,
      name: cleanLine(d.name, 100),
      email: cleanLine(d.email, 254),
      phone: nullable(cleanLine(d.phone ?? "", 40)),
      portfolio: nullable(cleanLine(d.portfolio ?? "", 300)),
      linkedin: nullable(cleanLine(d.linkedin ?? "", 300)),
      github: nullable(cleanLine(d.github ?? "", 300)),
      coverLetter: nullable(cleanText(d.coverLetter ?? "", 5000)),
      cv: cv ?? null,
      consent: true,
      source: "website:careers",
      createdAt: new Date().toISOString(),
      status: "new",
      meta: { userAgent: meta.userAgent, referer: meta.referer },
    };

    await repositories.createApplication(record);

    after(async () => {
      const result = await notify("application.created", record);
      if (result.emailed) await repositories.markNotified("application", record.id).catch(() => undefined);
    });

    return NextResponse.json({ ok: true, id: record.id }, { status: 201 });
  } catch (err) {
    console.error("[api/applications] failed to persist application:", err instanceof Error ? err.message : "unknown error");
    return apiError(500, "server_error", "We could not save your application right now. Please try again shortly.");
  }
}

export async function GET() {
  return apiError(405, "method_not_allowed", "Use POST to submit an application.", undefined, { Allow: "POST" });
}
