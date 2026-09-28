import { describe, expect, it } from "vitest";
import { assignableRoles, can, roleRank } from "@/lib/server/rbac";
import { generatePassword, hashPassword, passwordPolicyError, verifyPassword } from "@/lib/server/auth";

describe("rbac", () => {
  it("orders roles from viewer to owner", () => {
    expect(roleRank("VIEWER")).toBeLessThan(roleRank("STAFF"));
    expect(roleRank("STAFF")).toBeLessThan(roleRank("MANAGER"));
    expect(roleRank("MANAGER")).toBeLessThan(roleRank("ADMIN"));
    expect(roleRank("ADMIN")).toBeLessThan(roleRank("OWNER"));
  });

  it("grants read-only access to viewers", () => {
    expect(can("VIEWER", "view:inquiries")).toBe(true);
    expect(can("VIEWER", "notes:add")).toBe(false);
    expect(can("VIEWER", "status:update")).toBe(false);
    expect(can("VIEWER", "files:download")).toBe(false);
    expect(can("VIEWER", "export")).toBe(false);
    expect(can("VIEWER", "view:users")).toBe(false);
  });

  it("scales permissions with role", () => {
    expect(can("STAFF", "notes:add")).toBe(true);
    expect(can("STAFF", "files:download")).toBe(true);
    expect(can("STAFF", "status:update")).toBe(false);
    expect(can("MANAGER", "status:update")).toBe(true);
    expect(can("MANAGER", "assign")).toBe(true);
    expect(can("MANAGER", "export")).toBe(true);
    expect(can("MANAGER", "view:audit")).toBe(false);
    expect(can("ADMIN", "view:audit")).toBe(true);
    expect(can("ADMIN", "users:manage")).toBe(true);
    expect(can("ADMIN", "users:manageAdmins")).toBe(false);
    expect(can("OWNER", "users:manageAdmins")).toBe(true);
  });

  it("restricts which roles each actor may assign", () => {
    expect(assignableRoles("OWNER")).toEqual(["OWNER", "ADMIN", "MANAGER", "STAFF", "VIEWER"]);
    expect(assignableRoles("ADMIN")).toEqual(["MANAGER", "STAFF", "VIEWER"]);
    expect(assignableRoles("MANAGER")).toEqual([]);
    expect(assignableRoles("VIEWER")).toEqual([]);
  });
});

describe("passwords", () => {
  it("hashes with scrypt and verifies round-trip", async () => {
    const hash = await hashPassword("Correct-Horse-Battery-9");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(hash).not.toContain("Correct-Horse");
    expect(await verifyPassword("Correct-Horse-Battery-9", hash)).toBe(true);
    expect(await verifyPassword("correct-horse-battery-9", hash)).toBe(false);
    expect(await verifyPassword("Correct-Horse-Battery-9", "garbage")).toBe(false);
  });

  it("uses a fresh salt per hash", async () => {
    const a = await hashPassword("Same-Password-123");
    const b = await hashPassword("Same-Password-123");
    expect(a).not.toEqual(b);
  });

  it("enforces the password policy", () => {
    expect(passwordPolicyError("short1A")).toMatch(/12 characters/);
    expect(passwordPolicyError("alllowercase12345")).toMatch(/upper and lower/);
    expect(passwordPolicyError("ValidPassword123")).toBeNull();
  });

  it("generates policy-compliant temporary passwords", () => {
    for (let i = 0; i < 20; i++) {
      const pw = generatePassword();
      expect(pw.length).toBeGreaterThanOrEqual(20);
      expect(passwordPolicyError(pw)).toBeNull();
    }
  });
});
