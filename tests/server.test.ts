import { describe, expect, it } from "vitest";
import { validateFiles } from "@/lib/server/uploads";
import { cleanLine, cleanText, nullable } from "@/lib/server/sanitize";
import { rateLimit } from "@/lib/server/rate-limit";
import { rejectCrossSite, submittedTooFast, flattenIssues } from "@/lib/server/request";

const RULES = { maxFiles: 3, maxBytesPerFile: 10 * 1024 * 1024, allowedExtensions: ["pdf", "doc", "docx"] };
const file = (name: string, bytes: number[] | Uint8Array, type = "application/pdf") => new File([new Uint8Array(bytes)], name, { type });
const PDF = [0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34];
const ZIP = [0x50, 0x4b, 0x03, 0x04, 0, 0, 0, 0];

describe("validateFiles", () => {
  it("accepts a real PDF", async () => {
    const r = await validateFiles([file("brief.pdf", PDF)], RULES);
    expect(r.ok).toBe(true);
  });
  it("rejects a PDF extension with non-PDF bytes", async () => {
    const r = await validateFiles([file("fake.pdf", [0x68, 0x65, 0x6c, 0x6c, 0x6f])], RULES);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("bad_type");
  });
  it("rejects disallowed extensions", async () => {
    const r = await validateFiles([file("tool.exe", PDF, "application/octet-stream")], RULES);
    expect(r.ok).toBe(false);
  });
  it("rejects a mismatching declared MIME type", async () => {
    const r = await validateFiles([file("brief.pdf", PDF, "text/html")], RULES);
    expect(r.ok).toBe(false);
  });
  it("accepts DOCX (zip container) and rejects too many files", async () => {
    expect((await validateFiles([file("cv.docx", ZIP, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")], RULES)).ok).toBe(true);
    const many = [1, 2, 3, 4].map((i) => file(`f${i}.pdf`, PDF));
    const r = await validateFiles(many, RULES);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("too_many");
  });
  it("rejects oversized files", async () => {
    const r = await validateFiles([file("big.pdf", new Uint8Array(20))], { ...RULES, maxBytesPerFile: 10 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("too_large");
  });
});

describe("sanitize", () => {
  it("strips control characters and normalises whitespace", () => {
    expect(cleanText("hello\u0000 world\r\nnext  ")).toBe("hello world\nnext");
    expect(cleanLine("  a \n b  ")).toBe("a b");
    expect(nullable("")).toBeNull();
    expect(nullable("x")).toBe("x");
  });
  it("truncates to the maximum length", () => {
    expect(cleanText("a".repeat(50), 10)).toHaveLength(10);
  });
});

describe("rateLimit", () => {
  it("allows up to the limit then blocks with a retry hint", () => {
    const key = `t-${Math.random()}`;
    for (let i = 0; i < 3; i++) expect(rateLimit(key, { limit: 3, windowMs: 60_000 }).ok).toBe(true);
    const blocked = rateLimit(key, { limit: 3, windowMs: 60_000 });
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });
});

describe("request guards", () => {
  const req = (headers: Record<string, string>) => new Request("https://lamha.example/api/x", { method: "POST", headers });
  it("rejects a cross-site origin and accepts same-origin or absent origin", async () => {
    expect(rejectCrossSite(req({ host: "lamha.example", origin: "https://evil.example" }))).not.toBeNull();
    expect(rejectCrossSite(req({ host: "lamha.example", origin: "https://lamha.example" }))).toBeNull();
    expect(rejectCrossSite(req({ host: "lamha.example" }))).toBeNull();
    expect(rejectCrossSite(req({ "x-forwarded-host": "lamha-tech.vercel.app", host: "internal", origin: "https://lamha-tech.vercel.app" }))).toBeNull();
  });
  it("flags instant submissions only when a start time is supplied", () => {
    expect(submittedTooFast(String(Date.now()))).toBe(true);
    expect(submittedTooFast(String(Date.now() - 10_000))).toBe(false);
    expect(submittedTooFast(undefined)).toBe(false);
    expect(submittedTooFast("garbage")).toBe(false);
  });
  it("flattens zod-style issues to first message per field", () => {
    expect(flattenIssues([{ path: ["email"], message: "bad" }, { path: ["email"], message: "worse" }, { path: [], message: "form" }])).toEqual({ email: "bad", _form: "form" });
  });
});
