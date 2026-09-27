import { Cpu, Hammer, RefreshCw } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const pillars = [
  {
    number: "01",
    title: "BUILD",
    subtitle: "Software and digital products.",
    description: "Custom software, web and mobile products, SaaS platforms and the interfaces people use every day.",
    icon: Hammer,
  },
  {
    number: "02",
    title: "ENGINEER",
    subtitle: "Technical systems and solutions.",
    description: "Architecture, APIs, data, infrastructure and integrations designed as coherent systems that hold up under real load.",
    icon: Cpu,
  },
  {
    number: "03",
    title: "EVOLVE",
    subtitle: "Automation, modernization, QA, security and continuous improvement.",
    description: "Strategy, design, testing, security, SEO and optimization that keep products improving long after launch.",
    icon: RefreshCw,
  },
];

export function WhatWeDo() {
  return (
    <section aria-labelledby="what-we-do-heading" className="bg-white">
      <div className="container-x section-y">
        <SectionHeading
          number="02"
          label="What we do"
          title={<span id="what-we-do-heading">From ideas to systems. From systems to impact.</span>}
          description="Three ways we turn requirements and real-world problems into working technology."
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.number} delay={i * 90}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-cloud p-8 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-slate-300 hover:shadow-[var(--shadow-card-hover)] sm:p-10">
                <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-blue">{p.number}</span>
                  <p.icon className="h-5 w-5 text-slate-400 transition-colors group-hover:text-blue" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="mt-10 text-4xl font-semibold tracking-tight text-navy sm:text-5xl">{p.title}</h3>
                <p className="mt-4 text-lg font-medium text-navy">{p.subtitle}</p>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-slate-600">{p.description}</p>
                <span aria-hidden="true" className="mt-8 h-px w-16 bg-slate-300 transition-[width,background-color] duration-500 group-hover:w-full group-hover:bg-blue" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
