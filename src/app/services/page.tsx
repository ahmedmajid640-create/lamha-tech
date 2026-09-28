import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { serviceFamilies } from "@/data/services";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceGrid } from "@/components/services/ServiceGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/ui/JsonLd";
import { Button } from "@/components/ui/Button";
import { KineticMarquee } from "@/components/motion/KineticMarquee";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "LAMHA Technologies services: software, web and mobile development, QA, security, UI/UX, brand identity, motion, digital strategy, SEO and analytics.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />
      <PageHero
        number="03"
        label="Our services"
        title={
          <>
            Technology services for <span className="text-gradient-blue">real-world solutions.</span>
          </>
        }
        description="Strategy, design, engineering, testing, optimization and support, organized into three service families so you can find the capability you need quickly."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        actions={
          <>
            <Button href="/start-a-project" size="lg" icon="arrow">
              Start a Project
            </Button>
            <Button href="/solutions" variant="outline-light" size="lg">
              Solutions by organization
            </Button>
          </>
        }
      />

      {/* Family index */}
      <section aria-label="Service families" className="border-b border-slate-200 bg-white">
        <div className="container-x">
          <ol className="grid divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
            {serviceFamilies.map((f) => (
              <li key={f.id} className="py-6 md:px-8 md:first:pl-0 md:last:pr-0">
                <a href={`#family-${f.id}`} className="group block rounded-sm">
                  <span className="font-mono text-xs text-blue">{f.number}</span>
                  <p className="mt-2 text-lg font-semibold text-navy group-hover:text-blue">{f.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{f.tagline}</p>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="dark-section bg-abyss text-white">
        <KineticMarquee words={["Software", "Web", "Mobile", "Full-Stack", "QA", "Security", "Design", "Brand", "Motion", "Strategy", "SEO", "Analytics", "Scale"]} />
      </div>

      <section className="bg-cloud">
        <div className="container-x section-y">
          <ServiceGrid />
        </div>
      </section>

      <section aria-labelledby="services-process-heading" className="bg-white">
        <div className="container-x section-y">
          <SectionHeading number="04" label="How we work" title={<span id="services-process-heading">One process across every service.</span>} description="Every engagement follows the same six stages, adapted to the service and the scale of the work." />
          <div className="mt-14">
            <ProcessTimeline />
          </div>
        </div>
      </section>

      <CTASection location="services_index" />
    </>
  );
}
