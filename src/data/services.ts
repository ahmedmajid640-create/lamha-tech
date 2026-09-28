/**
 * CMS model: Services (title, group, description, capabilities, benefits, deliverables,
 * process, FAQs, related services, status, hero media).
 *
 * All copy is original LAMHA content. Technology is described at category level only;
 * no vendor partnerships, certifications or client outcomes are claimed.
 */

export type ServiceFamilyId = "technology-engineering" | "digital-experience" | "growth-optimization";

export type ServiceIconName =
  | "code"
  | "globe"
  | "smartphone"
  | "layers"
  | "flask"
  | "shield"
  | "pen-tool"
  | "fingerprint"
  | "sparkles"
  | "compass"
  | "search"
  | "bar-chart"
  | "gauge";

export type ServiceVisualKind =
  | "code"
  | "web"
  | "mobile"
  | "stack"
  | "testing"
  | "security"
  | "interface"
  | "identity"
  | "motion"
  | "strategy"
  | "seo"
  | "analytics"
  | "scale";

export type ServiceFamily = {
  id: ServiceFamilyId;
  number: string;
  title: string;
  tagline: string;
  description: string;
};

export type FAQ = { question: string; answer: string };

export type Service = {
  slug: string;
  family: ServiceFamilyId;
  /** Number within its family (01, 02 ...). */
  number: string;
  /** Global service number across the whole catalogue. */
  globalNumber: string;
  title: string;
  navLabel: string;
  icon: ServiceIconName;
  visual: ServiceVisualKind;
  /** One-line description used on cards. */
  tagline: string;
  /** Business outcome shown in the detail hero. */
  outcome: string;
  overview: string[];
  whatWeDo: string[];
  capabilities: { title: string; description: string }[];
  /** Service-specific notes for the six standard process steps. */
  process: string[];
  technology: string[];
  deliverables: string[];
  quality: string[];
  useCases: string[];
  faqs: FAQ[];
  related: string[];
  metaDescription: string;
  status: "published" | "draft";
};

export const serviceFamilies: ServiceFamily[] = [
  {
    id: "technology-engineering",
    number: "01",
    title: "Technology Engineering",
    tagline: "Software, systems and quality.",
    description:
      "Custom software, web and mobile products, full-stack systems, testing and security engineered for real business operations.",
  },
  {
    id: "digital-experience",
    number: "02",
    title: "Digital Experience",
    tagline: "Design, identity and motion.",
    description:
      "Clarity-first interfaces, visual identity systems and purposeful motion that make technology feel considered and trustworthy.",
  },
  {
    id: "growth-optimization",
    number: "03",
    title: "Growth & Optimization",
    tagline: "Strategy, discoverability and scale.",
    description:
      "Strategy before build decisions, technical SEO, measurement and continuous optimization so products keep improving after launch.",
  },
];

const STANDARD_PROCESS_LABELS = ["Discover", "Define", "Design", "Build", "Test", "Deploy & Evolve"];
export { STANDARD_PROCESS_LABELS };

