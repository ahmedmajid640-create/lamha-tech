import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

/** Editorial case-study card. Renders real projects only; see PlaceholderCard for the empty state. */
export function CaseStudyCard({ project, className }: { project: Project; className?: string }) {
  const cover = project.images[0];
  return (
    <Link
      href={`/work#${project.slug}`}
      className={cn("group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-blue-2/50 hover:shadow-[var(--shadow-glow)]", className)}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-navy">
        {cover ? (
          <Image src={cover.src} alt={cover.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 grid-texture" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-2">
          {project.categories.map((c) => (
            <Tag key={c} tone="dark">
              {c}
            </Tag>
          ))}
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{project.challenge}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-blue-200">
          View case study
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

/** Intentional empty-state tile: clearly marked as a reserved slot, never a fake project. */
export function PlaceholderCard({ index, label }: { index: number; label: string }) {
  return (
    <div className="relative flex aspect-[16/11] flex-col justify-between overflow-hidden rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-6" aria-hidden="true">
      <div className="absolute inset-0 grid-texture opacity-70" />
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue/15 blur-3xl" />
      <span className="relative font-mono text-xs text-slate-500">{String(index + 1).padStart(2, "0")}</span>
      <div className="relative">
        <div className="mb-3 flex gap-2">
          <span className="h-1.5 w-10 rounded-full bg-white/15" />
          <span className="h-1.5 w-6 rounded-full bg-blue/50" />
        </div>
        <p className="text-sm font-medium text-slate-300">{label}</p>
        <p className="mt-1 text-xs text-slate-500">Reserved for an approved case study</p>
      </div>
    </div>
  );
}
