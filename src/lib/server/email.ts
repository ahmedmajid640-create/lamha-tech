import "server-only";
import { Resend } from "resend";

/**
 * Transactional email abstraction.
 *
 *   EMAIL_API_KEY (or RESEND_API_KEY) set -> Resend
 *   otherwise                              -> console provider (logs subject only)
 *
 * EMAIL_FROM  sender, e.g. "LAMHA Website <notifications@lamhatech.com>" (domain must be verified in Resend)
 * EMAIL_TO    comma-separated internal recipients for notifications
 */
export type EmailMessage = {
  to?: string[];
  subject: string;
  text: string;
  html: string;
  /** Visitor address for replies. Never used as the sender. */
  replyTo?: string;
  /** Stable key per record so provider retries cannot produce duplicate emails. */
  idempotencyKey?: string;
};

export type EmailResult = { ok: boolean; provider: string; id?: string; error?: string };

export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage & { to: string[]; from: string }): Promise<EmailResult>;
}

class ResendProvider implements EmailProvider {
  readonly name = "resend";
  private client: Resend;
  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }
  async send(message: EmailMessage & { to: string[]; from: string }): Promise<EmailResult> {
    const { data, error } = await this.client.emails.send(
      {
        from: message.from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
        replyTo: message.replyTo,
      },
      message.idempotencyKey ? { idempotencyKey: message.idempotencyKey } : undefined,
    );
    // Resend error messages are safe, non-secret diagnostics (e.g. "domain not verified").
    if (error) return { ok: false, provider: this.name, error: `${error.name}: ${error.message}`.slice(0, 300) };
    return { ok: true, provider: this.name, id: data?.id };
  }
}

class ConsoleProvider implements EmailProvider {
  readonly name = "console";
  async send(message: EmailMessage & { to: string[]; from: string }): Promise<EmailResult> {
    // Never log message bodies (they contain user-submitted data).
    console.info(`[email:console] would send "${message.subject}" to ${message.to.join(", ")} (no EMAIL_API_KEY configured)`);
    return { ok: false, provider: this.name, error: "email_not_configured" };
  }
}

/** Read lazily so tests and serverless cold starts always see the current environment. */
export function getEmailConfig() {
  return {
    apiKey: process.env.EMAIL_API_KEY ?? process.env.RESEND_API_KEY ?? null,
    from: (process.env.EMAIL_FROM ?? "").trim() || "LAMHA Website <onboarding@resend.dev>",
    to: (process.env.EMAIL_TO ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export function isEmailConfigured(): boolean {
  const c = getEmailConfig();
  return Boolean(c.apiKey && c.to.length > 0);
}

/** "resend" | "console" — safe to expose (no secrets). */
export function emailProviderName(): string {
  return getEmailConfig().apiKey ? "resend" : "console";
}

let provider: EmailProvider | null = null;
let providerKey: string | null = null;

function getProvider(): EmailProvider {
  const { apiKey } = getEmailConfig();
  if (provider && providerKey === apiKey) return provider;
  provider = apiKey ? new ResendProvider(apiKey) : new ConsoleProvider();
  providerKey = apiKey;
  return provider;
}

/** Sends an internal notification email. Never throws. */
export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const config = getEmailConfig();
  const to = message.to && message.to.length ? message.to : config.to;
  if (to.length === 0) return { ok: false, provider: "none", error: "EMAIL_TO is not configured" };
  try {
    return await getProvider().send({ ...message, to, from: config.from });
  } catch (err) {
    return { ok: false, provider: getProvider().name, error: (err instanceof Error ? err.message : "unknown error").slice(0, 300) };
  }
}

/* ------------------------------------------------------------------ */
/* Templates                                                            */
/* ------------------------------------------------------------------ */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Row = [label: string, value: string | number | null | undefined];

export function renderNotification(args: { title: string; intro: string; rows: Row[]; longText?: { label: string; value: string | null | undefined }[]; footer?: string }): { text: string; html: string } {
  const rows = args.rows.filter(([, v]) => v !== null && v !== undefined && String(v).length > 0);
  const text = [
    args.title,
    "",
    args.intro,
    "",
    ...rows.map(([l, v]) => `${l}: ${v}`),
    ...(args.longText ?? []).flatMap(({ label, value }) => (value ? ["", `${label}:`, value] : [])),
    "",
    args.footer ?? "",
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f8fc;font-family:Inter,Segoe UI,Arial,sans-serif;color:#162033">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #dde3ec;border-radius:10px">
<tr><td style="padding:24px 28px;border-bottom:1px solid #eef2f7">
  <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#1769e0;font-weight:600">LAMHA Technologies</div>
  <h1 style="margin:8px 0 0;font-size:20px;color:#0b1b3a">${escapeHtml(args.title)}</h1>
  <p style="margin:8px 0 0;font-size:14px;color:#4f5b73">${escapeHtml(args.intro)}</p>
</td></tr>
<tr><td style="padding:8px 28px 20px">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px">
  ${rows.map(([l, v]) => `<tr><td style="padding:8px 0;color:#6b7891;width:40%;vertical-align:top;border-bottom:1px solid #eef2f7">${escapeHtml(l)}</td><td style="padding:8px 0;color:#162033;border-bottom:1px solid #eef2f7">${escapeHtml(v)}</td></tr>`).join("")}
  </table>
  ${(args.longText ?? [])
    .filter((b) => b.value)
    .map((b) => `<div style="margin-top:18px"><div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b7891;font-weight:600">${escapeHtml(b.label)}</div><div style="margin-top:6px;white-space:pre-wrap;font-size:14px;line-height:1.6;color:#162033;background:#f5f8fc;border:1px solid #eef2f7;border-radius:8px;padding:12px 14px">${escapeHtml(b.value)}</div></div>`)
    .join("")}
</td></tr>
<tr><td style="padding:14px 28px 22px;font-size:12px;color:#97a3b6;border-top:1px solid #eef2f7">${escapeHtml(args.footer ?? "")}</td></tr>
</table></td></tr></table></body></html>`;
  return { text, html };
}
