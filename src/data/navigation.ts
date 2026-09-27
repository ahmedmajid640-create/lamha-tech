export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Work", href: "/work" },
  { label: "Technology", href: "/technology" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Technology Engineering",
    items: [
      { label: "Software Development", href: "/services/software-development" },
      { label: "Web Development", href: "/services/web-development" },
      { label: "Mobile / iOS Development", href: "/services/mobile-ios" },
      { label: "Polyglot Full-Stack", href: "/services/full-stack" },
      { label: "QA & Testing", href: "/services/qa-testing" },
      { label: "Security", href: "/services/security" },
    ],
  },
  {
    heading: "Experience & Growth",
    items: [
      { label: "Web Design / UI/UX", href: "/services/web-design-ui-ux" },
      { label: "Brand Identity", href: "/services/brand-identity" },
      { label: "Motion & Interaction", href: "/services/motion" },
      { label: "Digital Strategy", href: "/services/digital-strategy" },
      { label: "SEO", href: "/services/seo" },
      { label: "Analytics", href: "/services/analytics" },
      { label: "Scale & Optimization", href: "/services/scale-optimization" },
    ],
  },
  {
    heading: "Solutions",
    items: [
      { label: "Startups", href: "/solutions/startups" },
      { label: "SMEs", href: "/solutions/smes" },
      { label: "Enterprise", href: "/solutions/enterprise" },
      { label: "Custom Solutions", href: "/solutions/custom" },
      { label: "Technology", href: "/technology" },
      { label: "Products & R&D", href: "/products" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "Work", href: "/work" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Start a Project", href: "/start-a-project" },
    ],
  },
];
