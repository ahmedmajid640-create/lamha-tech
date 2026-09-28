import { ArrowRight, Boxes, Compass, Users } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem, Tilt } from "@/components/motion/Motion";

/** Compact, factual overview of how clients can engage LAMHA. Sourced from the solutions data. */
const models = [
  {
    icon: Boxes,
    title: "Fixed-scope project",
    description: "A defined deliverable, timeline and budget. Best for MVPs, websites, integrations and clearly scoped builds.",
    fit: "Startups · SMEs",
    href: "/solutions/startups",
  },
  {
    icon: Users,
    title: "Dedicated team",
    description: "A cross-functional squad that works as your engineering department, month to month, inside your tools and rituals.",
    fit: "Growing products · Enterprise",
    href: "/solutions/enterprise",
  },
  {
    icon: Compass,
    title: "Discovery sprint",
    description: "A short, time-boxed engagement that turns an idea or a legacy system into a written scope, architecture and plan.",
    fit: "Before any major build",
    href: "/services/digital-strategy",
  },
];

export function EngagementStrip({ number = "05" }: { number?: string }) {
  return (
    <section aria-labelledby="engagement-heading" className="border-y border-slate-200 bg-white">
      <div className="container-x section-y-sm">
        <SectionHeading number={number} label="Ways to work with us" title={<span id="engagement-heading">Three engagement models. One process.</span>} size="h3" as="h2">
          <Link href="/solutions" className="group inline-flex items-center gap-1.5 text-sm font-medium text-blue">
            Solutions by organization
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </SectionHeading>
        <Stagger as="ul" className="mt-8 grid gap-4 md:grid-cols-3">
          {models.map((m) => (
            <StaggerItem key={m.title} as="li">
              <Tilt max={4} className="h-full">
                <Link href={m.href} className="group flex h-full flex-col rounded-lg border border-slate-200 bg-cloud p-6 transition-colors hover:border-blue-200 hover:bg-white">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-blue transition-colors group-hover:border-blue group-hover:bg-blue group-hover:text-white">
                      <m.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="text-[0.65rem] uppercase tracking-[0.16em] text-slate-500">{m.fit}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-navy">{m.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{m.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
