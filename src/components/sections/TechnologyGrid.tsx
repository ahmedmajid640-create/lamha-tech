import { technologyCategories, type TechnologyCategory } from "@/data/technology";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Category-level technology presentation (no unverified vendor claims). */
export function TechnologyGrid({
  items = technologyCategories,
  tone = "dark",
  detailed = false,
  highlight,
}: {
  items?: TechnologyCategory[];
  tone?: "light" | "dark";
  detailed?: boolean;
  /** Category titles to visually emphasize (e.g. from a service's technology list). */
  highlight?: string[];
}) {
  const dark = tone === "dark";
  return (
    <ul className={cn("grid gap-3", detailed ? "sm:grid-cols-2 xl:grid-cols-5" : "grid-cols-2 lg:grid-cols-5")}>
      {items.map((cat, i) => {
        const on = !highlight || highlight.includes(cat.title);
        return (
          <Reveal key={cat.slug} as="li" delay={i * 40}>
            <div
              className={cn(
                "flex h-full flex-col rounded-lg border p-5 transition-colors",
                dark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-white",
                highlight && !on && "opacity-45",
                highlight && on && (dark ? "border-blue-2/50 bg-blue/10" : "border-blue-200 bg-blue-50/50"),
              )}
            >
              <div className="flex items-center justify-between">
                <Icon name={cat.icon} className={cn("h-5 w-5", dark ? "text-blue-200" : "text-blue")} strokeWidth={1.75} />
                <span className={cn("font-mono text-[0.65rem]", dark ? "text-slate-500" : "text-slate-400")}>{cat.number}</span>
              </div>
              <h3 className={cn("mt-4 text-[0.95rem] font-semibold", dark ? "text-white" : "text-navy")}>{cat.title}</h3>
              {detailed && (
                <>
                  <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-slate-400" : "text-slate-600")}>{cat.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {cat.focus.map((f) => (
                      <li key={f} className={cn("rounded border px-2 py-0.5 text-[0.7rem]", dark ? "border-white/10 text-slate-300" : "border-slate-200 text-slate-600")}>
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}
