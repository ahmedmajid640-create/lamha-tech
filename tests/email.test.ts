import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { LeadRecord } from "@/lib/server/storage";

// Controllable Resend double. `sendMock` is swapped per test.
const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: (...args: unknown[]) => sendMock(...args) };
  },
}));
// No database in unit tests: failure recording is a no-op.
vi.mock("@/lib/server/db", () => ({ isDatabaseConfigured: () => false, getPrisma: () => { throw new Error("no db in tests"); } }));

const lead: LeadRecord = {
  id: "11111111-2222-4333-8444-555555555555",
  fullName: "Ayesha Khan",
  company: "Northwind Traders",
  email: "ayesha@example.com",
  phone: "+92 300 1234567",
  country: "Pakistan",
  projectName: "Inventory portal",
  service: "Web Development",
  industry: "Retail",
  description: "We need a portal for 40 branches with role-based access.",
  stage: "Idea / concept",
  budget: "$5k–$10k",
  timeline: "1–3 months",
  consent: true,
  source: "website:start-a-project",
  createdAt: "2026-09-28T10:15:00.000Z",
  status: "new",
  attachments: [],
  meta: { userAgent: null, referer: null, locale: null },
  integrations: { crmId: null, linkedOutId: null, dialerId: null },
};

const ENV = { ...process.env };
beforeEach(() => {
  vi.resetModules();
  sendMock.mockReset();
  process.env = { ...ENV };
  delete process.env.EMAIL_API_KEY;
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_FROM;
  delete process.env.EMAIL_TO;
  delete process.env.LEAD_WEBHOOK_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://lamhatechnologies.com";
});
afterEach(() => {
  process.env = ENV;
});

describe("notification email content", () => {
  it("includes the required inquiry fields, timestamp and portal link, and replies to the visitor", async () => {
    const { buildLeadEmail } = await import("@/lib/server/notify");
    const mail = buildLeadEmail(lead);
    expect(mail.subject).toContain("New project inquiry");
    for (const s of ["Ayesha Khan", "ayesha@example.com", "Northwind Traders", "Web Development", "Inventory portal", "40 branches", "2026-09-28T10:15:00.000Z", "PKT", "/admin/inquiries/11111111-2222-4333-8444-555555555555"]) {
      expect(mail.text).toContain(s);
      expect(mail.html).toContain(s.replace(/&/g, "&amp;"));
    }
    expect(mail.replyTo).toBe("ayesha@example.com");
    expect(mail.idempotencyKey).toBe("lead.created:11111111-2222-4333-8444-555555555555");
  });

  it("escapes HTML in visitor-supplied fields", async () => {
    const { buildLeadEmail } = await import("@/lib/server/notify");
    const mail = buildLeadEmail({ ...lead, fullName: '<img src=x onerror="alert(1)">' });
    expect(mail.html).not.toContain("<img src=x");
    expect(mail.html).toContain("&lt;img src=x");
  });
});

describe("sendEmail configuration handling", () => {
  it("reports missing configuration without throwing and without calling Resend", async () => {
    const { sendEmail, isEmailConfigured } = await import("@/lib/server/email");
    expect(isEmailConfigured()).toBe(false);
    const r = await sendEmail({ subject: "x", text: "x", html: "x" });
    expect(r.ok).toBe(false);
    expect(r.error).toBe("EMAIL_TO is not configured");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("uses the console provider when EMAIL_TO exists but no API key does", async () => {
    process.env.EMAIL_TO = "owner@example.com";
    const { sendEmail, isEmailConfigured } = await import("@/lib/server/email");
    expect(isEmailConfigured()).toBe(false);
    const r = await sendEmail({ subject: "x", text: "x", html: "x" });
    expect(r).toMatchObject({ ok: false, provider: "console", error: "email_not_configured" });
    expect(sendMock).not.toHaveBeenCalled();
  });
});

describe("notify() through Resend", () => {
  beforeEach(() => {
    process.env.EMAIL_API_KEY = "re_test_key_not_real";
    process.env.EMAIL_FROM = "LAMHA Website <notifications@lamhatechnologies.com>";
    process.env.EMAIL_TO = "owner@example.com, ops@example.com";
  });

  it("sends from the configured sender (never the visitor), to EMAIL_TO, with Reply-To and an idempotency key", async () => {
    sendMock.mockResolvedValue({ data: { id: "email_123" }, error: null });
    const { notify } = await import("@/lib/server/notify");
    const result = await notify("lead.created", lead);
    expect(result).toMatchObject({ emailed: true, configured: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
    const [payload, options] = sendMock.mock.calls[0] as [Record<string, unknown>, Record<string, unknown>];
    expect(payload.from).toBe("LAMHA Website <notifications@lamhatechnologies.com>");
    expect(payload.from).not.toContain("ayesha@example.com");
    expect(payload.to).toEqual(["owner@example.com", "ops@example.com"]);
    expect(payload.replyTo).toBe("ayesha@example.com");
    expect(options).toEqual({ idempotencyKey: "lead.created:11111111-2222-4333-8444-555555555555" });
    expect(JSON.stringify(payload)).not.toContain("re_test_key_not_real");
  });

  it("returns a safe failure when Resend rejects the message", async () => {
    sendMock.mockResolvedValue({ data: null, error: { name: "validation_error", message: "The lamhatechnologies.com domain is not verified." } });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { notify } = await import("@/lib/server/notify");
    const result = await notify("lead.created", lead);
    expect(result.emailed).toBe(false);
    expect(result.configured).toBe(true);
    expect(result.emailError).toContain("domain is not verified");
    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy.mock.calls.flat().join(" ")).not.toContain("re_test_key_not_real");
    errorSpy.mockRestore();
  });

  it("never throws when the provider itself throws", async () => {
    sendMock.mockRejectedValue(new Error("network down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { notify } = await import("@/lib/server/notify");
    await expect(notify("lead.created", lead)).resolves.toMatchObject({ emailed: false, emailError: "network down" });
  });
});
