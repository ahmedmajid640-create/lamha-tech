import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DarkBackdrop } from "@/components/visuals/GridPattern";
import { AccentCanvas } from "@/components/three/AccentCanvas";
import type { AccentVariant } from "@/components/three/AccentScene";
import { Rise, TextReveal } from "@/components/motion/Motion";
import { cn } from "@/lib/utils";

/**
 * Standard dark page hero used by every inner page.
 * Pass `accent` for a 3D form (with `visual` as its non-WebGL fallback), or `visual` alone for a static illustration.
 */
export function PageHero({
  number,
  label,
  title,
  description,
  breadcrumbs,
  actions,
  visual,
  accent,
  className,
  compact = false,
}: {
  number?: string;
  label: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
  visual?: React.ReactNode;
  accent?: AccentVariant;
  className?: string;
  compact?: boolean;
}) {
  const hasVisual = Boolean(visual || accent);
  const titleNode = typeof title === "string" ? <TextReveal lines={[title]} delay={0.05} /> : title;
  return (
    <section className={cn("dark-section relative overflow-hidden bg-deep text-white", className)}>
      <DarkBackdrop />
      <div className={cn("container-x relative pt-[calc(var(--header-h)+3rem)]", compact ? "pb-14 sm:pb-16" : "pb-16 sm:pb-24", hasVisual && "lg:pb-28")}>
        {breadcrumbs && (
          <Rise y={8}>
            <Breadcrumb items={breadcrumbs} className="mb-8" />
          </Rise>
        )}
        <div className={cn("grid gap-12", hasVisual && "lg:grid-cols-12 lg:items-center")}>
          <div className={cn(hasVisual ? "lg:col-span-6" : "max-w-3xl")}>
            <Rise y={8} delay={0.05}>
              <SectionLabel number={number} tone="dark">
                {label}
              </SectionLabel>
            </Rise>
            <h1 className="mt-6 text-h1 font-semibold text-white">{titleNode}</h1>
            {description && (
              <Rise delay={0.3}>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">{description}</p>
              </Rise>
            )}
            {actions && (
              <Rise delay={0.45}>
                <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>
              </Rise>
            )}
          </div>
          {hasVisual && (
            <div className="lg:col-span-6">
              <Rise delay={0.2}>{accent ? <AccentCanvas variant={accent} fallback={visual} /> : visual}</Rise>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
