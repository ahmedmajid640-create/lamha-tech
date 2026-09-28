import type { Metadata } from "next";
import { requirePermission } from "@/lib/server/auth";
import { can } from "@/lib/server/rbac";
import { getFileStorage } from "@/lib/server/files";
import { BACKUP_RETENTION, isBackupConfigured, listBackups } from "@/lib/server/backup";
import { runBackupAction } from "@/app/admin/actions";
import { ActionForm } from "@/components/admin/Forms";
import { Card, Empty, PageHeader, Td, Th, fmtDate } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Backups" };

export default async function BackupsPage() {
  const user = await requirePermission("backups:view");
  const configured = isBackupConfigured();
  const storage = getFileStorage();
  const backups = configured ? await listBackups().catch(() => []) : [];
  const canDownload = can(user.role, "backups:download");

  return (
    <>
      <PageHeader
        title="Database backups"
        description={`Encrypted (AES-256-GCM) exports of every table, taken nightly by a scheduled job and on demand. The newest ${BACKUP_RETENTION} are kept in ${storage.provider === "vercel-blob" ? "private Vercel Blob storage" : "local storage"}.`}
        actions={can(user.role, "backups:run") && configured ? <ActionForm action={runBackupAction} hidden={{}} submitLabel="Run backup now" /> : undefined}
      />
      {!configured && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Backups are not configured on this deployment: set <code className="font-mono">BACKUP_ENCRYPTION_KEY</code> (64 hex characters) and <code className="font-mono">CRON_SECRET</code>. See docs/BACKUPS.md.
        </div>
      )}
      <Card title={`Available backups (${backups.length})`}>
        {backups.length === 0 ? (
          <Empty>No backups yet. The nightly job creates the first one, or run one now.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <Th>Created</Th>
                  <Th>File</Th>
                  <Th>Size</Th>
                  <Th>{canDownload ? "Download" : ""}</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {backups.map((b) => (
                  <tr key={b.key}>
                    <Td className="whitespace-nowrap">{fmtDate(b.uploadedAt)}</Td>
                    <Td className="font-mono text-xs">{b.key.replace("backups/", "")}</Td>
                    <Td className="tabular-nums">{(b.size / 1024).toFixed(1)} KB</Td>
                    <Td>
                      {canDownload ? (
                        <a href={`/admin/api/backup?key=${encodeURIComponent(b.key)}`} className="text-blue hover:underline">
                          Download (encrypted)
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Owner only</span>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs text-slate-500">
          Files are useless without the encryption key. Restore with <code className="font-mono">node scripts/backup-restore.mjs &lt;file&gt;</code> (see docs/BACKUPS.md). Uploaded CVs and briefs live in private object storage and are referenced by key inside the backup.
        </p>
      </Card>
    </>
  );
}
