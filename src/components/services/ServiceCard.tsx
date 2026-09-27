import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/data/services";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function ServiceCard({ service, tone = "light", showNumber = true, className }: { service: Service; tone?: "light" | "dark"; showNumber?: boolean; className?: string }) {
  const dark = tone === "dark";
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative flex h-full flex-col rounded-lg border p-6 transition-[transform,box-shadow,border-color,background-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1",
        dark
          ? "border-white/10 bg-white/[0.03] hover:border-blue-2/50 hover:bg-white/[0.06] hover:shadow-[var(--shadow-glow)]"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-md border transition-colors", dark ? "border-white/10 bg-white/5 text-blue-200 group-hover:bg-blue group-hover:text-white group-hover:border-blue" : "border-slate-200 bg-slate-50 text-blue group-hover:bg-blue group-hover:text-white group-hover:border-blue")}>
          <Icon name={service.icon} className="h-5 w-5" strokeWidth={1.75} />
        </span>
        {showNumber && <span className={cn("font-mono text-xs tabular-nums", dark ? "text-slate-500" : "text-slate-400")}>{service.number}</span>}
      </div>
      <h3 className={cn("mt-6 text-lg font-semibold leading-snug", dark ? "text-white" : "text-navy")}>{service.title}</h3>
      <p className={cn("mt-2 flex-1 text-sm leading-relaxed", dark ? "text-slate-400" : "text-slate-600")}>{service.tagline}</p>
      <span className={cn("mt-6 inline-flex items-center gap-1.5 text-sm font-medium", dark ? "text-blue-200" : "text-blue")}>
        Explore
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
