import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { technologyPrinciples } from "@/data/technology";
import { PageHero } from "@/components/sections/PageHero";
import { Statement } from "@/components/sections/Statement";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechnologyGrid } from "@/components/sections/TechnologyGrid";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { Button } from "@/components/ui/Button";
import { ArchitectureVisual } from "@/components/visuals/ArchitectureVisual";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = buildMetadata({
  title: "Technology Approach",
  description:
    "How LAMHA Technologies chooses technology: capabilities across frontend, backend, mobile, cloud, databases, DevOps, testing, AI, security and APIs.",
  path: "/technology",
});

export default function TechnologyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Technology", path: "/technology" }])} />
      <PageHero
        number="06"
        label="Technology"
        title={
          <>
            We choose technology for the problem, <span className="text-gradient-blue">not the trend.</span>
          </>
        }
        description="Our stack decisions follow the workload, the team that will own the system and the budget that has to sustain it. Below is how we think, and the categories we work across."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Technology" }]}
        actions={
          <Button href="/start-a-project" size="lg" icon="arrow">
            Start a Project
          </Button>
        }
        accent="cluster"
        field="wave"
        visual={<ArchitectureVisual />}
      />

      <Statement
        number="00"
        label="Philosophy"
        size="md"
        text="We choose technology for the problem, not the trend. The workload, the team that will own the system and the budget that has to sustain it decide the stack, never habit or hype."
      />

      <section aria-labelledby="principles-heading" className="bg-white">
        <div className="container-x section-y">
          <SectionHeading number="01" label="Principles" title={<span id="principles-heading">How we make technology decisions</span>} />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-2">
            {technologyPrinciples.map((p, i) => (
              <Reveal key={p.number} as="li" delay={i * 60}>
                <div className="h-full bg-white p-8">
                  <span className="font-mono text-xs text-blue">{p.number}</span>
                  <h3 className="mt-4 text-xl font-semibold text-navy">{p.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-slate-600">{p.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="categories-heading" className="dark-section bg-deep text-white">
        <div className="container-x section-y">
          <SectionHeading
            number="02"
            label="Capability categories"
            title={<span id="categories-heading">Where we work across the stack</span>}
            description="Technology stack details will be updated as capabilities are finalized. We do not claim vendor partnerships or certifications."
            tone="dark"
          />
          <div className="mt-12">
            <TechnologyGrid tone="dark" detailed />
          </div>
        </div>
      </section>

      <section aria-labelledby="handover-heading" className="bg-cloud">
        <div className="container-x section-y">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading number="03" label="Ownership" title={<span id="handover-heading">Systems you can own</span>} />
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-slate-600 lg:col-span-7">
              <p>Every system we build is delivered with the documentation, tests and environments a client team needs to take it forward. Technology choices favour widely supported tools so hiring and maintenance stay realistic.</p>
              <p>Where a client has existing platforms, we design around them rather than replacing what works. Integration and incremental modernization are usually better business decisions than wholesale rebuilds.</p>
            </div>
          </div>
        </div>
      </section>

      <CTASection headline="Not sure which approach fits your problem?" description="Share the requirement. We will recommend an approach based on the problem, not on a preferred stack." location="technology" />
    </>
  );
}
