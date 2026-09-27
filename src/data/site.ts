/**
 * Global site settings.
 * CMS model: "Global settings" (navigation, CTA labels, contact details, social links, footer, SEO defaults).
 * Values here are placeholders where approved company details are not yet supplied.
 */
export const site = {
  name: "LAMHA Technologies",
  legalName: "LAMHA Technologies (Pvt.) Ltd.",
  shortName: "LAMHA",
  tagline: "Technology That Turns Problems Into Progress.",
  supportingLine: "From Ideas to Systems. From Systems to Impact.",
  positioning:
    "LAMHA Technologies helps businesses, startups and organizations turn technical requirements and real-world problems into practical software, digital products and technology solutions.",
  description:
    "LAMHA Technologies designs, builds, tests and evolves software, digital products and technology solutions for businesses worldwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",
  cta: {
    primary: { label: "Start a Project", href: "/start-a-project" },
    secondary: { label: "Explore Services", href: "/services" },
  },
  contact: {
    // Placeholder addresses — replace with approved company details before launch.
    generalEmail: "info@lamhatech.com",
    projectsEmail: "hello@lamhatech.com",
    careersEmail: "careers@lamhatech.com",
    phone: null as string | null,
    address: null as string | null,
    deliveryNote: "Remote-first delivery for clients worldwide.",
  },
  social: [
    // Add approved profile URLs when available. Entries with null href are hidden.
    { label: "LinkedIn", href: null as string | null },
    { label: "GitHub", href: null as string | null },
  ],
  mission: "To solve meaningful problems through technology, engineering and continuous innovation.",
  vision:
    "To build a global technology company that creates practical solutions for businesses, develops proprietary technology, and expands into new engineering frontiers.",
} as const;

export type Site = typeof site;
