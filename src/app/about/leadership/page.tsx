import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { founder, publishedLeadership } from "@/data/leadership";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { Button } from "@/components/ui/Button";
import { LeadershipCard, Portrait } from "@/components/leadership/LeadershipCard";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = buildMetadata({
  title: "Leadership",
  description:
    "Meet the leadership of LAMHA Technologies (Pvt.) Ltd.: Syeda Laiba Haider (Founder), Ahmed Majid (Co-Founder), Maira Almas (CEO) and Syed Hamad Haider (Board of Directors).",
  path: "/about/leadership",
});

export default function LeadershipPage() {
  const others = publishedLeadership.filter((l) => l.slug !== founder.slug);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }, { name: "Leadership", path: "/about/leadership" }])} />
      <PageHero
        number="10"
        label="Leadership"
        title="The people accountable for the work."
        description="LAMHA's leadership combines founding vision, executive management and board oversight. Approved biographies and portraits will be published as they become available."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Leadership" }]}
        actions={
          <Button href="/about" variant="outline-light" size="lg">
            About LAMHA
          </Button>
        }
        compact
      />

      <section aria-labelledby="founder-heading" className="bg-white">
        <div className="container-x section-y">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <Portrait leader={founder} size="lg" className="max-w-sm" />
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <SectionLabel number="01">Founder</SectionLabel>
              <h2 id="founder-heading" className="mt-4 text-h2 font-semibold text-navy">
                {founder.name}
              </h2>
              <p className="mt-2 text-lg font-medium text-blue">{founder.role}</p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">{founder.bio ?? "Leadership biography coming soon."}</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="team-heading" className="bg-cloud">
        <div className="container-x section-y">
          <SectionHeading number="02" label="Leadership team" title={<span id="team-heading">Executive and board</span>} />
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((l, i) => (
              <Reveal key={l.slug} as="li" delay={i * 70}>
                <LeadershipCard leader={l} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CTASection location="leadership" />
    </>
  );
}
