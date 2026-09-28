import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Motion";

/** How clients can engage LAMHA, as an editorial index (no cards). Sourced from the solutions data. */
const models = [
  { n: "01", title: "Fixed-scope project", description: "A defined deliverable, timeline and budget. Best for MVPs, websites, integrations and clearly scoped builds.", fit: "Startups · SMEs", href: "/solutions/startups" },
  { n: "02", title: "Dedicated team", description: "A cross-functional squad that works as your engineering department, month to month, inside your tools and rituals.", fit: "Growing products · Enterprise", href: "/solutions/enterprise" },
  { n: "03", title: "Discovery sprint", description: "A short, time-boxed engagement that turns an idea or a legacy system into a written scope, architecture and plan.", fit: "Before any major build", href: "/services/digital-strategy" },
];

export function EngagementStrip({ number = "05" }: { number?: string }) {
  return (
    <section aria-labelledby="engagement-heading" className="border-y border-slate-300 bg-white">
      <div className="container-x section-y-sm">
        <SectionHeading number={number} label="Ways to work with us" title={<span id="engagement-heading">Three engagement models. One process.</span>} size="h3" as="h2">
          <Link href="/solutions" className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-navy">
            Solutions by organization
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </SectionHeading>
        <Stagger as="ol" className="mt-8 border-t border-slate-300">
          {models.map((m) => (
            <StaggerItem key={m.n} as="li">
              <Link href={m.href} className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-b border-slate-300 py-5 transition-colors hover:bg-cloud md:grid-cols-[4rem_16rem_1fr_12rem_auto]">
                <span className="font-mono text-xs text-blue">{m.n}</span>
                <h3 className="font-display text-xl font-semibold tracking-tight text-navy">{m.title}</h3>
                <p className="col-span-3 text-sm leading-relaxed text-slate-600 md:col-span-1">{m.description}</p>
                <span className="hidden font-mono text-[0.68rem] uppercase tracking-[0.14em] text-slate-500 md:block">{m.fit}</span>
                <ArrowUpRight className="hidden h-4 w-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy md:block" aria-hidden="true" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
