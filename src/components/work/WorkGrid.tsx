"use client";

import { useMemo, useState } from "react";
import { projectCategories, type Project } from "@/data/projects";
import { CaseStudyCard, PlaceholderCard } from "./CaseStudyCard";
import { cn } from "@/lib/utils";

const PLACEHOLDER_LABELS = ["Web platform", "Mobile product", "SaaS system", "AI & automation", "Enterprise integration", "Brand & interface"];

/**
 * CMS-ready portfolio grid with category filters.
 * With zero published projects it renders an intentional placeholder state.
 */
export function WorkGrid({ projects, placeholders = 6 }: { projects: Project[]; placeholders?: number }) {
  const [active, setActive] = useState<(typeof projectCategories)[number]>("All");

  const filtered = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.categories.includes(active))),
    [projects, active],
  );

  const empty = projects.length === 0;

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {projectCategories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              aria-pressed={isActive}
              className={cn(
                "h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors",
                isActive ? "border-white bg-white text-navy" : "border-white/15 text-slate-300 hover:border-white/40 hover:text-white",
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {empty ? (
        <div className="mt-10">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="label-caps text-blue-200">Portfolio status</p>
            <p className="mt-3 max-w-2xl text-lg font-medium text-white">Approved LAMHA projects and case studies will appear here.</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Each case study will follow the same structure: Challenge, Approach, Solution, Technology, Outcome, Visuals and, where approved, Testimonial. Only verified work is published.
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {Array.from({ length: placeholders }).map((_, i) => (
              <PlaceholderCard key={i} index={i} label={PLACEHOLDER_LABELS[i % PLACEHOLDER_LABELS.length]} />
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <p role="status" className="mt-10 rounded-lg border border-white/10 p-8 text-center text-slate-400">
          No published projects in this category yet.
        </p>
      ) : (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2" aria-live="polite">
          {filtered.map((p) => (
            <li key={p.slug} id={p.slug}>
              <CaseStudyCard project={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
