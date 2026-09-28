# Database backups

Automatic, encrypted, off-database copies of every business table.

| | |
| --- | --- |
| Schedule | Nightly at 21:00 UTC (02:00 Pakistan) via Vercel Cron → `GET /api/cron/backup` |
| On demand | Portal → **Backups** → "Run backup now" (Admin or Owner) |
| Contents | Job, User, ProjectInquiry, ProjectAttachment, ContactMessage, JobApplication, Note, AuditLog (sessions excluded) |
| Format | JSON → gzip → AES-256-GCM, container header `LAMHABK1` |
| Location | Private Vercel Blob store, `backups/YYYY-MM-DD/lamha-db-<timestamp>.json.gz.enc` |
| Retention | Newest 30 files; older ones are deleted after each successful run |
| Audit | Every run and every download writes an `AuditLog` entry |

Uploaded CVs and project briefs are not copied into the backup: they already live in the private Blob store, and the backup keeps their storage keys, names, sizes and types.

## Environment variables (Production)

| Variable | Purpose |
| --- | --- |
| `BACKUP_ENCRYPTION_KEY` | 64 hex characters (32 bytes). **Store a copy in a password manager.** Without it every backup is unreadable. |
| `CRON_SECRET` | Vercel sends it as `Authorization: Bearer …` to cron routes; the route rejects anything else. |

Generate values with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"        # BACKUP_ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"  # CRON_SECRET
```

## Restore

1. Download the encrypted file from the portal (Owner only) or from the Blob store.
2. Put `BACKUP_ENCRYPTION_KEY` in `.env.local` (never commit it).
3. Inspect first:

   ```bash
   node scripts/backup-restore.mjs lamha-db-2026-09-28T21-00-00-000Z.json.gz.enc
   ```

   This decrypts to a `.json` file beside it and prints creation time, commit and row counts.

4. Restore into a database (the one in `DATABASE_URL`):

   ```bash
   node scripts/backup-restore.mjs <file> --apply
   ```

   Rows are inserted in foreign-key order with `skipDuplicates`, so existing rows are never overwritten or deleted. To rebuild from scratch, point `DATABASE_URL` at an empty database, run `npm run db:migrate`, then `--apply`.

## Verifying a run

- Portal → Backups shows the new file with size and time.
- Portal → Audit log → action `backup.created` shows trigger, byte size and per-table counts.
- Vercel → Project → Cron Jobs shows the last execution status.

## Manual trigger from a terminal

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://lamhatechnologies.com/api/cron/backup
```

The response contains only the storage key, byte size and row counts, never data.
