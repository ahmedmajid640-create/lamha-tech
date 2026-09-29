/**
 * Solutions by organization type. CMS-ready structured content.
 * No customer stories are included — none have been approved.
 */
export type Solution = {
  slug: string;
  number: string;
  title: string;
  navLabel: string;
  headline: string;
  intro: string;
  problems: { title: string; description: string }[];
  howWeHelp: { title: string; description: string }[];
  relatedServices: string[]; // service slugs
  engagementModels: { title: string; description: string }[];
  ctaHeadline: string;
};

export const solutions: Solution[] = [
  {
    slug: "startups",
    number: "01",
    title: "Solutions for Startups",
    navLabel: "Startups",
    headline: "From idea to a product people can actually use.",
    intro:
      "Startups need to validate quickly without building something that has to be thrown away later. We help founders ship focused first versions on foundations that can grow.",
    problems: [
      {
        title: "Turning a vision into a buildable scope",
        description: "Ideas arrive as decks and conversations. They need to become a clear, prioritized product definition.",
      },
      {
        title: "Speed without accumulating debt",
        description: "Early shortcuts often become the expensive rewrite of year two.",
      },
      {
        title: "Limited in-house engineering",
        description: "Founders need senior technical judgement before they can afford a full team.",
      },
      {
        title: "Investor and customer readiness",
        description: "A credible product, brand and web presence matter from the very first demo.",
      },
    ],
    howWeHelp: [
      {
        title: "Product definition and MVP scoping",
        description: "We separate what must exist on day one from what can wait, and design the system accordingly.",
      },
      {
        title: "MVP design and engineering",
        description: "Interfaces, backend, data and integrations built as one coherent product by a polyglot team.",
      },
      {
        title: "Brand and launch presence",
        description: "Identity, website and product UI that make the company look as serious as its ambition.",
      },
      {
        title: "Evolve after launch",
        description: "Analytics, iteration and scaling work once real users start shaping the roadmap.",
      },
    ],
    relatedServices: ["software-development", "web-design-ui-ux", "mobile-ios", "brand-identity", "digital-strategy"],
    engagementModels: [
      { title: "Fixed-scope MVP", description: "A defined first version delivered against an agreed scope and timeline." },
      { title: "Dedicated product team", description: "An ongoing cross-functional team that acts as your engineering department." },
      { title: "Technical advisory", description: "Senior architecture and product guidance alongside your own builders." },
    ],
    ctaHeadline: "Have an idea that needs to become a product?",
  },
  {
    slug: "smes",
    number: "02",
    title: "Solutions for SMEs",
    navLabel: "SMEs",
    headline: "Practical technology for businesses that run on real operations.",
    intro:
      "Small and medium-sized businesses rarely need more software. They need the right software, connected properly, with a partner who understands operations as well as code.",
    problems: [
      {
        title: "Manual processes and spreadsheets",
        description: "Growth exposes the limits of manual workflows, email approvals and disconnected tools.",
      },
      {
        title: "Ageing or unsupported systems",
        description: "Legacy applications become risky, slow to change and hard to staff.",
      },
      {
        title: "A web presence that does not convert",
        description: "Websites that look dated, load slowly and fail to generate qualified enquiries.",
      },
      {
        title: "No internal technology ownership",
        description: "Decisions get made vendor by vendor without a coherent technical direction.",
      },
    ],
    howWeHelp: [
      {
        title: "Business applications and internal tools",
        description: "Purpose-built systems for the workflows that make your business run.",
      },
      {
        title: "Modernization and integration",
        description: "Replacing or connecting legacy systems step by step, without stopping the business.",
      },
      {
        title: "Websites, SEO and analytics",
        description: "A digital presence engineered to be found, trusted and measured.",
      },
      {
        title: "Ongoing technology partnership",
        description: "A long-term team that maintains, secures and improves what we build together.",
      },
    ],
    relatedServices: ["software-development", "web-development", "scale-optimization", "seo", "analytics", "qa-testing"],
    engagementModels: [
      { title: "Project delivery", description: "Scoped initiatives with clear deliverables and milestones." },
      { title: "Retained support and evolution", description: "Monthly capacity for maintenance, improvements and new features." },
      { title: "Discovery and roadmap", description: "A short engagement to assess systems and define a practical plan." },
    ],
    ctaHeadline: "Ready to replace manual work with reliable systems?",
  },
  {
    slug: "enterprise",
    number: "03",
    title: "Solutions for Enterprise",
    navLabel: "Enterprise",
    headline: "Engineering capacity that fits into how large organizations work.",
    intro:
      "Enterprise teams need partners who respect governance, security and existing architecture while still moving quickly. We deliver as an extension of your organization, not around it.",
    problems: [
      {
        title: "Delivery backlogs",
        description: "Internal teams are committed to core platforms while business units wait for new capabilities.",
      },
      {
        title: "Modernization of critical systems",
        description: "Legacy platforms need to evolve without interrupting operations or breaking integrations.",
      },
      {
        title: "Quality and security expectations",
        description: "Every release must meet testing, security and compliance standards.",
      },
      {
        title: "Specialist skills on demand",
        description: "Short-term needs for mobile, automation, QA or security expertise that are hard to hire for.",
      },
    ],
    howWeHelp: [
      {
        title: "Dedicated engineering squads",
        description: "Cross-functional teams that adopt your tooling, processes and standards.",
      },
      {
        title: "Modernization and integration programmes",
        description: "Incremental migration, API layers and integration work planned around business continuity.",
      },
      {
        title: "Independent QA and security review",
        description: "Structured testing and application security work that strengthens release confidence.",
      },
      {
        title: "Automation and internal platforms",
        description: "Workflow automation and internal tools that remove repetitive operational load.",
      },
    ],
    relatedServices: ["full-stack", "qa-testing", "security", "scale-optimization", "software-development", "analytics"],
    engagementModels: [
      { title: "Dedicated team", description: "A stable, scalable team embedded in your delivery organization." },
      { title: "Statement of work", description: "Defined outcomes, governance and acceptance criteria per initiative." },
      { title: "Specialist engagement", description: "Targeted QA, security or architecture work with clear deliverables." },
    ],
    ctaHeadline: "Need dependable engineering capacity for a critical initiative?",
  },
  {
    slug: "custom",
    number: "04",
    title: "Custom Solutions",
    navLabel: "Custom",
    headline: "When the problem does not fit a category, we design the solution around it.",
    intro:
      "Some requirements cross software, data, automation and physical operations. We combine engineering disciplines to design a solution that fits the actual problem.",
    problems: [
      {
        title: "Requirements that span several domains",
        description: "Software, integrations, devices, data and people all form part of the same problem.",
      },
      {
        title: "No off-the-shelf product fits",
        description: "Available tools solve part of the need and create new workarounds for the rest.",
      },
      {
        title: "Unclear technical feasibility",
        description: "The idea is promising, but no one has yet established what it would take to build.",
      },
      {
        title: "Research-and-development character",
        description: "The work needs prototyping, experimentation and staged commitment rather than a fixed plan.",
      },
    ],
    howWeHelp: [
      {
        title: "Feasibility and technical discovery",
        description: "Structured investigation to establish options, risks, cost drivers and a recommended path.",
      },
      {
        title: "Prototype and proof of concept",
        description: "Small, fast builds that prove the critical assumptions before larger investment.",
      },
      {
        title: "Full solution engineering",
        description: "Design, build, test and deploy the complete solution with the right mix of disciplines.",
      },
      {
        title: "Future engineering frontiers",
        description:
          "LAMHA Technologies's information architecture is prepared for future engineering and R&D services. These will be published only when LAMHA Technologies is operationally ready to deliver them.",
      },
    ],
    relatedServices: ["digital-strategy", "software-development", "full-stack", "security", "analytics"],
    engagementModels: [
      { title: "Discovery sprint", description: "A time-boxed feasibility and definition phase with a written recommendation." },
      { title: "Proof of concept", description: "A focused build that validates the riskiest assumption first." },
      { title: "Staged delivery", description: "Phased engineering with decision points between each stage." },
    ],
    ctaHeadline: "Have a problem nobody has packaged a solution for?",
  },
];

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug);
}
