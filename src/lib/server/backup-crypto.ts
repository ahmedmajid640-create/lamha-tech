import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { gunzipSync, gzipSync } from "node:zlib";

/**
 * Backup container format (all binary, little endian not needed):
 *   8 bytes  magic "LAMHABK1"
 *   12 bytes AES-GCM IV
 *   16 bytes AES-GCM auth tag
 *   N bytes  ciphertext of gzip(JSON)
 * Key: 32 bytes (64 hex chars) from BACKUP_ENCRYPTION_KEY.
 */
export const BACKUP_MAGIC = Buffer.from("LAMHABK1", "ascii");
export const BACKUP_EXTENSION = ".json.gz.enc";

export function parseBackupKey(hex: string | undefined | null): Buffer | null {
  if (!hex || !/^[0-9a-fA-F]{64}$/.test(hex.trim())) return null;
  return Buffer.from(hex.trim(), "hex");
}

export function sealBackup(json: string, key: Buffer): Buffer {
  if (key.length !== 32) throw new Error("Backup key must be 32 bytes");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(gzipSync(Buffer.from(json, "utf8"))), cipher.final()]);
  return Buffer.concat([BACKUP_MAGIC, iv, cipher.getAuthTag(), ct]);
}

export function openBackup(data: Buffer, key: Buffer): string {
  if (key.length !== 32) throw new Error("Backup key must be 32 bytes");
  if (data.length < 8 + 12 + 16 || !data.subarray(0, 8).equals(BACKUP_MAGIC)) throw new Error("Not a LAMHA backup file");
  const iv = data.subarray(8, 20);
  const tag = data.subarray(20, 36);
  const ct = data.subarray(36);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const gz = Buffer.concat([decipher.update(ct), decipher.final()]); // throws on wrong key / tampering
  return gunzipSync(gz).toString("utf8");
}
