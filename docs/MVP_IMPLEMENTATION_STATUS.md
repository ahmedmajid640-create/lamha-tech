# LAMHA Website MVP — Implementation Status & PRD Compliance Audit

**Source of truth:** `docs/LAMHA_Website_PRD_v2.0.pdf` (Final Website PRD v2.0), `docs/website_mvp_brief.pdf`, `docs/LAMHA_Logo_Guidelines.pdf`, `docs/LAMHA_MOCK.png`.
**Status date:** 2026-09-28
**Build:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ (37 static/SSG routes + 3 API routes)

---

## 1. Completed requirements

### Pages / sitemap (PRD §05)
| Route | Status |
| --- | --- |
| `/` | ✓ 12 numbered sections per brief (Hero → Final CTA) |
| `/services` | ✓ three families, family index, process |
| `/services/[slug]` × 13 | ✓ one `ServiceDetail` template, data-driven (`src/data/services.ts`) |
| `/solutions`, `/solutions/{startups,smes,enterprise,custom}` | ✓ problems · how we help · services · engagement models · CTA |
| `/technology` | ✓ philosophy + 10 category grid |
| `/products` | ✓ future-ready, conceptual only, no confidential product details |
| `/work` | ✓ CMS-ready grid with category filters and intentional placeholder state |
| `/about`, `/about/leadership` | ✓ About sequence per PRD §09 (About → Why → Believe → How → Founder → Leadership → Where we're going) |
| `/careers`, `/careers/[slug]` | ✓ employer brand, values, listings, job detail with application form |
| `/start-a-project` | ✓ full conversion page |
| `/contact` | ✓ channels + message form |
| 404 | ✓ branded `not-found.tsx` |
| `robots.txt`, `sitemap.xml`, `opengraph-image`, `icon.svg` | ✓ generated |

### Homepage (brief §7, PRD §06)
01 Hero (exact headline, blue "Progress.", both CTAs, original network visual, numbered capability strip) · 02 BUILD/ENGINEER/EVOLVE · 03 Services in 3 families with icon/arrow/hover/link · 04 six-step horizontal process (vertical on mobile) · 05 Why LAMHA (6 pillars, no statistics) · 06 Technology categories · 07 "We Build for Ourselves, Too." (conceptual visual, no product names) · 08 Work placeholder with categories · 09 About/Founder with mission & vision · 10 Leadership (initials placeholders) · 11 Careers · 12 "Have a problem worth solving?" CTA.

### Navigation (brief §6)
Sticky header, transparent over dark heroes → solid light on scroll · desktop nav with active indicator · persistent **Start a Project** CTA · full-screen mobile menu with open/close animation, focus trap, Escape, scroll lock, `aria-expanded/controls` · skip link.

### Start a Project form + backend (brief §8–9, PRD §11)
All specified fields, service/budget/timeline/stage options, PDF/DOC/DOCX attachments (≤3, ≤10 MB), consent, exact success copy, no SLA promise · React Hook Form + Zod on client, same Zod schema on server · `POST /api/projects` → lead record with `status:"new"`, `source`, `createdAt`, attachments metadata, `integrations` placeholders · honeypot, rate limiting, magic-byte file validation, sanitization · states: idle / submitting / success / validation error / API error / offline / upload error.

### Additional backends
`POST /api/applications` (careers; CV upload) · `POST /api/contact` (JSON) · optional outbound webhook (`LEAD_WEBHOOK_URL`) as the integration seam for CRM / LinkedOut / Dialer / email.

### Component architecture (brief §19)
Header, MobileNav, Footer, Button, SectionLabel, SectionHeading, ServiceCard, ServiceGrid, ServiceDetail (incl. hero), ProcessTimeline, TechnologyGrid, SolutionCard, CaseStudyCard, LeadershipCard, CareerCard, CTASection, ProjectForm, ContactForm, ApplicationForm, FormField, SelectField, TextareaField, CheckboxField, FileUpload, FAQ, Breadcrumb, Reveal, Tag, Icon, Logo, JsonLd, visuals (NetworkVisual, ArchitectureVisual, ServiceVisual ×13, backdrops).

### Content architecture (brief §20–21)
`src/data/{site,navigation,services,solutions,leadership,jobs,projects,technology,process,whyLamha}.ts` — typed to the PRD CMS models (Services, Jobs, Projects, Leadership, Global settings; Products/Insights modelled by route/placeholder).

### SEO (brief §14)
Unique title + description per page · canonical URLs · Open Graph + Twitter cards · generated OG image · robots.txt · sitemap.xml (all services, solutions, visible jobs) · semantic HTML, single H1 per page · JSON-LD: Organization, WebSite, BreadcrumbList, Service, FAQPage · demo job pages are `noindex`.

### Accessibility (brief §15)
Keyboard navigation, visible focus rings (dark and light variants), skip link, labelled form controls with `aria-invalid`/`aria-describedby`, `role="alert"`/`status` messaging, native `<details>` FAQ, `prefers-reduced-motion` honoured globally (animations and reveals disabled), alt text / `role="img"` on SVG visuals, contrast-checked palette.

### Performance (brief §16)
Static/SSG for all marketing routes · `next/font` with `display: swap` · no animation library (CSS + IntersectionObserver) · inline SVG visuals (no raster hero) · lazy analytics scripts · gzip HTML for home ≈ 36 KB · security headers + compression in `next.config.ts`.

### Security (brief §23)
Server-side validation · sanitization · rate limiting (per IP, in-memory) · extension + MIME + magic-byte upload checks · randomized storage paths · secrets only via env · CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy · no user content logged.

### Analytics (brief §22)
`src/lib/analytics` abstraction with GA4 / Plausible / console providers selected by env vars. Events wired: `page_view`, `service_view`, `cta_click` (via `start_project_click`), `start_project_click`, `project_form_start`, `project_form_submit`, `project_form_error`, `career_view`, `job_view`, `application_start` (+ `application_submit/error`, `contact_form_submit/error`).

### Content rules (brief §29, PRD §20)
No invented clients, testimonials, statistics, awards, certifications, partnerships or biographies. Placeholders used: "Approved LAMHA projects and case studies will appear here.", "Leadership biography coming soon.", "Portrait pending", "Technology stack details will be updated as capabilities are finalized.", "Approved product information will be published here."

---

## 2. Partially completed requirements

| Item | State | Notes |
| --- | --- | --- |
| Careers open positions | Partial | Three listings exist **clearly badged "Demo listing"**, `status:"demo"`, `noindex`. No approved vacancies were supplied. Set `status:"open"` or remove before launch. |
| Founder / leadership content | Partial | Names and roles are accurate; biographies and portraits are `null` and render placeholders until approved content is supplied. |
| Company contact details | Partial | Email addresses in `src/data/site.ts` are placeholders (`@lamhatech.com`); phone/address are `null` and hidden. |
| CSP | Partial | Uses `'unsafe-inline'` for scripts (Next.js default without nonces). Tighten with nonce-based CSP in production. |
| Rate limiting | Partial | In-memory per instance. Replace with Redis/edge limiter for multi-instance hosting. |
| Email notification | Partial | Webhook seam exists; no SMTP/transactional email provider configured yet. |

---

## 3. Deferred requirements

- **CMS** — content is in typed TS data files (CMS-ready); no headless CMS integration in the MVP (per brief).
- **Search icon in header** — omitted ("if useful"); no searchable content volume yet.
- **Insights/blog** — modelled in PRD; no route in MVP scope.
- **Case study detail pages** — `Project` model + grid ready; detail template to be added when the first approved case study exists.
- **Future engineering services** (PCB, solar, roofing…) — referenced only conceptually on `/solutions/custom` and `/about`; kept separate from active services per PRD §04.
- **CRM / LinkedOut / Dialer / Company OS** — not integrated (and not claimed). Payload and webhook are designed for it.
- **Automated test suite (unit/e2e)** — QA performed with scripted API tests and Playwright runs (see §5); no test files committed in the repo yet.

---

## 4. Known limitations

- File-based persistence (`.data/`) is for development/review only; use a database or CRM adapter in production (swap `FileRepository` behind the `Repository` interface).
- Uploaded files are stored on local disk; production should use object storage with virus scanning.
- `NEXT_PUBLIC_SITE_URL` must be set in production for correct canonical/OG URLs (defaults to `http://localhost:3000`).
- The project form's `?service=` query preselect only accepts exact service labels.
- OG image is rendered at request/build time with system fonts (no custom font embedded).

---

## 5. QA performed (2026-09-28)

- `npm run lint`, `npm run typecheck`, `npm run build`: all pass.
- Production server route sweep: 36 routes → all `200`; unknown routes → `404`; `GET /api/projects` → `405`.
- API tests (`fetch` + `FormData`): valid lead with attachment persisted with `status:"new"`; en-dash options stored correctly; 4 attachments rejected; `.exe` rejected; fake `.pdf` (bad magic bytes) rejected; 11 MB file rejected; honeypot discarded without persistence; JSON to multipart endpoint → `415`; invalid enum → field error; minimal valid lead accepted; rate limit → `429`; contact and application endpoints valid/invalid paths verified.
- Security headers verified on responses.
- Browser QA (Playwright driving Microsoft Edge/Chromium) at 1440 / 1024 / 768 / 390 / 360 — results below.

### Browser QA results
- 16 routes × 5 viewports: **no horizontal overflow** at any width, exactly one `<h1>` per page, unique titles, **no page errors or console errors** (the only console entry is the expected `404` resource note on the not-found page).
- All 53 scroll-reveal elements on the home page become visible on scroll; React hydration confirmed.
- Mobile navigation opens, traps focus and closes on `Escape` at 768 / 390 / 360.
- First `Tab` on any page focuses the "Skip to content" link.
- Start a Project: `?service=SEO` preselects the service; submitting empty shows 5 inline `role="alert"` errors; a real browser submission with a PDF attachment returns the success panel with the exact PRD confirmation copy; contact form submission succeeds.
- Visual pass: desktop hero renders the three-line headline ("Technology That Turns / Problems Into / Progress.") at 1024–1440; service detail hero, mobile form and mobile menu reviewed from screenshots.
- Fixes made during QA: hero type scale/column width (headline orphaning), technology grid two-up on phones, no-JS fallback for reveals (`js` class now set by inline script), friendlier enum validation messages, rate limit raised to 8 / 10 min.

---

## 5b. Production hardening (2026-09-28, second pass)

| Area | Implementation | Verified |
| --- | --- | --- |
| Database | PostgreSQL via Prisma 6 (`prisma/schema.prisma`): `ProjectInquiry`, `ProjectAttachment`, `ContactMessage`, `Job`, `JobApplication`; migration `20260927202909_init` | Applied to local Postgres 16 (Docker); rows verified with `psql` for all three flows |
| Repository layer | `src/lib/server/repositories.ts` selects Prisma when `DATABASE_URL` is set, JSON files otherwise; routes unchanged in contract | API suite: 13/13 pass on the Postgres backend |
| File storage | `src/lib/server/files.ts`: Vercel Blob with `access: "private"` when `BLOB_READ_WRITE_TOKEN` is set; local disk (or `/tmp` on serverless) otherwise; randomized keys; magic-byte + MIME + extension + size validation | Local provider verified; Blob provider requires the store token |
| Email | `src/lib/server/email.ts`: Resend provider with HTML/text templates (escaped), console fallback; `notifiedAt` stamped on success; sent via `after()` so responses stay fast | Console fallback verified; live sending requires `EMAIL_API_KEY` + `EMAIL_TO` |
| Build pipeline | `scripts/prebuild.mjs`: `prisma generate` + `prisma migrate deploy` when a database is configured | Verified locally ("No pending migrations to apply") |
| Health | `GET /api/health` reports persistence / database / storage / email status without secrets | Verified |
| Legal | `/privacy` and `/terms` placeholder pages (clearly marked, noindex), linked in footer | Verified |
| Git | Repository initialized; `.env*`, `.data`, `node_modules`, `.next` ignored; `.gitattributes` LF | Commits `a602ea9`, `7c7b383` |

CSP remains `script-src 'self' 'unsafe-inline'`: a nonce-based policy would force every page to
render dynamically (losing static generation); deferred as P1 per the production brief.

## 6. Production TODOs

1. Supply approved founder/leadership biographies and portraits (`src/data/leadership.ts`).
2. Replace placeholder emails; add phone/address if approved (`src/data/site.ts`).
3. Remove or approve demo job listings (`src/data/jobs.ts`).
4. Set `NEXT_PUBLIC_SITE_URL`, analytics IDs and `LEAD_WEBHOOK_URL` in the hosting environment.
5. Swap `FileRepository` for a database/CRM adapter; move uploads to object storage with scanning.
6. Configure transactional email for lead notifications (extend `src/lib/server/notify.ts`).
7. Nonce-based CSP; distributed rate limiting; bot protection (e.g. Turnstile) if spam appears.
8. Add automated tests (unit for validation/uploads, e2e for the project form) to CI.
9. Publish first approved case study and add the case-study detail template.
10. Final brand pass once the official vector logo master is available (current mark is drawn from the written guideline spec).
