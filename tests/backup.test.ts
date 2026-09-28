import { describe, expect, it } from "vitest";
import { randomBytes } from "node:crypto";
import { BACKUP_MAGIC, openBackup, parseBackupKey, sealBackup } from "@/lib/server/backup-crypto";

describe("backup container", () => {
  const key = randomBytes(32);
  const sample = JSON.stringify({ format: "lamha-db-backup", version: 1, tables: { User: [{ id: "1", email: "a@b.c" }] } });

  it("round-trips JSON through gzip + AES-256-GCM", () => {
    const sealed = sealBackup(sample, key);
    expect(sealed.subarray(0, 8).equals(BACKUP_MAGIC)).toBe(true);
    expect(sealed.toString("latin1")).not.toContain("a@b.c");
    expect(openBackup(sealed, key)).toBe(sample);
  });

  it("uses a fresh IV per backup", () => {
    expect(sealBackup(sample, key).equals(sealBackup(sample, key))).toBe(false);
  });

  it("rejects the wrong key and tampered data", () => {
    const sealed = sealBackup(sample, key);
    expect(() => openBackup(sealed, randomBytes(32))).toThrow();
    const tampered = Buffer.from(sealed);
    tampered[tampered.length - 1] ^= 0xff;
    expect(() => openBackup(tampered, key)).toThrow();
    expect(() => openBackup(Buffer.from("not a backup"), key)).toThrow(/Not a LAMHA backup/);
  });

  it("validates key material", () => {
    expect(parseBackupKey(undefined)).toBeNull();
    expect(parseBackupKey("short")).toBeNull();
    expect(parseBackupKey("zz".repeat(32))).toBeNull();
    expect(parseBackupKey(randomBytes(32).toString("hex"))?.length).toBe(32);
  });
});
