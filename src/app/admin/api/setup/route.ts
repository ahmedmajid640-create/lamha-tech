import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getPrisma } from "@/lib/server/db";
import { generatePassword, hashPassword, passwordPolicyError } from "@/lib/server/auth";
import { audit } from "@/lib/server/audit";
import { apiError, enforceRateLimit } from "@/lib/server/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /admin/api/setup — creates the first OWNER account.
 * Guarded by ADMIN_SETUP_TOKEN and refuses as soon as any user exists, so it is single-use by design.
 * Body (JSON): { token, email, name, password? }  — omit password to receive a generated temporary one.
 */
export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "admin-setup", { limit: 5, windowMs: 15 * 60 * 1000 });
  if (limited) return limited;

  const expected = process.env.ADMIN_SETUP_TOKEN;
  if (!expected || expected.length < 12) return apiError(503, "setup_disabled", "Setup is not enabled on this deployment.");

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return apiError(400, "bad_request", "Expected a JSON body.");
  }
  const token = typeof body.token === "string" ? body.token : "";
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return apiError(403, "forbidden", "Invalid setup token.");

  const prisma = getPrisma();
  if ((await prisma.user.count()) > 0) return apiError(409, "already_initialised", "An account already exists; setup is closed.");

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || name.length < 2) return apiError(400, "validation_error", "Provide a valid email and name.");

  let password = typeof body.password === "string" ? body.password : "";
  let generated = false;
  if (!password) {
    password = generatePassword();
    generated = true;
  } else {
    const policy = passwordPolicyError(password);
    if (policy) return apiError(400, "validation_error", policy);
  }

  const user = await prisma.user.create({ data: { email, name, role: "OWNER", passwordHash: await hashPassword(password), mustChangePassword: true } });
  await audit({ actor: { id: user.id, email }, action: "setup.owner_created", entityType: "user", entityId: user.id });

  // The temporary password is returned once, only when generated here; it is never logged.
  return NextResponse.json({ ok: true, id: user.id, email, temporaryPassword: generated ? password : undefined, next: "/admin/login" }, { status: 201 });
}
