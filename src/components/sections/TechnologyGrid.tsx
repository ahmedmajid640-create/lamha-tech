"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { technologyCategories, type TechnologyCategory } from "@/data/technology";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Category-level technology presentation as an editorial index: numbered rows with
 * hairlines, focus areas inline and a hover highlight. No icon cards.
 */
export function TechnologyGrid({
  items = technologyCategories,
  tone = "dark",
  detailed = false,
  highlight,
}: {
  items?: TechnologyCategory[];
  tone?: "light" | "dark";
  detailed?: boolean;
  /** Category titles to emphasize (others are dimmed). */
  highlight?: string[];
}) {
  const dark = tone === "dark";
  return (
    <ol className={cn("border-t", dark ? "border-white/12" : "border-slate-300")}>
      {items.map((cat, i) => {
        const on = !highlight || highlight.includes(cat.title);
        return (
          <motion.li
            key={cat.slug}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE, delay: (i % 5) * 0.05 }}
            className={cn(
              "group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b py-4 transition-colors md:grid-cols-[4rem_14rem_1fr_auto] md:py-5",
              dark ? "border-white/12 hover:bg-white/[0.04]" : "border-slate-300 hover:bg-white",
              highlight && !on && "opacity-40",
            )}
          >
            <span className={cn("font-mono text-xs", dark ? "text-blue-200" : "text-blue")}>{cat.number}</span>
            <h3 className={cn("font-display text-lg font-semibold tracking-tight md:text-xl", dark ? "text-white" : "text-navy")}>{cat.title}</h3>
            <div className="col-span-3 md:col-span-1 md:col-start-3">
              {(detailed || !highlight) && <p className={cn("text-sm leading-relaxed", dark ? "text-slate-400" : "text-slate-600")}>{cat.description}</p>}
              {detailed && (
                <p className={cn("mt-2 font-mono text-[0.68rem] uppercase tracking-[0.14em]", dark ? "text-slate-500" : "text-slate-500")}>{cat.focus.join("  ·  ")}</p>
              )}
            </div>
            <ArrowUpRight aria-hidden="true" className={cn("hidden h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:block", dark ? "text-slate-600 group-hover:text-blue-200" : "text-slate-400 group-hover:text-blue")} />
          </motion.li>
        );
      })}
    </ol>
  );
}
