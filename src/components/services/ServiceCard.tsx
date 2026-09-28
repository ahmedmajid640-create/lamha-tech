import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/data/services";
import { cn } from "@/lib/utils";

/** Editorial service tile: numeral, title, one line, arrow. Hairline borders, no icon box. */
export function ServiceCard({ service, tone = "light", showNumber = true, className }: { service: Service; tone?: "light" | "dark"; showNumber?: boolean; className?: string }) {
  const dark = tone === "dark";
  return (
    <Link
      href={`/services/${service.slug}`}
      data-preview-kind={service.visual}
      data-preview-label={service.title}
      className={cn(
        "group relative flex h-full flex-col justify-between border p-6 transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5",
        dark ? "border-white/12 bg-transparent hover:border-blue-2/60 hover:bg-white/[0.04]" : "border-slate-300 bg-white hover:border-navy",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        {showNumber ? <span className={cn("font-mono text-xs", dark ? "text-blue-200" : "text-blue")}>{service.globalNumber}</span> : <span />}
        <ArrowUpRight aria-hidden="true" className={cn("h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5", dark ? "text-slate-500 group-hover:text-blue-200" : "text-slate-400 group-hover:text-navy")} />
      </div>
      <div className="mt-10">
        <h3 className={cn("font-display text-xl font-semibold leading-tight tracking-tight", dark ? "text-white" : "text-navy")}>{service.title}</h3>
        <p className={cn("mt-3 text-sm leading-relaxed", dark ? "text-slate-400" : "text-slate-600")}>{service.tagline}</p>
      </div>
    </Link>
  );
}
