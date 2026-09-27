import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items, tone = "dark", className }: { items: Crumb[]; tone?: "light" | "dark"; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className={cn("rounded-sm transition-colors", tone === "dark" ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-navy")}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(tone === "dark" ? "text-slate-200" : "text-navy", "font-medium")}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight aria-hidden="true" className={cn("h-3.5 w-3.5", tone === "dark" ? "text-slate-600" : "text-slate-400")} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
