/**
 * CMS model: Projects (title, client, industry, challenge, solution, technology,
 * outcome, images, testimonial, category, status).
 *
 * No approved case studies exist yet, so `projects` is intentionally EMPTY.
 * The Work page renders an intentional placeholder state. Adding an entry here
 * with status "published" will render it in the portfolio grid without redesign.
 * Never fabricate clients, metrics, outcomes or testimonials.
 */
export const projectCategories = [
  "All",
  "Web",
  "Mobile",
  "SaaS",
  "AI",
  "Enterprise",
  "Branding",
  "Automation",
] as const;

export type ProjectCategory = Exclude<(typeof projectCategories)[number], "All">;

export type Project = {
  slug: string;
  title: string;
  client: string | null;
  industry: string;
  challenge: string;
  approach?: string;
  solution: string;
  technology: string[];
  outcome: string | null;
  images: { src: string; alt: string }[];
  testimonial: { quote: string; author: string; role: string } | null;
  categories: ProjectCategory[];
  status: "published" | "draft";
};

export const projects: Project[] = [];

export const publishedProjects = projects.filter((p) => p.status === "published");
