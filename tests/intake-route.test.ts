import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactRecord } from "@/lib/server/storage";

// In-memory repository double.
const store: ContactRecord[] = [];
const repo = {
  backend: "memory",
  createContact: vi.fn(async (r: ContactRecord) => {
    store.push(r);
  }),
  findRecentDuplicate: vi.fn(async () => null),
  markNotified: vi.fn(async () => undefined),
};
vi.mock("@/lib/server/repositories", () => ({ getRepositories: () => repo }));

// Notification double: default succeeds; individual tests override.
type NotifyResult = { emailed: boolean; emailError?: string; webhooked: boolean; configured: boolean };
const notifyMock = vi.fn(async (): Promise<NotifyResult> => ({ emailed: true, webhooked: false, configured: true }));
vi.mock("@/lib/server/notify", () => ({ notify: (...a: unknown[]) => notifyMock(...(a as [])) }));

// Run `after()` callbacks inline so assertions can observe them.
vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return { ...actual, after: (fn: () => Promise<void> | void) => Promise.resolve().then(fn) };
});

const HOST = "lamhatechnologies.com";
function post(body: unknown, ip = "203.0.113.10") {
  return new Request(`https://${HOST}/api/contact`, {
    method: "POST",
    headers: { "content-type": "application/json", host: HOST, origin: `https://${HOST}`, "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}
const valid = { name: "Bilal Ahmed", email: "bilal@example.com", topic: "New project", message: "We would like to discuss a mobile app for field teams.", consent: true, website: "" };

beforeEach(() => {
  store.length = 0;
  repo.createContact.mockClear();
  repo.markNotified.mockClear();
  notifyMock.mockClear();
  notifyMock.mockResolvedValue({ emailed: true, webhooked: false, configured: true });
});

describe("POST /api/contact", () => {
  it("saves a valid submission, returns 201 and triggers the notification", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(post(valid, "203.0.113.1"));
    expect(res.status).toBe(201);
    const json = (await res.json()) as { ok: boolean; id: string };
    expect(json.ok).toBe(true);
    expect(store).toHaveLength(1);
    expect(store[0]).toMatchObject({ email: "bilal@example.com", topic: "New project", status: "new" });
    await new Promise((r) => setTimeout(r, 0));
    expect(notifyMock).toHaveBeenCalledWith("contact.created", expect.objectContaining({ id: json.id }));
    expect(repo.markNotified).toHaveBeenCalledWith("contact", json.id);
  });

  it("keeps the database record and still returns 201 when the email fails", async () => {
    notifyMock.mockResolvedValue({ emailed: false, emailError: "validation_error: domain not verified", webhooked: false, configured: true });
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(post({ ...valid, email: "fail@example.com" }, "203.0.113.2"));
    expect(res.status).toBe(201);
    expect(store.some((r) => r.email === "fail@example.com")).toBe(true);
    await new Promise((r) => setTimeout(r, 0));
    expect(notifyMock).toHaveBeenCalledTimes(1);
    expect(repo.markNotified).not.toHaveBeenCalled();
  });

  it("keeps the record when email is not configured at all", async () => {
    notifyMock.mockResolvedValue({ emailed: false, emailError: "email_not_configured", webhooked: false, configured: false });
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(post({ ...valid, email: "noconfig@example.com" }, "203.0.113.3"));
    expect(res.status).toBe(201);
    expect(store.some((r) => r.email === "noconfig@example.com")).toBe(true);
  });

  it("rejects invalid data with field errors and writes nothing", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(post({ ...valid, email: "not-an-email", message: "" }, "203.0.113.4"));
    expect(res.status).toBe(400);
    const json = (await res.json()) as { ok: boolean; error: { code: string; fieldErrors?: Record<string, string> } };
    expect(json.error.code).toBe("validation_error");
    expect(json.error.fieldErrors?.email).toBeTruthy();
    expect(store).toHaveLength(0);
    expect(notifyMock).not.toHaveBeenCalled();
  });

  it("silently discards honeypot submissions without saving or emailing", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(post({ ...valid, website: "http://spam.example" }, "203.0.113.5"));
    expect(res.status).toBe(201);
    expect((await res.json()).discarded).toBe(true);
    expect(store).toHaveLength(0);
    expect(notifyMock).not.toHaveBeenCalled();
  });

  it("rejects cross-site requests", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const req = new Request(`https://${HOST}/api/contact`, { method: "POST", headers: { "content-type": "application/json", host: HOST, origin: "https://evil.example" }, body: JSON.stringify(valid) });
    const res = await POST(req);
    expect(res.status).toBe(403);
    expect(store).toHaveLength(0);
  });
});
