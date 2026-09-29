# LAMHA Technologies — SEO & Search Visibility

Production canonical host: **https://lamhatechnologies.com** (set by `NEXT_PUBLIC_SITE_URL`; `www` and
`lamha-tech.vercel.app` 308-redirect to it). No ranking is guaranteed; this document covers the technical
foundations and the manual verification steps.

## What the site provides

| Item | Where |
| --- | --- |
| Unique title, description, canonical, Open Graph, Twitter card per page | `buildMetadata()` in `src/lib/seo.ts`, used by every page |
| robots.txt (allow all, disallow `/api/`, sitemap reference) | `src/app/robots.ts` → `/robots.txt` |
| sitemap.xml (static pages, 4 leadership profiles, 13 services, 4 solutions, open jobs only) | `src/app/sitemap.ts` → `/sitemap.xml` |
| Organization + WebSite JSON-LD on every page | root layout |
| WebPage JSON-LD (home), BreadcrumbList (inner pages), Service + FAQPage (service pages) | page components |
| Person JSON-LD for the four leaders (leadership index) and ProfilePage → mainEntity → Person on each canonical profile `/about/leadership/<slug>` | `personJsonLd()` / `profilePageJsonLd()` in `src/lib/seo.ts`, `src/app/(site)/about/leadership/[slug]/page.tsx` |
| Verification meta tags for Google / Bing | env vars, see below |
| Web manifest, SVG icon, Apple touch icon, generated OG image | `src/app/manifest.ts`, `icon.svg`, `apple-icon.tsx`, `opengraph-image.tsx` |
| IndexNow key file + submission script | `public/<key>.txt`, `npm run seo:indexnow` |
| Demo job pages and legal placeholders are `noindex` and excluded from the sitemap | `careers/[slug]`, `privacy`, `terms` |

Structured data uses only facts already on the site: legal name, tagline, description, Islamabad location,
published contact email/phone, founder and leadership names/roles, and the 13 service names. No addresses
beyond city, no employees counts, awards, clients or certifications.

### Person entities (leadership)

- One `Person` per leader with a stable `@id` of the form `https://lamhatechnologies.com/about/leadership#<slug>`.
  The same `@id` is referenced by `Organization.founder` / `Organization.member` (root layout), the Person list on
  `/about/leadership`, and `ProfilePage.mainEntity` on `/about/leadership/<slug>`. Never mint a second id.
- `Person.worksFor` → `#organization`; `Person.url` → the canonical profile page.
- `Person.sameAs` holds only a LinkedIn URL the owner has verified for that exact person (`profileUrl` in
  `src/data/leadership.ts`). Leaders without a verified profile have no `sameAs`. Person profiles never go into
  `Organization.sameAs`.
- Profile copy (`profile[]`) may only restate approved role descriptions and published company facts. Google decides
  independently whether any of this appears as a person result; nothing here guarantees a knowledge panel.

## Google Search Console (manual, ~5 minutes)

1. Open https://search.google.com/search-console and sign in with the Google account that should own the property.
2. **Add property → Domain** → enter `lamhatechnologies.com`. (Domain property covers http/https/www.)
3. Google shows a DNS TXT record (`google-site-verification=...`). Add it in Vercel:
   `vercel dns add lamhatechnologies.com @ TXT "google-site-verification=..."` (or Dashboard → Domains → DNS records).
   Alternative: choose **URL prefix** → **HTML tag** method, copy only the token, set
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<token>` in Vercel Production env and redeploy.
4. Click **Verify**.
5. In the property: **Sitemaps → Add sitemap** → `https://lamhatechnologies.com/sitemap.xml` → Submit.
6. **URL Inspection** → enter `https://lamhatechnologies.com/` → **Request indexing**. Repeat for `/services` and `/about`.
7. Optional: **Settings → Users** to add teammates.

## Bing Webmaster Tools (manual, ~3 minutes)

1. Open https://www.bing.com/webmasters and sign in.
2. Easiest: **Import from Google Search Console** (after step above). Otherwise **Add a site** → `https://lamhatechnologies.com`.
3. If verifying manually, choose the **meta tag** method, copy only the content token, set
   `NEXT_PUBLIC_BING_SITE_VERIFICATION=<token>` in Vercel Production env and redeploy; or add the CNAME/XML option they offer.
4. **Sitemaps → Submit** `https://lamhatechnologies.com/sitemap.xml`.
5. IndexNow is already configured: run `npm run seo:indexnow` after significant content changes to push URLs to Bing immediately.

## After verification

- Watch Search Console → Pages for "Crawled, not indexed" and Bing → Site Explorer.
- New content: update `src/data/*.ts`, deploy, run `npm run seo:indexnow`.
- When social profiles exist, add them to `site.social` so they appear in Organization `sameAs`.
- Google Business Profile (if LAMHA has a physical office) strengthens brand searches; it is a separate manual signup.

## Brand-search checklist (done)

- Company name in the home `<title>`, description, first visible paragraph, hero label, About page, footer and Organization schema.
- `alternateName` in schema covers "LAMHA", "LAMHA Tech" and "lamhatechnologies".
- Location (Islamabad, Pakistan) in title, description, hero, footer and `PostalAddress`.
