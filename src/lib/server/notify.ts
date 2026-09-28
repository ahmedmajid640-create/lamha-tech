import "server-only";
import { site } from "@/data/site";
import { renderNotification, sendEmail } from "./email";
import { getFileStorage } from "./files";
import type { ApplicationRecord, ContactRecord, LeadRecord, StoredAttachment } from "./storage";

/**
 * Outbound notifications for new records:
 *   1. internal email (Resend when configured)
 *   2. optional outbound webhook (LEAD_WEBHOOK_URL) — the seam for CRM / LinkedOut / Dialer / Slack
 *
 * Failures never fail the user's submission: the record is already persisted.
 */
export type NotificationKind = "lead.created" | "application.created" | "contact.created";

export type NotifyResult = { emailed: boolean; emailError?: string; webhooked: boolean };

function attachmentLines(files: StoredAttachment[]): string {
  if (files.length === 0) return "None";
  const storage = getFileStorage();
  return files.map((a) => `${a.originalName} (${Math.round(a.size / 1024)} KB) — ${storage.getReference(a.key)}`).join("\n");
}

function siteLink(path: string) {
  return `${site.url.replace(/\/$/, "")}${path}`;
}

export function buildLeadEmail(lead: LeadRecord) {
  const subject = `New project inquiry — ${lead.service} — ${lead.fullName}${lead.company ? ` (${lead.company})` : ""}`;
  const body = renderNotification({
    title: "New project inquiry",
    intro: `Submitted via ${siteLink("/start-a-project")}. Reference ${lead.id}.`,
    rows: [
      ["Name", lead.fullName],
      ["Company", lead.company],
      ["Email", lead.email],
      ["Phone", lead.phone],
      ["Country", lead.country],
      ["Project name", lead.projectName],
      ["Service", lead.service],
      ["Industry", lead.industry],
      ["Stage", lead.stage],
      ["Budget", lead.budget],
      ["Timeline", lead.timeline],
      ["Source", lead.source],
      ["Submitted", lead.createdAt],
    ],
    longText: [
      { label: "Project description", value: lead.description },
      { label: "Attachments", value: attachmentLines(lead.attachments) },
    ],
    footer: `Open in the owner portal: ${siteLink(`/admin/inquiries/${lead.id}`)} · Reply directly to this email to contact the requester.`,
  });
  return { subject, ...body, replyTo: lead.email };
}

export function buildContactEmail(msg: ContactRecord) {
  const subject = `New contact message — ${msg.topic} — ${msg.name}`;
  const body = renderNotification({
    title: "New contact message",
    intro: `Submitted via ${siteLink("/contact")}. Reference ${msg.id}.`,
    rows: [
      ["Name", msg.name],
      ["Email", msg.email],
      ["Topic", msg.topic],
      ["Submitted", msg.createdAt],
    ],
    longText: [{ label: "Message", value: msg.message }],
    footer: `Open in the owner portal: ${siteLink(`/admin/contacts/${msg.id}`)} · Reply directly to this email to respond.`,
  });
  return { subject, ...body, replyTo: msg.email };
}

export function buildApplicationEmail(app: ApplicationRecord) {
  const subject = `New job application — ${app.role} — ${app.name}`;
  const body = renderNotification({
    title: "New job application",
    intro: `Submitted via ${siteLink(`/careers/${app.roleSlug}`)}. Reference ${app.id}.`,
    rows: [
      ["Role", app.role],
      ["Name", app.name],
      ["Email", app.email],
      ["Phone", app.phone],
      ["Portfolio", app.portfolio],
      ["LinkedIn", app.linkedin],
      ["GitHub", app.github],
      ["Submitted", app.createdAt],
    ],
    longText: [
      { label: "Cover letter", value: app.coverLetter },
      { label: "CV", value: app.cv ? attachmentLines([app.cv]) : "None" },
    ],
    footer: `Open in the owner portal: ${siteLink(`/admin/applications/${app.id}`)} · CVs are stored privately and downloadable from the portal.`,
  });
  return { subject, ...body, replyTo: app.email };
}

async function postWebhook(kind: NotificationKind, payload: Record<string, unknown>): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.LEAD_WEBHOOK_SECRET ? { "x-lamha-signature": process.env.LEAD_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify({ kind, sentAt: new Date().toISOString(), payload }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch (err) {
    console.error(`[notify] ${kind} webhook failed:`, err instanceof Error ? err.message : "unknown error");
    return false;
  }
}

export async function notify(
  kind: NotificationKind,
  record: LeadRecord | ContactRecord | ApplicationRecord,
): Promise<NotifyResult> {
  const email =
    kind === "lead.created"
      ? buildLeadEmail(record as LeadRecord)
      : kind === "contact.created"
        ? buildContactEmail(record as ContactRecord)
        : buildApplicationEmail(record as ApplicationRecord);

  const [emailResult, webhooked] = await Promise.all([
    sendEmail(email),
    postWebhook(kind, { id: record.id, createdAt: record.createdAt, record }),
  ]);

  if (!emailResult.ok && emailResult.error !== "email_not_configured" && emailResult.error !== "EMAIL_TO is not configured") {
    console.error(`[notify] ${kind} email failed (${emailResult.provider}): ${emailResult.error}`);
  }
  return { emailed: emailResult.ok, emailError: emailResult.ok ? undefined : emailResult.error, webhooked };
}
