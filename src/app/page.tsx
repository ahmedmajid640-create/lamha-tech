import type { Metadata } from "next";
import { site } from "@/data/site";
import { buildMetadata } from "@/lib/seo";
import { HomeHero } from "@/components/sections/HomeHero";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { WhyLamhaSection } from "@/components/sections/WhyLamhaSection";
import { TechnologyGrid } from "@/components/sections/TechnologyGrid";
import { ProductsRD } from "@/components/sections/ProductsRD";
import { WorkPreview } from "@/components/sections/WorkPreview";
import { FounderBlock } from "@/components/sections/FounderBlock";
import { LeadershipGrid } from "@/components/sections/LeadershipGrid";
import { CareersPreview } from "@/components/sections/CareersPreview";
import { CTASection } from "@/components/sections/CTASection";
import { DarkBackdrop } from "@/components/visuals/GridPattern";

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      {/* 01 Hero */}
      <HomeHero />

      {/* 02 What we do */}
      <WhatWeDo />

      {/* 03 Services */}
      <section aria-labelledby="services-heading" className="bg-cloud">
        <div className="container-x section-y">
          <SectionHeading
            number="03"
            label="Our services"
            title={<span id="services-heading">Technology services for real-world solutions.</span>}
            description="Strategy, design, engineering, testing, optimization and support across three service families."
          >
            <Button href="/services" variant="outline" size="sm" icon="arrow">
              View all services
            </Button>
          </SectionHeading>
          <div className="mt-16">
            <ServiceGrid />
          </div>
        </div>
      </section>

      {/* 04 How we work */}
      <section aria-labelledby="process-heading" className="bg-white">
        <div className="container-x section-y">
          <SectionHeading
            number="04"
            label="How we work"
            title={<span id="process-heading">A disciplined path from problem to progress.</span>}
            description="The same six stages, whether we are shipping an MVP or modernizing a critical platform."
          />
          <div className="mt-14">
            <ProcessTimeline />
          </div>
        </div>
      </section>

      {/* 05 Why LAMHA */}
      <WhyLamhaSection number="05" />

      {/* 06 Technology */}
      <section aria-labelledby="technology-heading" className="dark-section relative overflow-hidden bg-navy text-white">
        <DarkBackdrop glow={false} />
        <div className="container-x section-y relative">
          <SectionHeading
            number="06"
            label="Technology"
            title={<span id="technology-heading">We choose technology for the problem, not the trend.</span>}
            description="Category-level capabilities across the stack. Specific technologies are agreed per engagement and published as our approved stack is finalized."
            tone="dark"
          >
            <Button href="/technology" variant="outline-light" size="sm" icon="arrow">
              Our approach
            </Button>
          </SectionHeading>
          <div className="mt-14">
            <TechnologyGrid tone="dark" />
          </div>
        </div>
      </section>

      {/* 07 Products & R&D */}
      <ProductsRD number="07" />

      {/* 08 Work */}
      <WorkPreview number="08" />

      {/* 09 About / Founder */}
      <FounderBlock number="09" />

      {/* 10 Leadership */}
      <LeadershipGrid number="10" />

      {/* 11 Careers */}
      <CareersPreview number="11" />

      {/* 12 Final CTA */}
      <CTASection location="home_final" />
    </>
  );
}
