import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Solution } from "@/data/solutions";
import { cn } from "@/lib/utils";

export function SolutionCard({ solution, className }: { solution: Solution; className?: string }) {
  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white p-7 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-slate-300 hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-blue transition-transform duration-500 group-hover:scale-x-100" />
      <span className="font-mono text-xs text-blue">{solution.number}</span>
      <h3 className="mt-4 text-xl font-semibold text-navy">{solution.navLabel}</h3>
      <p className="mt-2 text-[0.95rem] font-medium text-slate-700">{solution.headline}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{solution.intro}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue">
        Explore solutions
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
