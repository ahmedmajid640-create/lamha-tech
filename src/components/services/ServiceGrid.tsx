import { serviceFamilies, servicesByFamily } from "@/data/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "./ServiceCard";
import { Tilt } from "@/components/motion/Motion";
import { cn } from "@/lib/utils";

/** All published services grouped by family. Used on the home page and /services. */
export function ServiceGrid({ tone = "light", compact = false }: { tone?: "light" | "dark"; compact?: boolean }) {
  const dark = tone === "dark";
  return (
    <div className="space-y-16 lg:space-y-20">
      {serviceFamilies.map((family) => {
        const items = servicesByFamily(family.id);
        return (
          <section key={family.id} aria-labelledby={`family-${family.id}`}>
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <SectionLabel number={family.number} tone={tone}>
                  Family {family.number}
                </SectionLabel>
                <h3 id={`family-${family.id}`} className={cn("mt-4 text-h3 font-semibold", dark ? "text-white" : "text-navy")}>
                  {family.title}
                </h3>
                <p className={cn("mt-3 text-[0.95rem] leading-relaxed", dark ? "text-slate-400" : "text-slate-600")}>{family.description}</p>
              </div>
              <div className={cn("grid gap-4 sm:grid-cols-2 lg:col-span-8", compact ? "xl:grid-cols-3" : "xl:grid-cols-3")}>
                {items.map((service, i) => (
                  <Reveal key={service.slug} delay={i * 60}>
                    <Tilt className="h-full">
                      <ServiceCard service={service} tone={tone} className="h-full" />
                    </Tilt>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
