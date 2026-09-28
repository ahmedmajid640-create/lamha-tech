import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { solutions } from "@/data/solutions";
import { PageHero } from "@/components/sections/PageHero";
import { SolutionCard } from "@/components/solutions/SolutionCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/sections/CTASection";
import { WhyLamhaSection } from "@/components/sections/WhyLamhaSection";

export const metadata: Metadata = buildMetadata({
  title: "Solutions for Startups, SMEs and Enterprise",
  description:
    "How LAMHA Technologies helps startups, SMEs and enterprises solve real problems with software, engineering and digital products, plus custom solutions.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }])} />
      <PageHero
        number="02"
        label="Solutions"
        title={
          <>
            Built around the way <span className="text-gradient-blue">your organization</span> works.
          </>
        }
        description="The same engineering discipline, shaped to the realities of startups, growing SMEs, enterprise teams and problems that do not fit a template."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Solutions" }]}
        actions={
          <Button href="/start-a-project" size="lg" icon="arrow">
            Start a Project
          </Button>
        }
      />
      <section className="bg-white">
        <div className="container-x section-y">
          <SectionHeading number="01" label="Choose your context" title="Who we work with" />
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {solutions.map((s, i) => (
              <Reveal key={s.slug} as="li" delay={i * 70}>
                <SolutionCard solution={s} className="h-full" />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <WhyLamhaSection number="02" />
      <CTASection location="solutions_index" />
    </>
  );
}
