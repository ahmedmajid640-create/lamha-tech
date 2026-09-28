# LAMHA Website — Production Deployment Runbook

## Current production state (2026-09-28)

| Item | Value |
| --- | --- |
| Production URL | https://lamha-tech.vercel.app |
| Vercel project | `lamha-tech` in team `syedalaibawork-8834` (Hobby) |
| Source | https://github.com/ahmedmajid640-create/lamha-tech (branch `main`) |
| Deploy method | `vercel deploy --prod` from the repo (CLI). Connecting the GitHub repo in the Vercel dashboard enables automatic deploys on push. |
| Blob storage | `lamha-uploads` (store_nnjDkArwWH6hmHMl), private, linked; `BLOB_READ_WRITE_TOKEN` set for all environments |
| Database | **Pending**: Neon (Vercel Marketplace) requires one-time terms acceptance at https://vercel.com/syedalaibawork-8834/~/integrations/accept-terms/neon?source=cli, then `vercel integration add neon`, map `DATABASE_URL`/`DIRECT_URL`, redeploy. Until then submissions fall back to ephemeral `/tmp` storage on the server. |
| Email | **Pending**: needs `EMAIL_API_KEY` (Resend), `EMAIL_FROM`, `EMAIL_TO` in Production |
| `NEXT_PUBLIC_SITE_URL` | set to the production URL (Production + Preview) |
| `.vercelignore` | excludes `.env*`, `.data`, `node_modules`, `.next`, doc binaries |

Target platform: **Vercel** (Next.js 16). Database: **PostgreSQL** (any provider; Neon via the Vercel
Marketplace is the fastest). Uploads: **Vercel Blob (private)**. Email: **Resend**.

The application degrades safely: without `DATABASE_URL` it stores submissions in local JSON files,
without `BLOB_READ_WRITE_TOKEN` it stores uploads on local disk, without `EMAIL_API_KEY` it logs
instead of emailing. On Vercel those fallbacks are **ephemeral** (`/tmp`), so all three must be
configured for a real production site. `GET /api/health` reports which backends are active.

---

## 0. One-time accounts (≈10 minutes)

| Need | Where | Output |
| --- | --- | --- |
| Vercel account + CLI login | `vercel login` → open the printed URL, enter the code | CLI authenticated |
| PostgreSQL | Vercel Dashboard → Storage → **Create Database → Neon** (or Supabase / any Postgres) | `DATABASE_URL` (pooled) + `DIRECT_URL` (direct) |
| Blob store | Vercel Dashboard → Storage → **Create → Blob**, connect to the project | `BLOB_READ_WRITE_TOKEN` (auto-added) |
| Resend | resend.com → API Keys → Create | `EMAIL_API_KEY` |
| Resend sender domain | resend.com → Domains → add `lamhatech.com` (or the real domain) → add the DNS records shown | verified `EMAIL_FROM` |

Until the sender domain is verified, Resend only delivers from `onboarding@resend.dev` **to the
email address that owns the Resend account**. Set `EMAIL_TO` to that address for the first test.

## 1. Link the project

```bash
cd WEBSITE
vercel login
vercel link          # "Set up and deploy?" → yes, scope → your team, create new project "lamha-website"
```

## 2. Environment variables (Production)

Set in Vercel Dashboard → Project → Settings → Environment Variables, or via CLI:

```bash
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add EMAIL_API_KEY production
vercel env add EMAIL_FROM production          # e.g. "LAMHA Website <notifications@lamhatech.com>"
vercel env add EMAIL_TO production            # comma-separated internal recipients
vercel env add NEXT_PUBLIC_SITE_URL production   # e.g. https://lamha-website.vercel.app (or the custom domain)
```

`BLOB_READ_WRITE_TOKEN` is added automatically when the Blob store is connected to the project.
If the database was created through the Vercel Marketplace, `DATABASE_URL` / `DIRECT_URL` (or
`POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING`) are added automatically; map them to the two
names above if the provider used different names.

## 3. Deploy

```bash
vercel --prod
```

The build runs `scripts/prebuild.mjs` → `prisma generate` → `prisma migrate deploy` (applies
`prisma/migrations/*` to the production database) → `next build`.

## 4. Verify

```bash
curl https://<domain>/api/health
# expect: {"ok":true,"persistence":"postgres","database":"ok","storage":"vercel-blob","email":"configured"}
```

Then submit one inquiry at `/start-a-project` with a small PDF, one message at `/contact`, and
one application at `/careers/qa-engineer`. Each returns a reference id; the same id is the
primary key in `ProjectInquiry` / `ContactMessage` / `JobApplication`, and the notification email
subject starts with "New project inquiry" / "New contact message" / "New job application".

Optional: `npm run db:seed` locally with the production `DATABASE_URL` to populate the `Job` table
(the applications route also upserts the job on first application, so this is not required).

## 5. Custom domain

Vercel Dashboard → Project → Settings → Domains → add `lamhatech.com` + `www`, follow the DNS
instructions, then update `NEXT_PUBLIC_SITE_URL` and redeploy so canonical/OG URLs match.

## Rollback

Vercel Dashboard → Deployments → previous deployment → **Promote to Production**. Database
migrations are additive (no destructive migration exists yet), so rolling back the app is safe.

## Local development against Postgres

```bash
docker run -d --name lamha-postgres -e POSTGRES_USER=lamha -e POSTGRES_PASSWORD=lamha_dev_pw -e POSTGRES_DB=lamha -p 5434:5432 postgres:16-alpine
# .env: DATABASE_URL / DIRECT_URL = postgresql://lamha:lamha_dev_pw@localhost:5434/lamha?schema=public
npm run db:migrate:dev && npm run db:seed && npm run dev
```
