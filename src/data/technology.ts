/**
 * Technology is presented at category level. Specific vendor / framework claims are
 * intentionally omitted until LAMHA's approved stack list is finalized.
 * Icons are referenced by name so this data stays serializable (CMS-ready).
 */
export type TechnologyIconName =
  | "layout"
  | "server"
  | "smartphone"
  | "cloud"
  | "database"
  | "workflow"
  | "flask"
  | "bot"
  | "shield"
  | "plug";

export type TechnologyCategory = {
  slug: string;
  number: string;
  title: string;
  description: string;
  icon: TechnologyIconName;
  focus: string[];
};

export const technologyCategories: TechnologyCategory[] = [
  {
    slug: "frontend",
    number: "01",
    title: "Frontend",
    description:
      "Component-driven, accessible interfaces for web applications, dashboards and marketing sites.",
    icon: "layout",
    focus: ["Design systems", "Accessibility", "Performance", "Responsive UI"],
  },
  {
    slug: "backend",
    number: "02",
    title: "Backend",
    description:
      "Services, business logic and data layers designed for reliability, observability and change.",
    icon: "server",
    focus: ["Service architecture", "Business logic", "Background jobs", "Integrations"],
  },
  {
    slug: "mobile",
    number: "03",
    title: "Mobile",
    description:
      "iOS, Android and cross-platform applications backed by robust APIs and sync strategies.",
    icon: "smartphone",
    focus: ["iOS", "Cross-platform", "Offline-first", "App store readiness"],
  },
  {
    slug: "cloud",
    number: "04",
    title: "Cloud",
    description:
      "Cloud-native deployment, environments and infrastructure sized to the workload and budget.",
    icon: "cloud",
    focus: ["Environments", "Scalability", "Cost awareness", "Resilience"],
  },
  {
    slug: "databases",
    number: "05",
    title: "Databases",
    description:
      "Relational and document data models, migrations, indexing and reporting foundations.",
    icon: "database",
    focus: ["Data modelling", "Migrations", "Performance", "Backups"],
  },
  {
    slug: "devops",
    number: "06",
    title: "DevOps",
    description: "CI/CD pipelines, infrastructure as code, monitoring and release discipline.",
    icon: "workflow",
    focus: ["CI/CD", "Infrastructure as code", "Monitoring", "Release management"],
  },
  {
    slug: "testing",
    number: "07",
    title: "Testing",
    description:
      "Automated and manual quality assurance across unit, API, UI, regression and performance layers.",
    icon: "flask",
    focus: ["Test automation", "Regression", "Performance", "Manual QA"],
  },
  {
    slug: "ai-automation",
    number: "08",
    title: "AI / Automation",
    description:
      "Workflow automation, intelligent document handling and assistants applied to real operations.",
    icon: "bot",
    focus: ["Workflow automation", "LLM integration", "Data pipelines", "Internal tooling"],
  },
  {
    slug: "security",
    number: "09",
    title: "Security",
    description:
      "Security-conscious engineering, secure defaults, access control and application security review.",
    icon: "shield",
    focus: ["Secure SDLC", "Access control", "Dependency hygiene", "Review"],
  },
  {
    slug: "apis",
    number: "10",
    title: "APIs",
    description:
      "Well-documented REST and event-driven interfaces that connect products, partners and internal systems.",
    icon: "plug",
    focus: ["REST", "Webhooks & events", "Documentation", "Versioning"],
  },
];

export const technologyPrinciples = [
  {
    number: "01",
    title: "Problem before platform",
    description:
      "We choose languages, frameworks and infrastructure based on the problem, the team that will own it and the budget that has to sustain it.",
  },
  {
    number: "02",
    title: "Boring where it matters",
    description:
      "Proven, well-supported technology for the core of a system. Newer tools only where they bring a clear, measurable advantage.",
  },
  {
    number: "03",
    title: "Built to be handed over",
    description:
      "Readable code, documentation, automated tests and clean environments so any competent team can take the system forward.",
  },
  {
    number: "04",
    title: "Secure and observable by default",
    description:
      "Access control, secrets management, logging and monitoring are part of the initial architecture, not a later phase.",
  },
];
