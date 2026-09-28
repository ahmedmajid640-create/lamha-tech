#!/usr/bin/env node
/**
 * Decrypt (and optionally restore) a LAMHA database backup.
 *
 *   node scripts/backup-restore.mjs <backup.json.gz.enc>                 -> writes <name>.json next to it and prints counts
 *   node scripts/backup-restore.mjs <backup.json.gz.enc> --apply         -> also inserts rows into DATABASE_URL (skips rows that already exist)
 *
 * Requires BACKUP_ENCRYPTION_KEY (64 hex chars) in the environment or in .env / .env.local.
 * --apply never deletes or overwrites: existing rows (same id) are skipped, so it is safe to run against a partially populated database.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createDecipheriv } from "node:crypto";
import { gunzipSync } from "node:zlib";
import path from "node:path";

for (const f of [".env", ".env.local"]) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*"?([^"#]*)"?\s*$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const [file, ...flags] = process.argv.slice(2);
if (!file) {
  console.error("usage: node scripts/backup-restore.mjs <backup.json.gz.enc> [--apply]");
  process.exit(2);
}
const keyHex = (process.env.BACKUP_ENCRYPTION_KEY || "").trim();
if (!/^[0-9a-fA-F]{64}$/.test(keyHex)) {
  console.error("BACKUP_ENCRYPTION_KEY missing or not 64 hex characters");
  process.exit(2);
}
const key = Buffer.from(keyHex, "hex");
const data = readFileSync(file);
if (!data.subarray(0, 8).equals(Buffer.from("LAMHABK1"))) {
  console.error("Not a LAMHA backup file");
  process.exit(1);
}
const decipher = createDecipheriv("aes-256-gcm", key, data.subarray(8, 20));
decipher.setAuthTag(data.subarray(20, 36));
const json = gunzipSync(Buffer.concat([decipher.update(data.subarray(36)), decipher.final()])).toString("utf8");
const backup = JSON.parse(json);
const out = path.join(path.dirname(file), path.basename(file).replace(/\.json\.gz\.enc$/, "") + ".json");
writeFileSync(out, JSON.stringify(backup, null, 2));
console.log(`Decrypted ${file}\n  created: ${backup.createdAt}\n  site: ${backup.site}\n  commit: ${backup.gitSha}\n  counts: ${JSON.stringify(backup.counts)}\n  written: ${out}`);

if (!flags.includes("--apply")) {
  console.log("\nDry run only. Add --apply to insert rows into DATABASE_URL (existing ids are skipped).");
  process.exit(0);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required for --apply");
  process.exit(2);
}
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();
const modelFor = { Job: "job", User: "user", ProjectInquiry: "projectInquiry", ProjectAttachment: "projectAttachment", ContactMessage: "contactMessage", JobApplication: "jobApplication", Note: "note", AuditLog: "auditLog" };
let inserted = 0;
for (const table of backup.order) {
  const rows = backup.tables[table] || [];
  if (!rows.length) continue;
  const r = await prisma[modelFor[table]].createMany({ data: rows, skipDuplicates: true });
  inserted += r.count;
  console.log(`  ${table}: ${r.count}/${rows.length} inserted (rest already existed)`);
}
await prisma.$disconnect();
console.log(`Restore complete: ${inserted} rows inserted.`);
