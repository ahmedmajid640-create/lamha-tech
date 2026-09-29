# Owner / Admin Portal

Internal console for LAMHA staff at **`/admin`** on the production domain (https://lamhatechnologies.com/admin). It reads and writes the same PostgreSQL database that the public website forms write to, so nothing is duplicated or synchronised: a submission on the website is visible in the portal immediately.

`/admin` is excluded from `robots.txt`, every portal page carries `noindex`, and it is never linked from the public site.

## Roles

| Role | Can do |
| --- | --- |
| **Viewer** | Read dashboard, inquiries, applications, contact messages, customers. No downloads, no changes. |
| **Staff** | Viewer + add internal notes, reply to requesters by email, download CVs/attachments, view reports. |
| **Manager** | Staff + change statuses, assign owners, export CSV. |
| **Admin** | Manager + audit log, create/deactivate users and reset passwords for Manager/Staff/Viewer. |
| **Owner** | Everything, including managing Admins and other Owners. There must always be one active Owner. |

Permissions are enforced on the server in every server action and route handler (`src/lib/server/rbac.ts`, `requirePermission()` in `src/lib/server/auth.ts`). The UI only hides controls as a convenience.

## Authentication

- Email + password. Passwords are hashed with Node's built-in **scrypt** (N=16384, r=8, p=1, 16-byte random salt). Policy: 12+ characters with upper, lower and a digit.
- Sessions are random 256-bit tokens stored **hashed (SHA-256)** in the `Session` table; the browser only holds the raw token in an `httpOnly`, `Secure`, `SameSite=Lax` cookie scoped to `/admin`, valid 7 days.
- New and reset accounts receive a generated temporary password (shown once) and are forced to change it at first sign-in.
- Changing a password or deactivating a user revokes that user's other sessions.
- Login is rate-limited per IP + email (10 attempts / 15 minutes); failed attempts are audited.
- Cross-site request forgery is mitigated by Next.js Server Actions' origin checks plus the `SameSite=Lax` cookie; the site CSP sets `form-action 'self'`.

## First-time setup (bootstrap the first Owner)

1. Set `ADMIN_SETUP_TOKEN` (≥ 12 random characters) in the deployment environment and deploy.
2. Call the setup endpoint once:

   ```bash
   curl -X POST https://lamhatechnologies.com/admin/api/setup \
     -H "content-type: application/json" \
     -d '{"token":"<ADMIN_SETUP_TOKEN>","email":"owner@example.com","name":"Owner Name"}'
   ```

   The response contains a one-time `temporaryPassword`. Omitting `password` generates one; supplying `password` uses yours (must meet the policy).
3. Sign in at `/admin/login` and set a permanent password when prompted.
4. Remove `ADMIN_SETUP_TOKEN` from the environment. The endpoint also refuses permanently as soon as any user exists (HTTP 409).

Further users are created from **Users** inside the portal; no other setup route exists.

## Features

- **Dashboard** – live counts (new/7-day/30-day inquiries, applications, messages), pipeline breakdown, latest records, items assigned to you.
- **Inquiries** – search (name, email, company, project), filter by status/service/owner/date, paginated. Detail: all fields, private attachments (audited download), email replies, status, assignment, internal notes, activity.
- **Applications** – search/filter by status and role; detail with protected CV download, email replies, status, assignment, notes.
- **Contact messages** – search/filter, email replies, status, notes.
- **Email replies** (Staff+) – every inquiry, application and contact detail page has an "Email replies" card. Staff write a subject and message; the portal sends it through the configured email provider from `EMAIL_FROM`, signed with the staff member's name, and stores the outcome in the `Reply` table (SENT or FAILED with the provider's error). The recipient address always comes from the record, never from the form. The recipient's answer goes to `EMAIL_REPLY_TO` (fallback: first `EMAIL_TO` address, then the published company email). A first successful reply moves a NEW contact message to REPLIED and a NEW inquiry to CONTACTED (audited). Limit: 30 replies per user per hour. Requires `EMAIL_API_KEY`; until the sender domain is verified in Resend, delivery is restricted to the Resend account owner's address.
- **Customers & leads** – derived view: one row per unique email across inquiries and messages with counts, latest status, first/last activity, segments (open, won, contact-only). Nothing is stored or invented.
- **Reports** – period selector; inquiries by month/status/service/budget/industry/country, applications by role/stage, messages by topic, win rate, period-over-period delta; CSV exports (Manager+).
- **Audit log** – append-only: sign-ins (incl. failures), sign-outs, password changes, status changes, assignments, notes, downloads, exports, user administration. Filter by actor, action, record type.
- **Users** – invite, change role, deactivate/reactivate, reset password (scoped by role hierarchy).
- **Account** – change your own password.

## Files & data

- Uploaded CVs/attachments stay private (Vercel Blob `access: "private"` in production, local disk in development). The portal streams them through `GET /admin/api/file?kind=cv|attachment&id=<record>` after an auth + permission check; storage keys are never accepted from the client.
- CSV exports neutralise spreadsheet formula injection (`= + - @` prefixes are quoted).
- No production data is ever seeded, deleted or rewritten by tooling. Status changes are the only mutation on website records; notes and audit entries are append-only.

## Database changes

Migration `20260928104724_owner_portal` (additive only): enums `Role`, `NoteEntity`; tables `User`, `Session`, `Note`, `AuditLog`; nullable `assignedToId` on `ProjectInquiry` and `JobApplication` (FK → `User`, `ON DELETE SET NULL`). Applied by `prisma migrate deploy` during the Vercel build (see `scripts/prebuild.mjs`). Rollback: revert the commit and redeploy; the new tables can be left in place or dropped manually.

Migration `20260929_portal_replies` (additive only): enum `ReplyStatus`; table `Reply` (outbound email replies, FK `authorId` → `User`, `ON DELETE SET NULL`).

## Optional: `admin.lamhatechnologies.com`

Not configured. If wanted later: add the subdomain to the Vercel project, then add a `next.config.ts` rewrite/redirect from the subdomain root to `/admin` (or a middleware host check). Until then the portal lives at `/admin` on the main domain.

## Local development

```bash
# .env.local
DATABASE_URL=postgresql://lamha:lamha_dev_pw@localhost:5434/lamha?schema=public
DIRECT_URL=postgresql://lamha:lamha_dev_pw@localhost:5434/lamha?schema=public
ADMIN_SETUP_TOKEN=local-setup-token
```

`npm run db:migrate:dev` → `npm run dev` → POST `/admin/api/setup` as above → `/admin/login`.
