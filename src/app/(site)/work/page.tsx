import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { publishedProjects } from "@/data/projects";
import { PageHero } from "@/components/sections/PageHero";
import { WorkGrid } from "@/components/work/WorkGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/sections/CTASection";
import { DarkBackdrop } from "@/components/visuals/GridPattern";

export const metadata: Metadata = buildMetadata({
  title: "Work — Ideas Built Into Real Products",
  description:
    "Selected LAMHA Technologies projects and case studies across web, mobile, SaaS, AI, enterprise, branding and automation. Approved case studies are published here.",
  path: "/work",
});

const structure = ["Challenge", "Approach", "Solution", "Technology", "Outcome", "Visuals", "Testimonial"];

export default function WorkPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Work", path: "/work" }])} />
      <PageHero
        number="08"
        label="Our work"
        title={
          <>
            Ideas Built Into <span className="text-gradient-blue">Real Products.</span>
          </>
        }
        description="A selection of projects that show our approach to solving real-world problems through technology. Approved LAMHA Technologies projects and case studies will appear here."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
        actions={
          <Button href="/start-a-project" size="lg" icon="arrow">
            Start a Project
          </Button>
        }
        compact
      />

      <section aria-label="Portfolio" className="dark-section relative overflow-hidden bg-abyss text-white">
        <DarkBackdrop glow={false} />
        <div className="container-x section-y relative">
          <WorkGrid projects={publishedProjects} />
        </div>
      </section>

      <section aria-labelledby="structure-heading" className="bg-white">
        <div className="container-x section-y">
          <SectionHeading number="01" label="Case study structure" title={<span id="structure-heading">How every case study will be presented</span>} description="Only approved evidence is published. We never fabricate clients, metrics, outcomes or testimonials." />
          <ol className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {structure.map((s, i) => (
              <Reveal key={s} as="li" delay={i * 40}>
                <div className="rounded-lg border border-slate-200 bg-cloud p-5">
                  <span className="font-mono text-xs text-blue">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-3 text-sm font-semibold text-navy">{s}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CTASection headline="Want to be one of the first published case studies?" location="work" />
    </>
  );
}
