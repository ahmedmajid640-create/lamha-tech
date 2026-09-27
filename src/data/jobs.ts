/**
 * CMS model: Jobs (position, department, location, employment type, description,
 * responsibilities, requirements, nice-to-have, benefits, status).
 *
 * IMPORTANT: no approved vacancies have been supplied. The entries below are clearly
 * marked `status: "demo"` and render with a visible "Demo listing" badge so the site
 * never advertises a real vacancy that does not exist. Set status to "open" once a
 * position is approved for publication, or remove demo entries entirely.
 */
export type JobStatus = "open" | "closed" | "draft" | "demo";

export type Job = {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  status: JobStatus;
};

export const jobs: Job[] = [
  {
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    employmentType: "Full-time",
    summary: "Build web applications, APIs and integrations across the stack for client and internal products.",
    description:
      "This is a demonstration listing used to validate the careers experience. It does not represent an approved open vacancy. Approved roles will replace this entry.",
    responsibilities: [
      "Design and implement features across frontend, backend and data layers.",
      "Participate in architecture discussions, code reviews and technical planning.",
      "Write automated tests and contribute to CI/CD and release quality.",
      "Collaborate with design, QA and product to ship working software in iterations.",
    ],
    requirements: [
      "Professional experience delivering production web applications.",
      "Strong fundamentals in JavaScript/TypeScript, HTTP, databases and APIs.",
      "Comfortable working in a remote, asynchronous, documentation-driven team.",
    ],
    niceToHave: ["Cloud deployment experience.", "Experience with automation or AI tooling."],
    benefits: ["Remote-first work.", "Meaningful projects.", "Structured growth."],
    status: "demo",
  },
  {
    slug: "qa-engineer",
    title: "QA Engineer",
    department: "Quality",
    location: "Remote",
    employmentType: "Full-time",
    summary: "Own functional, regression, API and automation testing across web and mobile products.",
    description:
      "This is a demonstration listing used to validate the careers experience. It does not represent an approved open vacancy. Approved roles will replace this entry.",
    responsibilities: [
      "Plan and execute functional, regression, API and UI test cycles.",
      "Build and maintain automated test suites.",
      "Report clearly, reproduce reliably and work with engineers to resolve defects.",
    ],
    requirements: [
      "Hands-on experience testing web or mobile applications.",
      "Familiarity with at least one test automation framework.",
      "Attention to detail and clear written communication.",
    ],
    niceToHave: ["Performance or security testing exposure."],
    benefits: ["Remote-first work.", "Meaningful projects.", "Structured growth."],
    status: "demo",
  },
  {
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    employmentType: "Full-time",
    summary: "Design clear, conversion-oriented interfaces and design systems for web and mobile products.",
    description:
      "This is a demonstration listing used to validate the careers experience. It does not represent an approved open vacancy. Approved roles will replace this entry.",
    responsibilities: [
      "Translate requirements into flows, wireframes, prototypes and production-ready UI.",
      "Maintain and extend component libraries and design systems.",
      "Collaborate closely with engineers during implementation.",
    ],
    requirements: [
      "A portfolio of shipped digital products.",
      "Strong typography, layout and interaction design fundamentals.",
      "Experience with modern design and prototyping tools.",
    ],
    niceToHave: ["Motion design or front-end implementation skills."],
    benefits: ["Remote-first work.", "Meaningful projects.", "Structured growth."],
    status: "demo",
  },
];

export const visibleJobs = jobs.filter((j) => j.status === "open" || j.status === "demo");
export const openJobs = jobs.filter((j) => j.status === "open");

export const careerValues = [
  {
    number: "01",
    title: "Meaningful Work",
    description: "Solve real problems for real businesses, with visible impact on how they operate.",
  },
  {
    number: "02",
    title: "Growth",
    description: "Learn across the stack, own outcomes and grow with a company that is still being built.",
  },
  {
    number: "03",
    title: "Global Opportunities",
    description: "Work on international projects with clients and collaborators across markets.",
  },
  {
    number: "04",
    title: "Collaborative Team",
    description: "A supportive, engineering-driven culture where good ideas travel fast.",
  },
];
