import "server-only";
import { NextResponse } from "next/server";
import { rateLimit, type RateLimitOptions } from "./rate-limit";

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function requestMeta(req: Request) {
  return {
    userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
    referer: req.headers.get("referer")?.slice(0, 300) ?? null,
    locale: req.headers.get("accept-language")?.slice(0, 60) ?? null,
  };
}

export type ApiError = {
  ok: false;
  error: { code: string; message: string; fieldErrors?: Record<string, string> };
};

export function apiError(status: number, code: string, message: string, fieldErrors?: Record<string, string>, headers?: HeadersInit) {
  const body: ApiError = { ok: false, error: { code, message, ...(fieldErrors ? { fieldErrors } : {}) } };
  return NextResponse.json(body, { status, headers });
}

/** Returns a 429 response if the client exceeded the limit, otherwise null. */
export function enforceRateLimit(req: Request, scope: string, options: RateLimitOptions) {
  const ip = getClientIp(req);
  const result = rateLimit(`${scope}:${ip}`, options);
  if (result.ok) return null;
  return apiError(
    429,
    "rate_limited",
    "Too many submissions from this connection. Please wait a few minutes and try again.",
    undefined,
    { "Retry-After": String(result.retryAfterSeconds) },
  );
}

/** Reject oversized bodies early using Content-Length when available. */
export function bodyTooLarge(req: Request, maxBytes: number): boolean {
  const len = Number(req.headers.get("content-length") ?? 0);
  return Number.isFinite(len) && len > maxBytes;
}

/** Flatten zod issues into { field: message }. */
export function flattenIssues(issues: { path: PropertyKey[]; message: string }[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path.map(String).join(".") || "_form";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
