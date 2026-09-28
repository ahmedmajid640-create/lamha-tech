import "server-only";
import { getPrisma } from "./db";
import { getFileStorage, type StoredObject } from "./files";
import { audit } from "./audit";
import { BACKUP_EXTENSION, parseBackupKey, sealBackup } from "./backup-crypto";

export const BACKUP_PREFIX = "backups/";
export const BACKUP_RETENTION = 30;
export const BACKUP_FORMAT_VERSION = 1;

export function isBackupConfigured(): boolean {
  return parseBackupKey(process.env.BACKUP_ENCRYPTION_KEY) !== null;
}

/** Full logical export of every business table. Sessions are deliberately excluded (they are revocable secrets). */
export async function exportDatabase() {
  const prisma = getPrisma();
  const [jobs, users, inquiries, attachments, contacts, applications, notes, auditLogs] = await Promise.all([
    prisma.job.findMany(),
    prisma.user.findMany(),
    prisma.projectInquiry.findMany(),
    prisma.projectAttachment.findMany(),
    prisma.contactMessage.findMany(),
    prisma.jobApplication.findMany(),
    prisma.note.findMany(),
    prisma.auditLog.findMany(),
  ]);
  const tables = { Job: jobs, User: users, ProjectInquiry: inquiries, ProjectAttachment: attachments, ContactMessage: contacts, JobApplication: applications, Note: notes, AuditLog: auditLogs };
  const counts = Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length])) as Record<keyof typeof tables, number>;
  const payload = {
    format: "lamha-db-backup",
    version: BACKUP_FORMAT_VERSION,
    createdAt: new Date().toISOString(),
    site: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    gitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    counts,
    /** Insert order for restore respects foreign keys. */
    order: Object.keys(tables),
    tables,
  };
  return { json: JSON.stringify(payload), counts };
}

export type BackupResult = { key: string; bytes: number; counts: Record<string, number>; pruned: number; provider: string };

export async function runBackup(trigger: "cron" | "manual", actorEmail: string): Promise<BackupResult> {
  const key = parseBackupKey(process.env.BACKUP_ENCRYPTION_KEY);
  if (!key) throw new Error("BACKUP_ENCRYPTION_KEY is not configured (64 hex characters required)");
  const storage = getFileStorage();
  const { json, counts } = await exportDatabase();
  const sealed = sealBackup(json, key);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const storageKey = `${BACKUP_PREFIX}${stamp.slice(0, 10)}/lamha-db-${stamp}${BACKUP_EXTENSION}`;
  await storage.upload({ key: storageKey, bytes: sealed, contentType: "application/octet-stream", originalName: `lamha-db-${stamp}${BACKUP_EXTENSION}` });
  const pruned = await pruneBackups(BACKUP_RETENTION);
  await audit({ actor: { email: actorEmail }, action: "backup.created", entityType: "backup", entityId: storageKey, details: { trigger, bytes: sealed.length, counts, pruned, provider: storage.provider } });
  return { key: storageKey, bytes: sealed.length, counts, pruned, provider: storage.provider };
}

export async function listBackups(): Promise<StoredObject[]> {
  const items = await getFileStorage().list(BACKUP_PREFIX);
  return items.filter((i) => i.key.endsWith(BACKUP_EXTENSION)).sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
}

/** Deletes everything beyond the newest `keep` backups. Returns how many were removed. */
export async function pruneBackups(keep: number): Promise<number> {
  const storage = getFileStorage();
  const items = await listBackups();
  const stale = items.slice(keep);
  for (const s of stale) await storage.delete(s.key);
  return stale.length;
}

export function isBackupKey(key: string): boolean {
  return key.startsWith(BACKUP_PREFIX) && key.endsWith(BACKUP_EXTENSION) && /^[a-zA-Z0-9/_.-]{1,255}$/.test(key) && !key.includes("..");
}
