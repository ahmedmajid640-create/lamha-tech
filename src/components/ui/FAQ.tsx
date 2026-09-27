import { Plus } from "lucide-react";
import type { FAQ as FAQItem } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Accessible accordion using native <details>/<summary>: keyboard operable,
 * screen-reader friendly and works without JavaScript.
 */
export function FAQ({ items, className }: { items: FAQItem[]; className?: string }) {
  return (
    <div className={cn("divide-y divide-slate-200 border-y border-slate-200", className)}>
      {items.map((item, i) => (
        <details key={i} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-navy marker:content-none [&::-webkit-details-marker]:hidden sm:text-lg">
            <span>{item.question}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition-[transform,background-color,color,border-color] duration-300 group-open:rotate-45 group-open:border-blue group-open:bg-blue group-open:text-white">
              <Plus aria-hidden="true" className="h-4 w-4" />
            </span>
          </summary>
          <div className="pb-6 pr-14 text-[0.95rem] leading-relaxed text-slate-600">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
