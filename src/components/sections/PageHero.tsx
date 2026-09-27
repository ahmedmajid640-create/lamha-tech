import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DarkBackdrop } from "@/components/visuals/GridPattern";
import { cn } from "@/lib/utils";

/**
 * Standard dark page hero used by every inner page (services, solutions, about, ...).
 * Keeps the header's transparent-over-dark behavior consistent across the site.
 */
export function PageHero({
  number,
  label,
  title,
  description,
  breadcrumbs,
  actions,
  visual,
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
  className?: string;
  compact?: boolean;
}) {
  return (
    <section className={cn("dark-section relative overflow-hidden bg-deep text-white", className)}>
      <DarkBackdrop />
      <div className={cn("container-x relative pt-[calc(var(--header-h)+3rem)]", compact ? "pb-14 sm:pb-16" : "pb-16 sm:pb-24", visual && "lg:pb-28")}>
        {breadcrumbs && <Breadcrumb items={breadcrumbs} className="mb-8" />}
        <div className={cn("grid gap-12", visual && "lg:grid-cols-12 lg:items-center")}>
          <div className={cn(visual ? "lg:col-span-6" : "max-w-3xl")}>
            <SectionLabel number={number} tone="dark">
              {label}
            </SectionLabel>
            <h1 className="mt-6 text-h1 font-semibold text-white">{title}</h1>
            {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">{description}</p>}
            {actions && <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>}
          </div>
          {visual && <div className="lg:col-span-6">{visual}</div>}
        </div>
      </div>
    </section>
  );
}