export const services: Service[] = [
  /* ------------------------------------------------------------------ */
  /* FAMILY 01 — TECHNOLOGY ENGINEERING                                   */
  /* ------------------------------------------------------------------ */
  {
    slug: "software-development",
    family: "technology-engineering",
    number: "01",
    globalNumber: "01",
    title: "Software Development",
    navLabel: "Software Development",
    icon: "code",
    visual: "code",
    tagline: "Custom software, SaaS, business applications, internal tools, APIs and automation.",
    outcome:
      "Custom software designed around your business goals and built for performance, scale and long-term use.",
    overview: [
      "Off-the-shelf tools solve generic problems. Your most valuable processes are rarely generic. We design and build software that fits the way your organization actually works, from customer-facing SaaS platforms to the internal systems that keep operations moving.",
      "Every engagement starts with the business problem, not a feature list. We define the system around outcomes, choose technology that your team can sustain, and deliver working software in iterations you can see and use.",
    ],
    whatWeDo: [
      "Custom business applications and internal tools",
      "SaaS platforms and multi-tenant products",
      "APIs, integrations and back-office automation",
      "Modernization of legacy applications",
      "MVPs that are designed to grow into full products",
      "Ongoing evolution and support after launch",
    ],
    capabilities: [
      { title: "Custom-built solutions", description: "Software shaped around your workflows, data and users instead of forcing your business into a generic tool." },
      { title: "Scalable architecture", description: "Service boundaries, data models and infrastructure planned so the product can grow without a rewrite." },
      { title: "Modern engineering practice", description: "Version control, code review, automated testing and CI/CD as standard on every project." },
      { title: "Secure and reliable", description: "Access control, input validation, secrets management and monitoring designed in from the start." },
      { title: "Integration-ready", description: "Clean APIs and event flows that connect to your existing platforms, partners and future systems." },
      { title: "End-to-end support", description: "One team across discovery, design, build, testing, deployment and continuous improvement." },
    ],
    process: [
      "Workshops with stakeholders and users to map the real problem, constraints and success criteria.",
      "Scope, priorities, architecture direction, delivery plan and a clear definition of the first release.",
      "System design, data models, integration contracts and interface design worked out together.",
      "Iterative engineering with regular demonstrations of working software.",
      "Automated and manual testing across functionality, APIs, performance and security.",
      "Controlled release, monitoring and a roadmap for continuous improvement.",
    ],
    technology: ["Backend", "Frontend", "Databases", "APIs", "Cloud", "DevOps", "Testing", "Security"],
    deliverables: [
      "Product and technical specification",
      "Architecture and data model documentation",
      "Production-ready application and source code",
      "Automated test suite and CI/CD pipeline",
      "Deployment, environment and operations documentation",
      "Handover and knowledge transfer",
    ],
    quality: [
      "Code review on every change",
      "Automated unit, integration and API tests",
      "Secure-by-default configuration and dependency hygiene",
      "Environment separation and secrets kept out of source",
      "Logging and monitoring ready for production",
    ],
    useCases: [
      "Operations platform replacing spreadsheets and email approvals",
      "Customer portal connected to existing back-office systems",
      "SaaS product built from a validated service business",
      "Internal automation for repetitive finance, HR or support tasks",
    ],
    faqs: [
      { question: "How do you scope a custom software project?", answer: "We begin with a discovery phase that produces a written scope, priorities and architecture direction. This lets us agree on a realistic first release before significant engineering begins." },
      { question: "Can you work with our existing systems?", answer: "Yes. Integration with existing platforms, databases and third-party services is a normal part of our work and is planned during the definition phase." },
      { question: "Who owns the source code?", answer: "Source code and documentation for work we deliver are handed over to the client according to the agreement for the engagement." },
      { question: "Do you support the software after launch?", answer: "Yes. We offer retained support and evolution so the product keeps improving as your business changes." },
    ],
    related: ["web-development", "full-stack", "qa-testing", "security"],
    metaDescription:
      "Custom software development by LAMHA Technologies: SaaS, business applications, internal tools, APIs and automation built for performance, scale and long-term use.",
    status: "published",
  },
  {
    slug: "web-development",
    family: "technology-engineering",
    number: "02",
    globalNumber: "02",
    title: "Web Development",
    navLabel: "Web Development",
    icon: "globe",
    visual: "web",
    tagline: "Corporate sites, web apps, SaaS, dashboards, portals, e-commerce and integrations.",
    outcome:
      "Fast, secure and maintainable web platforms, from corporate websites to complex web applications and portals.",
    overview: [
      "The web is where most businesses are first evaluated and where many now operate. We build websites and web applications that load fast, rank well, convert visitors and stay easy to maintain.",
      "Whether the goal is a corporate site that represents the business properly or a data-heavy application used every day, we apply the same engineering discipline: clean architecture, accessibility, performance and measurable outcomes.",
    ],
    whatWeDo: [
      "Corporate and marketing websites",
      "Web applications, dashboards and portals",
      "SaaS front-ends and customer-facing platforms",
      "E-commerce and transactional experiences",
      "Content-managed sites prepared for editorial teams",
      "Third-party integrations and headless architectures",
    ],
    capabilities: [
      { title: "Performance engineering", description: "Optimized loading, rendering and asset strategies that target excellent Core Web Vitals." },
      { title: "Accessible by default", description: "Semantic structure, keyboard navigation, contrast and screen-reader support built in." },
      { title: "CMS-ready architecture", description: "Content modelled separately from presentation so teams can publish without developers." },
      { title: "Secure web applications", description: "Authentication, authorization, validation and hardened configuration for applications that handle real data." },
      { title: "Responsive and international", description: "Layouts that work from large desktops to small phones, ready for multiple languages and regions." },
      { title: "Search-friendly structure", description: "Clean URLs, metadata, structured data and sitemaps as part of the build, not an afterthought." },
    ],
    process: [
      "Audience, content, conversion goals and technical constraints are captured.",
      "Sitemap, content model, integrations and technical approach are agreed.",
      "Wireframes, responsive layouts and design system aligned with the brand.",
      "Component-driven implementation with content integration and CMS setup where relevant.",
      "Cross-browser, cross-device, accessibility and performance testing.",
      "Launch with analytics, SEO checks and a plan for ongoing improvement.",
    ],
    technology: ["Frontend", "Backend", "APIs", "Cloud", "DevOps", "Testing", "Security"],
    deliverables: [
      "Sitemap and content model",
      "Responsive design system and page templates",
      "Production website or web application",
      "CMS configuration and editor documentation where applicable",
      "SEO foundations: metadata, sitemap, robots and structured data",
      "Performance and accessibility report",
    ],
    quality: [
      "Accessibility checks against WCAG 2.2 AA foundations",
      "Performance budgets and Core Web Vitals monitoring",
      "Security headers, validated forms and protected endpoints",
      "Automated tests for critical journeys",
    ],
    useCases: [
      "Corporate website relaunch with CMS and lead capture",
      "Customer portal with authenticated dashboards",
      "SaaS application front-end connected to existing APIs",
      "E-commerce platform with payment and inventory integrations",
    ],
    faqs: [
      { question: "Do you build websites with a CMS?", answer: "Yes. We structure content so it can be managed through a CMS, and we can recommend an approach based on your team, budget and publishing needs." },
      { question: "Will the site be fast and SEO-friendly?", answer: "Performance and technical SEO are engineered into every build: optimized assets, semantic HTML, metadata, sitemaps and structured data." },
      { question: "Can you redesign an existing site without losing rankings?", answer: "Yes. We plan URL mapping, redirects and metadata carefully so a relaunch protects existing search visibility." },
    ],
    related: ["web-design-ui-ux", "seo", "software-development", "scale-optimization"],
    metaDescription:
      "Web development by LAMHA Technologies: corporate websites, web apps, SaaS front-ends, dashboards, portals and e-commerce built for speed and security.",
    status: "published",
  },
  {
    slug: "mobile-ios",
    family: "technology-engineering",
    number: "03",
    globalNumber: "03",
    title: "Mobile / iOS Development",
    navLabel: "Mobile / iOS",
    icon: "smartphone",
    visual: "mobile",
    tagline: "iOS, mobile and cross-platform applications with supporting backend systems.",
    outcome:
      "Mobile applications that feel native, work reliably offline and online, and connect cleanly to your systems.",
    overview: [
      "A mobile product is more than a screen. It is the app, the APIs behind it, the sync strategy, the release process and the analytics that tell you how it is used. We deliver all of it as one system.",
      "We build for iOS and cross-platform targets depending on the audience, budget and roadmap, and we design the backend so web and mobile share the same source of truth.",
    ],
    whatWeDo: [
      "iOS application development",
      "Cross-platform mobile applications",
      "Backend APIs and synchronization for mobile products",
      "App Store and release readiness",
      "Mobile UX design and prototyping",
      "Maintenance, updates and platform upgrades",
    ],
    capabilities: [
      { title: "Native-quality experience", description: "Interfaces that follow platform conventions, perform smoothly and respect accessibility settings." },
      { title: "Cross-platform where it fits", description: "Shared codebases when the product and team benefit from it, without compromising the user experience." },
      { title: "Backend and sync", description: "APIs, authentication, push notifications and offline-first data strategies designed for mobile realities." },
      { title: "Release engineering", description: "Build pipelines, testing on real devices and app store submission handled end to end." },
      { title: "Security on the device", description: "Secure storage, transport security and session handling appropriate to the sensitivity of the data." },
      { title: "Analytics and iteration", description: "Event tracking and crash reporting that inform every subsequent release." },
    ],
    process: [
      "User contexts, platform priorities and backend dependencies are mapped.",
      "Feature scope, platform strategy, API contracts and release plan are defined.",
      "Mobile UX, interaction design and system architecture designed together.",
      "Iterative development with test builds distributed to stakeholders.",
      "Device, network, regression and performance testing.",
      "Store submission, monitoring and a release cadence for ongoing improvement.",
    ],
    technology: ["Mobile", "Backend", "APIs", "Cloud", "Testing", "Security"],
    deliverables: [
      "Mobile UX designs and prototype",
      "iOS and/or cross-platform application",
      "Backend APIs and documentation",
      "Test builds and device test reports",
      "App store listing assets and submission",
      "Release and maintenance plan",
    ],
    quality: [
      "Testing on real devices across supported OS versions",
      "Secure storage and transport for sensitive data",
      "Crash reporting and performance monitoring",
      "Accessibility support for platform assistive technologies",
    ],
    useCases: [
      "Customer-facing companion app for an existing web platform",
      "Field operations app with offline data capture",
      "Consumer product launching on iOS first",
      "Internal workforce app connected to company systems",
    ],
    faqs: [
      { question: "Should we build native iOS or cross-platform?", answer: "It depends on the audience, performance requirements, roadmap and team. We evaluate the trade-offs during discovery and recommend the approach that fits." },
      { question: "Do you also build the backend for the app?", answer: "Yes. Most mobile products need APIs, authentication and data synchronization, and we deliver those alongside the app." },
      { question: "Can you take over an existing mobile app?", answer: "Yes. We begin with a technical review to understand the codebase, dependencies and release setup before proposing a plan." },
    ],
    related: ["software-development", "full-stack", "web-design-ui-ux", "qa-testing"],
    metaDescription:
      "Mobile and iOS development by LAMHA Technologies: native and cross-platform applications with the backend, testing and release engineering they depend on.",
    status: "published",
  },
  {
    slug: "full-stack",
    family: "technology-engineering",
    number: "04",
    globalNumber: "04",
    title: "Polyglot Full-Stack",
    navLabel: "Polyglot Full-Stack",
    icon: "layers",
    visual: "stack",
    tagline: "Frontend, backend, databases, APIs, cloud, mobile, infrastructure and integrations.",
    outcome:
      "One accountable team across the entire stack, choosing the right language and platform for each part of the system.",
    overview: [
      "Real systems are rarely one technology. They combine interfaces, services, data stores, infrastructure and integrations, often written in different languages for good reasons. Our polyglot teams are comfortable across that whole surface.",
      "This lets us design end to end, remove hand-offs between specialist vendors and keep architectural decisions coherent from the browser to the database.",
    ],
    whatWeDo: [
      "End-to-end product engineering",
      "Multi-language, multi-service architectures",
      "Database design, migration and optimization",
      "API design and integration layers",
      "Cloud infrastructure and deployment pipelines",
      "Team augmentation for existing engineering organizations",
    ],
    capabilities: [
      { title: "Architecture across layers", description: "Frontend, backend, data and infrastructure designed as one system with clear boundaries." },
      { title: "Right tool per problem", description: "Language and framework choices driven by the workload and the team that will own it, not by habit." },
      { title: "Data engineering", description: "Schema design, migrations, indexing, reporting and data pipelines that hold up under growth." },
      { title: "Cloud and infrastructure", description: "Environments, infrastructure as code, observability and cost-aware scaling." },
      { title: "Integration engineering", description: "Connecting products, partners and internal systems through stable, documented interfaces." },
      { title: "Embedded teams", description: "Engineers who adopt your tools and rituals and work as part of your organization." },
    ],
    process: [
      "Existing systems, teams, constraints and goals are reviewed.",
      "Target architecture, stack decisions and delivery roadmap are documented.",
      "Detailed technical design across services, data and interfaces.",
      "Parallel workstreams across the stack with integrated continuous delivery.",
      "Layer-by-layer and end-to-end testing, including performance under load.",
      "Progressive rollout, observability and continuous evolution.",
    ],
    technology: ["Frontend", "Backend", "Databases", "APIs", "Cloud", "DevOps", "Mobile", "Testing", "Security"],
    deliverables: [
      "Target architecture and stack rationale",
      "Production services, interfaces and data layer",
      "Infrastructure as code and deployment pipelines",
      "Integration documentation and API contracts",
      "Operational runbooks and monitoring setup",
    ],
    quality: [
      "Contract tests between services and interfaces",
      "Load and performance testing on critical paths",
      "Infrastructure reviewed for security and least privilege",
      "Observability with logs, metrics and alerts",
    ],
    useCases: [
      "Platform rebuild spanning web, mobile and back-office services",
      "Adding a new service to an existing multi-language architecture",
      "Data-intensive product with reporting and integration needs",
      "Scaling an engineering team with an embedded full-stack squad",
    ],
    faqs: [
      { question: "What does polyglot mean in practice?", answer: "It means we are not tied to a single language or framework. We select technology per component based on what the problem and your team need." },
      { question: "Can you join our existing engineering team?", answer: "Yes. Team augmentation and embedded squads are common engagement models for full-stack work." },
      { question: "Do you handle infrastructure as well as code?", answer: "Yes. Environments, deployment pipelines, monitoring and infrastructure as code are part of full-stack delivery." },
    ],
    related: ["software-development", "web-development", "mobile-ios", "scale-optimization"],
    metaDescription:
      "Polyglot full-stack engineering by LAMHA Technologies: frontend, backend, databases, APIs, cloud, mobile and infrastructure delivered by one accountable team.",
    status: "published",
  },
  {
    slug: "qa-testing",
    family: "technology-engineering",
    number: "05",
    globalNumber: "05",
    title: "QA & Testing",
    navLabel: "QA & Testing",
    icon: "flask",
    visual: "testing",
    tagline: "Functional, regression, API, UI, performance, automation, web and mobile testing.",
    outcome:
      "Confidence in every release through structured, automated and independent quality assurance.",
    overview: [
      "Quality is not a phase at the end of a project. It is a discipline that runs through requirements, design, engineering and release. We provide QA as part of our own builds and as an independent service for products built elsewhere.",
      "From test strategy to automation frameworks and performance testing, we help teams release faster with fewer surprises in production.",
    ],
    whatWeDo: [
      "Test strategy and planning",
      "Functional and regression testing",
      "API and integration testing",
      "UI and cross-device testing for web and mobile",
      "Test automation frameworks and CI integration",
      "Performance and load testing",
    ],
    capabilities: [
      { title: "Test strategy", description: "Risk-based plans that focus effort where failures would hurt the business most." },
      { title: "Automation engineering", description: "Maintainable automated suites integrated into your pipelines, not brittle scripts." },
      { title: "API and integration testing", description: "Contract, functional and negative testing across services and third-party integrations." },
      { title: "Web and mobile UI testing", description: "Cross-browser, cross-device and accessibility-aware testing of real user journeys." },
      { title: "Performance testing", description: "Load, stress and endurance tests that reveal bottlenecks before customers do." },
      { title: "Clear reporting", description: "Reproducible defect reports, coverage visibility and release readiness summaries." },
    ],
    process: [
      "Product, risks, environments and existing coverage are assessed.",
      "Test strategy, scope, tooling and entry/exit criteria are agreed.",
      "Test cases, data and automation architecture are designed.",
      "Automation frameworks and suites are built alongside manual test cycles.",
      "Execution across functional, regression, API, UI and performance layers.",
      "Continuous test maintenance and quality reporting release after release.",
    ],
    technology: ["Testing", "DevOps", "APIs", "Frontend", "Mobile"],
    deliverables: [
      "Test strategy and plan",
      "Test cases and traceability to requirements",
      "Automated test suites and CI integration",
      "Defect reports and quality dashboards",
      "Performance test results and recommendations",
    ],
    quality: [
      "Independent verification separate from the development team where required",
      "Version-controlled test assets",
      "Coverage tracked against business-critical journeys",
      "Sensitive test data handled securely",
    ],
    useCases: [
      "Independent QA for a product built by an internal team",
      "Automation suite for a fast-moving SaaS release cycle",
      "Pre-launch regression and performance testing",
      "Mobile app testing across devices and OS versions",
    ],
    faqs: [
      { question: "Can you test software you did not build?", answer: "Yes. Independent QA for existing products is a core part of this service." },
      { question: "Manual or automated testing?", answer: "Both. We automate what benefits from repetition and keep skilled manual testing for exploratory and usability-focused work." },
      { question: "How do you integrate with our pipeline?", answer: "Automated suites are designed to run in your CI/CD environment so results are visible on every change." },
    ],
    related: ["software-development", "security", "web-development", "mobile-ios"],
    metaDescription:
      "QA and testing services by LAMHA Technologies: functional, regression, API, UI, automation and performance testing for web and mobile products.",
    status: "published",
  },
  {
    slug: "security",
    family: "technology-engineering",
    number: "06",
    globalNumber: "06",
    title: "Security",
    navLabel: "Security",
    icon: "shield",
    visual: "security",
    tagline: "Security-conscious engineering, application security review and technical security services.",
    outcome:
      "Products and systems engineered with security as a design principle, reviewed and hardened before they face real users.",
    overview: [
      "Security failures are usually design failures discovered late. We bring security thinking into architecture, code and infrastructure from the start, and we review existing systems for weaknesses before they become incidents.",
      "Our work focuses on practical application and infrastructure security for the systems we and our clients build: secure defaults, access control, dependency hygiene, configuration review and clear remediation plans.",
    ],
    whatWeDo: [
      "Secure software development lifecycle practices",
      "Application security review of code and architecture",
      "Authentication, authorization and access control design",
      "Secure configuration of infrastructure and deployments",
      "Dependency and vulnerability management",
      "Security hardening and remediation support",
    ],
    capabilities: [
      { title: "Secure-by-design architecture", description: "Threat-aware design of data flows, trust boundaries and access models." },
      { title: "Application security review", description: "Structured review of code, configuration and dependencies with prioritized findings." },
      { title: "Identity and access", description: "Authentication, session handling, roles and permissions designed to the sensitivity of the data." },
      { title: "Infrastructure hardening", description: "Least-privilege access, secrets management, network boundaries and secure deployment pipelines." },
      { title: "Secure handling of uploads and inputs", description: "Validation, sanitization and file handling that protect systems from hostile input." },
      { title: "Remediation planning", description: "Clear, prioritized fixes with engineering support to implement them." },
    ],
    process: [
      "Systems, data sensitivity, threats and existing controls are mapped.",
      "Scope, review approach and security requirements are agreed.",
      "Security architecture and control design for new or changed systems.",
      "Implementation of controls, hardening and secure engineering practices.",
      "Security testing and verification of remediations.",
      "Ongoing monitoring guidance and periodic review.",
    ],
    technology: ["Security", "Backend", "Cloud", "DevOps", "APIs"],
    deliverables: [
      "Security requirements and threat overview",
      "Review findings with severity and remediation guidance",
      "Hardened configuration and access control implementation",
      "Secure development guidelines for the team",
      "Verification report after remediation",
    ],
    quality: [
      "Findings prioritized by real business risk",
      "Least-privilege and secrets management verified",
      "Sensitive information handled under strict confidentiality",
      "Recommendations that are practical for the team to sustain",
    ],
    useCases: [
      "Security review before a product launch",
      "Hardening an existing platform after growth",
      "Designing access control for a multi-tenant SaaS",
      "Securing file upload, forms and API endpoints",
    ],
    faqs: [
      { question: "Is this a penetration testing service?", answer: "Our focus is security-conscious engineering and application security review. Where formal penetration testing or certification is required, we help scope it and prepare the system for it." },
      { question: "Do you provide certifications or compliance attestations?", answer: "No. We do not claim certifications. We help teams build and document controls that support their compliance efforts." },
      { question: "Can you review software built by another vendor?", answer: "Yes. Independent review of existing code, configuration and architecture is a common engagement." },
    ],
    related: ["qa-testing", "software-development", "full-stack", "scale-optimization"],
    metaDescription:
      "Security services by LAMHA Technologies: security-conscious engineering, application security review, access control design and infrastructure hardening.",
    status: "published",
  },

  /* ------------------------------------------------------------------ */
  /* FAMILY 02 — DIGITAL EXPERIENCE                                       */
  /* ------------------------------------------------------------------ */
  {
    slug: "web-design-ui-ux",
    family: "digital-experience",
    number: "01",
    globalNumber: "07",
    title: "Web Design / UI/UX",
    navLabel: "Web Design / UI/UX",
    icon: "pen-tool",
    visual: "interface",
    tagline: "Clarity-first interfaces, responsive UX, design systems, interaction design and conversion-oriented experiences.",
    outcome:
      "Interfaces that make complex products feel simple and turn visitors into customers.",
    overview: [
      "Good design is clarity. We design websites, applications and product interfaces that communicate quickly, guide users confidently and work on every screen size.",
      "Our designers work alongside engineers from the first sketch, so what is designed can be built well, and design systems stay consistent as the product grows.",
    ],
    whatWeDo: [
      "UX research, flows and information architecture",
      "Wireframes and interactive prototypes",
      "Website and product UI design",
      "Design systems and component libraries",
      "Conversion-oriented landing experiences",
      "Design support during implementation",
    ],
    capabilities: [
      { title: "User flows and structure", description: "Information architecture and journeys that reflect how users think, not how systems are organized." },
      { title: "Responsive interface design", description: "Layouts designed for desktop, tablet and mobile with equal care." },
      { title: "Design systems", description: "Tokens, components and patterns that keep products consistent and speed up delivery." },
      { title: "Interaction design", description: "States, transitions and feedback that make interfaces feel responsive and trustworthy." },
      { title: "Accessibility", description: "Contrast, focus, hierarchy and semantics considered at the design stage." },
      { title: "Conversion focus", description: "Hierarchy, copy structure and calls to action designed to move users toward outcomes." },
    ],
    process: [
      "Users, business goals, content and constraints are understood.",
      "Information architecture, key journeys and design principles are defined.",
      "Wireframes, visual direction, high-fidelity UI and prototypes.",
      "Design system handover and close collaboration during implementation.",
      "Usability checks, accessibility review and cross-device QA of the built product.",
      "Measurement and iterative design improvements after launch.",
    ],
    technology: ["Frontend", "Testing"],
    deliverables: [
      "User flows and information architecture",
      "Wireframes and prototypes",
      "High-fidelity UI designs for all breakpoints",
      "Design system and component documentation",
      "Implementation support and design QA",
    ],
    quality: [
      "Accessibility considered from wireframe stage",
      "Designs validated against real content and edge cases",
      "Consistency enforced through a documented design system",
      "Design QA against the implemented product",
    ],
    useCases: [
      "Corporate website redesign with a conversion focus",
      "SaaS product interface and design system",
      "Dashboard redesign for a data-heavy application",
      "Mobile app UX and UI design",
    ],
    faqs: [
      { question: "Do you design and build, or design only?", answer: "Both. We can deliver design as a standalone service or as part of a full design-and-build engagement." },
      { question: "Will we get a design system?", answer: "For products expected to grow, yes. Design systems keep interfaces consistent and make future work faster." },
      { question: "How do you handle accessibility in design?", answer: "Contrast, hierarchy, focus states and semantic structure are addressed during design so the built product starts from a solid accessibility baseline." },
    ],
    related: ["web-development", "brand-identity", "motion", "digital-strategy"],
    metaDescription:
      "Web design and UI/UX by LAMHA Technologies: clarity-first interfaces, responsive UX, design systems and conversion-oriented digital experiences.",
    status: "published",
  },
  {
    slug: "brand-identity",
    family: "digital-experience",
    number: "02",
    globalNumber: "08",
    title: "Brand Identity",
    navLabel: "Brand Identity",
    icon: "fingerprint",
    visual: "identity",
    tagline: "Visual identity systems, digital brand assets, typography, logo applications and scalable consistency.",
    outcome:
      "A visual identity that makes a technology business look as credible as it is, consistently across every touchpoint.",
    overview: [
      "Technology companies are judged in seconds. A coherent identity signals discipline, quality and ambition before a single line of product is seen.",
      "We create identity systems built for digital-first businesses: logo systems, typography, color, layout principles and digital assets that scale from a favicon to a product interface.",
    ],
    whatWeDo: [
      "Logo and mark design",
      "Visual identity systems",
      "Typography and color systems",
      "Digital brand assets and templates",
      "Brand guidelines and usage rules",
      "Identity application across web and product",
    ],
    capabilities: [
      { title: "Identity systems", description: "Marks, wordmarks and lockups designed to remain recognizable in one color and at small sizes." },
      { title: "Typography and color", description: "Type hierarchies and palettes that work in print, on screens and inside product UI." },
      { title: "Digital-first assets", description: "Social, presentation, document and web assets produced from a single master system." },
      { title: "Guidelines", description: "Clear, practical rules so internal teams and partners apply the brand consistently." },
      { title: "Product alignment", description: "Identity translated into interface tokens so brand and product speak the same language." },
      { title: "Evolution, not disruption", description: "Refreshing existing brands while preserving the equity they have built." },
    ],
    process: [
      "Business positioning, audience, competitors and existing equity are explored.",
      "Brand attributes, direction and deliverable scope are agreed.",
      "Concept exploration, refinement and full identity system design.",
      "Production of master artwork, assets and templates.",
      "Application testing across sizes, contexts and media.",
      "Guidelines, handover and support for rollout.",
    ],
    technology: ["Frontend"],
    deliverables: [
      "Logo system and master vector artwork",
      "Typography, color and layout system",
      "Digital asset kit and templates",
      "Brand guidelines document",
      "Interface design tokens where applicable",
    ],
    quality: [
      "Marks tested at minimum sizes and in one color",
      "Color contrast verified for digital accessibility",
      "Consistent construction and clear-space rules",
      "Vector masters delivered in editable formats",
    ],
    useCases: [
      "New technology company identity",
      "Rebrand ahead of a product launch or funding round",
      "Sub-brand for a new product line",
      "Aligning an existing brand with a new digital product",
    ],
    faqs: [
      { question: "Do you handle full rebrands as well as new identities?", answer: "Yes. We work on both, and with rebrands we take care to preserve existing recognition where it has value." },
      { question: "Do we receive editable source files?", answer: "Yes. Master artwork is delivered in editable vector formats along with production exports." },
      { question: "Can the identity be applied to our product UI?", answer: "Yes. Translating brand into design tokens and interface principles is a core part of how we work." },
    ],
    related: ["web-design-ui-ux", "motion", "web-development", "digital-strategy"],
    metaDescription:
      "Brand identity by LAMHA Technologies: logo systems, typography, color, digital brand assets and guidelines built for technology-driven businesses.",
    status: "published",
  },
  {
    slug: "motion",
    family: "digital-experience",
    number: "03",
    globalNumber: "09",
    title: "Motion & Interaction",
    navLabel: "Motion & Interaction",
    icon: "sparkles",
    visual: "motion",
    tagline: "Purposeful animation, micro-interactions, scroll behavior and motion systems.",
    outcome:
      "Motion that explains, guides and reassures, without slowing the product down or distracting from it.",
    overview: [
      "Motion is communication. Used well, it shows relationships, confirms actions and makes interfaces feel alive. Used badly, it gets in the way. We design motion systems with purpose and restraint.",
      "Our work covers interface micro-interactions, scroll-driven storytelling, product animation and motion guidelines, always with performance and reduced-motion accessibility built in.",
    ],
    whatWeDo: [
      "Interface micro-interactions",
      "Scroll and page transition behavior",
      "Product and feature animation",
      "Motion systems and guidelines",
      "Animated brand and marketing assets",
      "Performance-aware motion implementation",
    ],
    capabilities: [
      { title: "Micro-interactions", description: "Feedback, state changes and transitions that make interfaces feel responsive." },
      { title: "Scroll storytelling", description: "Scroll-linked reveals and sequences that guide attention through a narrative." },
      { title: "Motion systems", description: "Durations, easings and patterns defined once and applied consistently." },
      { title: "Performance-first", description: "Animation implemented with techniques that keep interfaces smooth on real devices." },
      { title: "Accessible motion", description: "Reduced-motion alternatives and restraint so motion never blocks content." },
      { title: "Brand in motion", description: "Logo animation and marketing motion that extend the identity system." },
    ],
    process: [
      "Product moments, brand character and technical constraints are reviewed.",
      "Motion principles, priorities and scope are defined.",
      "Storyboards, prototypes and motion specifications.",
      "Implementation in code or delivery of production assets.",
      "Performance testing and reduced-motion verification.",
      "Guidelines and iteration as the product evolves.",
    ],
    technology: ["Frontend", "Mobile"],
    deliverables: [
      "Motion principles and specification",
      "Prototypes and storyboards",
      "Implemented interactions or production assets",
      "Motion guidelines for the design system",
    ],
    quality: [
      "Respects prefers-reduced-motion",
      "Frame-rate and performance checked on real devices",
      "Motion never delays access to content",
      "Consistent timing and easing across the product",
    ],
    useCases: [
      "Micro-interactions for a SaaS interface",
      "Scroll-driven storytelling for a product launch page",
      "Animated logo and brand assets",
      "Onboarding flows that explain a product through motion",
    ],
    faqs: [
      { question: "Will animation slow our website down?", answer: "Not when it is done properly. We use performance-aware techniques and keep motion purposeful and lightweight." },
      { question: "How do you handle users who prefer reduced motion?", answer: "Every motion system we deliver includes reduced-motion behavior so content remains fully accessible." },
    ],
    related: ["web-design-ui-ux", "brand-identity", "web-development", "scale-optimization"],
    metaDescription:
      "Motion and interaction design by LAMHA Technologies: purposeful micro-interactions, scroll behavior and motion systems built for performance and accessibility.",
    status: "published",
  },

  /* ------------------------------------------------------------------ */
  /* FAMILY 03 — GROWTH & OPTIMIZATION                                    */
  /* ------------------------------------------------------------------ */
  {
    slug: "digital-strategy",
    family: "growth-optimization",
    number: "01",
    globalNumber: "10",
    title: "Digital Strategy",
    navLabel: "Digital Strategy",
    icon: "compass",
    visual: "strategy",
    tagline: "Business, product and digital strategy before design and build decisions.",
    outcome:
      "Clear direction before investment: what to build, why, in what order and how success will be measured.",
    overview: [
      "The most expensive mistakes in technology happen before the first line of code, when the wrong problem is chosen or the right problem is scoped badly. Strategy work prevents that.",
      "We help leaders translate business goals into product and technology decisions: priorities, roadmaps, architecture direction, build-versus-buy choices and the measurements that will tell you whether it is working.",
    ],
    whatWeDo: [
      "Discovery and stakeholder alignment",
      "Product and digital roadmaps",
      "Technical feasibility and build-versus-buy analysis",
      "Digital presence and conversion strategy",
      "Prioritization frameworks and delivery planning",
      "Measurement and KPI definition",
    ],
    capabilities: [
      { title: "Discovery", description: "Structured interviews, workshops and analysis that surface the real problem and its constraints." },
      { title: "Product strategy", description: "Positioning, scope and sequencing of a product or platform against business goals." },
      { title: "Technology direction", description: "Architecture options, feasibility and vendor choices assessed against your context." },
      { title: "Digital presence strategy", description: "How website, content, search and analytics work together to generate qualified demand." },
      { title: "Roadmapping", description: "Phased plans with decision points, dependencies and realistic capacity." },
      { title: "Measurement design", description: "KPIs and instrumentation defined before build so results can be proven." },
    ],
    process: [
      "Stakeholder interviews, current-state review and goal setting.",
      "Problem framing, options and evaluation criteria are agreed.",
      "Strategy, roadmap and architecture direction are developed.",
      "Recommendations documented with clear next steps and estimates.",
      "Assumptions validated with prototypes or research where needed.",
      "Ongoing advisory as the plan is executed and adjusted.",
    ],
    technology: ["Backend", "Frontend", "Cloud", "AI / Automation"],
    deliverables: [
      "Discovery findings and problem statement",
      "Product or digital strategy document",
      "Prioritized roadmap with phases and decision points",
      "Technical direction and feasibility assessment",
      "KPI and measurement framework",
    ],
    quality: [
      "Recommendations tied to explicit business goals",
      "Assumptions and risks stated openly",
      "Options compared with clear trade-offs",
      "Plans sized to real budgets and teams",
    ],
    useCases: [
      "Defining an MVP for a new venture",
      "Technology roadmap for a growing SME",
      "Build-versus-buy decision for an enterprise capability",
      "Digital presence strategy before a website rebuild",
    ],
    faqs: [
      { question: "Do we have to build with you after strategy work?", answer: "No. Strategy engagements stand on their own and produce documentation any capable team can execute." },
      { question: "How long does a strategy engagement take?", answer: "It depends on scope. Focused discovery sprints are short and time-boxed; broader roadmaps take longer. We agree the format up front." },
    ],
    related: ["software-development", "web-design-ui-ux", "analytics", "seo"],
    metaDescription:
      "Digital strategy by LAMHA Technologies: discovery, product roadmaps, technical feasibility and measurement design before design and build decisions.",
    status: "published",
  },
  {
    slug: "seo",
    family: "growth-optimization",
    number: "02",
    globalNumber: "11",
    title: "SEO",
    navLabel: "SEO",
    icon: "search",
    visual: "seo",
    tagline: "Technical SEO, on-page structure, metadata, performance and discoverability.",
    outcome:
      "Websites that search engines can crawl, understand and rank, engineered rather than bolted on.",
    overview: [
      "Most search problems are engineering problems: slow pages, broken structure, missing metadata, duplicate URLs and content that is invisible to crawlers. We fix them at the source.",
      "Our SEO work is technical and structural. We make sites fast, semantic and well-organized, set up measurement, and build content structures around the topics your business should own.",
    ],
    whatWeDo: [
      "Technical SEO audits and remediation",
      "Site architecture and internal linking",
      "On-page structure, metadata and structured data",
      "Performance optimization for search",
      "Migration and redesign SEO planning",
      "Search measurement and reporting setup",
    ],
    capabilities: [
      { title: "Technical audits", description: "Crawlability, indexation, rendering, performance and structural issues identified and prioritized." },
      { title: "Site architecture", description: "URL structures, navigation and internal linking that make topics clear to users and crawlers." },
      { title: "On-page and structured data", description: "Titles, descriptions, headings, canonicals, Open Graph and schema markup implemented correctly." },
      { title: "Performance for search", description: "Core Web Vitals and loading strategy improvements that help rankings and users alike." },
      { title: "Migration safety", description: "Redirect mapping and monitoring so redesigns and platform changes do not lose visibility." },
      { title: "Topic clusters", description: "Content structures organized around the services and problems your business should be found for." },
    ],
    process: [
      "Current visibility, technical state and business priorities are assessed.",
      "Target topics, priorities and success metrics are agreed.",
      "Architecture, metadata and content structure recommendations.",
      "Technical fixes and structural changes implemented.",
      "Validation of indexation, rendering and performance.",
      "Ongoing monitoring, reporting and iteration.",
    ],
    technology: ["Frontend", "Backend", "Cloud"],
    deliverables: [
      "Technical SEO audit and prioritized fixes",
      "Site architecture and internal linking plan",
      "Metadata, canonical and structured data implementation",
      "Sitemap, robots and indexation configuration",
      "Search performance reporting setup",
    ],
    quality: [
      "No thin or spammy pages created purely for search",
      "Changes validated with crawl and rendering tests",
      "Performance measured before and after",
      "Recommendations aligned with genuine user value",
    ],
    useCases: [
      "Technical SEO for a website relaunch",
      "Fixing indexation issues on a large web application",
      "Structuring service content for a B2B technology company",
      "Search-safe migration to a new platform",
    ],
    faqs: [
      { question: "Do you guarantee rankings?", answer: "No responsible provider can. We improve the technical and structural foundations that make good rankings possible and measure the results honestly." },
      { question: "Do you write content?", answer: "Our focus is technical and structural SEO. We define content structures and can collaborate with writers on execution." },
    ],
    related: ["web-development", "analytics", "digital-strategy", "scale-optimization"],
    metaDescription:
      "Technical SEO by LAMHA Technologies: audits, site architecture, metadata, structured data and performance work that makes websites discoverable.",
    status: "published",
  },
  {
    slug: "analytics",
    family: "growth-optimization",
    number: "03",
    globalNumber: "12",
    title: "Analytics",
    navLabel: "Analytics",
    icon: "bar-chart",
    visual: "analytics",
    tagline: "Measurement planning, event tracking, conversion analytics and decision-oriented reporting.",
    outcome:
      "Reliable data about how products and websites are used, turned into reports people actually make decisions with.",
    overview: [
      "Analytics only creates value when the right events are captured accurately and reported in a way that changes decisions. Most implementations fail on one of those two points.",
      "We design measurement plans, implement clean event tracking across web and mobile, and build reporting that answers the questions your team actually has.",
    ],
    whatWeDo: [
      "Measurement planning and KPI frameworks",
      "Event tracking implementation for web and mobile",
      "Conversion and funnel analytics",
      "Dashboards and decision-oriented reporting",
      "Data quality validation and governance",
      "Privacy-aware analytics configuration",
    ],
    capabilities: [
      { title: "Measurement plans", description: "Events, properties and KPIs defined against business questions before anything is tagged." },
      { title: "Clean implementation", description: "Event tracking built into the product with a consistent abstraction, not scattered snippets." },
      { title: "Conversion analytics", description: "Funnels, drop-off analysis and attribution for lead generation and product journeys." },
      { title: "Reporting", description: "Dashboards designed for the people who need to act on them." },
      { title: "Data quality", description: "Validation, naming standards and monitoring so numbers stay trustworthy." },
      { title: "Privacy-aware", description: "Consent-aware configuration and data minimization built into the setup." },
    ],
    process: [
      "Business questions, existing data and gaps are identified.",
      "Measurement plan, KPIs and tooling approach are agreed.",
      "Event schema, tracking architecture and dashboard design.",
      "Tracking implemented in the product and pipelines configured.",
      "Validation of event accuracy and report correctness.",
      "Regular reviews and evolution of the measurement framework.",
    ],
    technology: ["Frontend", "Backend", "Databases", "AI / Automation"],
    deliverables: [
      "Measurement plan and event schema",
      "Implemented tracking with documentation",
      "Conversion funnels and dashboards",
      "Data quality validation report",
      "Governance and naming guidelines",
    ],
    quality: [
      "Events validated against the measurement plan",
      "Personal data minimized and consent respected",
      "Tracking versioned alongside product code",
      "Reports reviewed with real decision-makers",
    ],
    useCases: [
      "Lead conversion analytics for a B2B website",
      "Product usage analytics for a SaaS platform",
      "Mobile app event tracking and retention reporting",
      "Executive dashboards across web, product and sales data",
    ],
    faqs: [
      { question: "Which analytics platform do you use?", answer: "We work with the platform that fits your needs and privacy requirements, and we implement tracking through an abstraction so the provider can change without rewriting the product." },
      { question: "Can you fix an existing analytics setup?", answer: "Yes. Audits and clean-ups of existing implementations are a frequent starting point." },
    ],
    related: ["seo", "digital-strategy", "scale-optimization", "web-development"],
    metaDescription:
      "Analytics by LAMHA Technologies: measurement planning, event tracking, conversion analytics and reporting that supports real decisions.",
    status: "published",
  },
  {
    slug: "scale-optimization",
    family: "growth-optimization",
    number: "04",
    globalNumber: "13",
    title: "Scale & Optimization",
    navLabel: "Scale & Optimization",
    icon: "gauge",
    visual: "scale",
    tagline: "Performance, conversion, modernization, infrastructure readiness and continuous improvement.",
    outcome:
      "Products that stay fast, stable and effective as traffic, data and business demands grow.",
    overview: [
      "Launch is the beginning. Real usage reveals bottlenecks, conversion leaks and architectural limits that were invisible on day one. We help teams find and fix them methodically.",
      "Our optimization work spans application performance, infrastructure readiness, conversion improvement and modernization of systems that have outgrown their original design.",
    ],
    whatWeDo: [
      "Performance audits and optimization",
      "Infrastructure scaling and cost review",
      "Conversion rate optimization",
      "Application and platform modernization",
      "Reliability, monitoring and incident readiness",
      "Continuous improvement programmes",
    ],
    capabilities: [
      { title: "Performance engineering", description: "Profiling, caching, query optimization and frontend loading strategy improvements." },
      { title: "Infrastructure readiness", description: "Capacity planning, scaling strategy, resilience and cost-efficient cloud configuration." },
      { title: "Conversion optimization", description: "Analysis and experiments that improve how visitors move toward enquiries and purchases." },
      { title: "Modernization", description: "Incremental replacement of ageing components without disrupting the business." },
      { title: "Reliability", description: "Monitoring, alerting and operational practices that reduce downtime and speed recovery." },
      { title: "Continuous improvement", description: "A retained cadence of measurement, prioritization and improvement work." },
    ],
    process: [
      "Systems, metrics, pain points and growth expectations are reviewed.",
      "Optimization priorities and target outcomes are agreed.",
      "Technical and experience improvement plans designed.",
      "Optimizations, infrastructure changes and modernization delivered in increments.",
      "Load, regression and conversion impact validated.",
      "Ongoing monitoring and improvement cycles.",
    ],
    technology: ["Backend", "Frontend", "Cloud", "Databases", "DevOps", "Testing"],
    deliverables: [
      "Performance and infrastructure assessment",
      "Prioritized optimization roadmap",
      "Implemented improvements with measured impact",
      "Monitoring and alerting configuration",
      "Modernization plan and executed phases",
    ],
    quality: [
      "Every change measured against a baseline",
      "Improvements validated under realistic load",
      "Changes rolled out progressively with rollback paths",
      "Cost and performance balanced deliberately",
    ],
    useCases: [
      "Slow web application ahead of a growth phase",
      "Cloud cost and scaling review for a SaaS platform",
      "Conversion improvement for a lead generation website",
      "Modernizing a legacy system component by component",
    ],
    faqs: [
      { question: "Can you optimize a system you did not build?", answer: "Yes. Most optimization work begins with an assessment of an existing system, whoever built it." },
      { question: "Is this a one-off project or ongoing?", answer: "Both models work. Many clients start with an assessment and move to a retained improvement cadence." },
    ],
    related: ["full-stack", "analytics", "seo", "security"],
    metaDescription:
      "Scale and optimization by LAMHA Technologies: performance engineering, infrastructure readiness, conversion optimization and modernization.",
    status: "published",
  },
];

/* ------------------------------------------------------------------ */
/* Selectors                                                            */
/* ------------------------------------------------------------------ */
export const publishedServices = services.filter((s) => s.status === "published");

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getFamily(id: ServiceFamilyId): ServiceFamily {
  return serviceFamilies.find((f) => f.id === id)!;
}

export function servicesByFamily(id: ServiceFamilyId): Service[] {
  return publishedServices.filter((s) => s.family === id);
}

export function getRelatedServices(service: Service): Service[] {
  return service.related.map((slug) => getService(slug)).filter((s): s is Service => Boolean(s));
}

/** Options for the Start a Project form (all launch services + Other). */
export const serviceOptions = [...publishedServices.map((s) => s.navLabel), "Other"] as const;
