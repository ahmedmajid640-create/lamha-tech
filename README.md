# LAMHA Technologies — Website MVP

Corporate website and lead-generation MVP for **LAMHA Technologies (Pvt.) Ltd.**, built to the
Final Website PRD v2.0 (`docs/LAMHA_Website_PRD_v2.0.pdf`).

> Technology That Turns Problems Into Progress.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack) · **React 19**
- **Tailwind CSS v4** with LAMHA design tokens (`src/app/globals.css`)
- **React Hook Form + Zod v4** (shared client/server validation)
- **Lucide** icons · **Inter / JetBrains Mono** via `next/font`
- Route handlers for intake APIs · file-based dev persistence (`.data/`)
- Provider-agnostic analytics abstraction (`src/lib/analytics`)

No database, CMS or third-party service is required to run the MVP.

## Run it

```bash
npm install
cp .env.example .env.local      # optional: set NEXT_PUBLIC_SITE_URL, analytics IDs, webhook
npm run dev                     # http://localhost:3000
```

Production:

```bash
npm run build
npm start                       # serves on http://localhost:3000
```

Quality gates:

```bash
npm run lint
npm run typecheck
npm run check                   # lint + typecheck + build
```

## Project structure

```
src/
  app/                  routes (App Router), API route handlers, robots, sitemap, OG image
  components/
    layout/             Header, MobileNav, Footer
    ui/                 Button, SectionLabel, SectionHeading, Breadcrumb, FAQ, Reveal, Tag, Icon, Logo
    sections/           HomeHero, WhatWeDo, ProcessTimeline, TechnologyGrid, WhyLamha, ProductsRD, ...
    services/           ServiceCard, ServiceGrid, ServiceDetail (single template for all 13 services)
    forms/              FormField, SelectField, TextareaField, CheckboxField, FileUpload, ProjectForm, ContactForm
    careers/ work/ solutions/ leadership/ analytics/ visuals/
  data/                 CMS-ready structured content (services, solutions, leadership, jobs, projects, ...)
  lib/
    analytics/          event names + provider abstraction (GA4 / Plausible / console)
    validation/         Zod schemas shared by client and server
    server/             storage (file repository), uploads, rate-limit, sanitize, request helpers, notify
    seo.ts              metadata + JSON-LD builders
docs/                   PRD, brand guidelines, MVP status report
.data/                  local persistence (git-ignored): leads/, applications/, contacts/, uploads/
```

## Intake APIs

| Endpoint            | Body                  | Stores to             | Notes                                              |
| ------------------- | --------------------- | --------------------- | -------------------------------------------------- |
| `POST /api/projects`     | `multipart/form-data` | `.data/leads/`        | Start a Project form. Up to 3 PDF/DOC/DOCX ≤ 10 MB |
| `POST /api/applications` | `multipart/form-data` | `.data/applications/` | Careers application. One CV ≤ 10 MB                |
| `POST /api/contact`      | `application/json`    | `.data/contacts/`     | Contact page message                               |

All endpoints: server-side Zod validation, input sanitization, honeypot, per-IP rate limiting,
magic-byte file sniffing, safe randomized storage names, structured error responses
(`{ ok:false, error:{ code, message, fieldErrors } }`). Records are created with `status: "new"`
and include CRM-ready fields plus an `integrations` placeholder (crmId, linkedOutId, dialerId).

Set `LEAD_WEBHOOK_URL` to forward `lead.created` / `application.created` / `contact.created`
events to a CRM, email service or Slack without changing the routes.

## Content and CMS readiness

All copy lives in `src/data/*.ts` with types mirroring the PRD's CMS models. To publish a case
study, add an entry to `src/data/projects.ts`; to open a role, set a job's `status` to `"open"`
in `src/data/jobs.ts`; to add a portrait/biography, fill the fields in `src/data/leadership.ts`.

See `docs/MVP_IMPLEMENTATION_STATUS.md` for the PRD compliance audit, known limitations and
production TODOs.
