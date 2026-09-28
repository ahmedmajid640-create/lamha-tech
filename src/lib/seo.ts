import type { Metadata } from "next";
import { site } from "@/data/site";

type BuildMetadataArgs = {
  title: string;
  description: string;
  path: string;
  /** Use the full title verbatim (skip the " | LAMHA Technologies" suffix). */
  absoluteTitle?: boolean;
  noIndex?: boolean;
  type?: "website" | "article";
};

export function absoluteUrl(path: string): string {
  const base = site.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noIndex = false,
  type = "website",
}: BuildMetadataArgs): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      type,
      locale: "en_US",
      images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: site.tagline }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD helpers                                                      */
/* ------------------------------------------------------------------ */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    logo: absoluteUrl("/icon.svg"),
    slogan: site.tagline,
    description: site.description,
    email: site.contact.generalEmail,
    telephone: site.contact.phone ?? undefined,
    address: { "@type": "PostalAddress", addressLocality: site.contact.city, addressCountry: site.contact.countryCode },
    areaServed: "Worldwide",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd(args: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: args.description,
    url: absoluteUrl(args.path),
    provider: { "@type": "Organization", name: site.legalName, url: site.url },
    areaServed: "Worldwide",
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
