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
    "LAMHA Technologies is a software engineering and digital product company in Islamabad, Pakistan, building software, web and mobile products for businesses worldwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",
  cta: {
    primary: { label: "Start a Project", href: "/start-a-project" },
    secondary: { label: "Explore Services", href: "/services" },
  },
  contact: {
    // Interim contact details supplied by LAMHA (2026-09-28). Replace with the company domain addresses when ready.
    generalEmail: "syedalaibawork@gmail.com",
    projectsEmail: "syedalaibawork@gmail.com",
    careersEmail: "syedalaibawork@gmail.com",
    phone: "+92 334 1606621" as string | null,
    phoneDisplay: "0334 1606621",
    address: null as string | null,
    city: "Islamabad",
    country: "Pakistan",
    countryCode: "PK",
    timeZone: "Asia/Karachi",
    deliveryNote: "Based in Islamabad. Remote-first delivery for clients worldwide.",
  },
  about: {
    short:
      "LAMHA Technologies (Pvt.) Ltd. is a technology company that designs, builds, tests and evolves software, digital products and technology solutions for businesses, startups and organizations worldwide.",
    paragraphs: [
      "We work across three service families: Technology Engineering (software, web, mobile, full-stack, QA and security), Digital Experience (UI/UX, brand identity and motion) and Growth & Optimization (strategy, SEO, analytics and scale).",
      "Alongside client work, LAMHA develops its own internal systems and automation. Selected technologies may later become reusable products, and the company is preparing to expand into new engineering frontiers as it becomes operationally ready.",
    ],
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
