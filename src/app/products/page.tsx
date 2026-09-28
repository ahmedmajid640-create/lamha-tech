import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/ui/JsonLd";
import { Button } from "@/components/ui/Button";
import { ArchitectureVisual } from "@/components/visuals/ArchitectureVisual";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = buildMetadata({
  title: "Products & R&D — We Build for Ourselves, Too",
  description:
    "LAMHA Technologies develops internal systems, automation and technology to solve real operational problems. Selected technologies may later become reusable products.",
  path: "/products",
});

/**
 * Future-ready products route. Intentionally conceptual: no confidential internal
 * product names, screenshots or commercial claims are published here.
 */
const approach = [
  { number: "01", title: "Solve our own problems first", description: "Internal tooling starts from real operational friction inside LAMHA, which keeps the work grounded in genuine needs." },
  { number: "02", title: "Engineer to product standards", description: "Internal systems are built with the same architecture, testing and security discipline we apply to client work." },
  { number: "03", title: "Generalize only when proven", description: "A system becomes a candidate product only after it has demonstrated value in day-to-day operation." },
  { number: "04", title: "Publish when approved", description: "Product details, names and availability are shared publicly only once they are approved for release." },
];

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Products & R&D", path: "/products" }])} />
      <PageHero
        number="07"
        label="Products & R&D"
        title="We Build for Ourselves, Too."
        description="LAMHA develops internal systems, automation and technology to solve real operational problems. Selected technologies may later become reusable products."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Products & R&D" }]}
        actions={
          <>
            <Button href="/services" size="lg" icon="arrow">
              Explore services
            </Button>
            <Button href="/contact" variant="outline-light" size="lg">
              Contact us
            </Button>
          </>
        }
        accent="octahedron"
        visual={<ArchitectureVisual />}
      />

      <section aria-labelledby="approach-heading" className="bg-white">
        <div className="container-x section-y">
          <SectionHeading number="01" label="Our R&D approach" title={<span id="approach-heading">Two engines: services and proprietary technology</span>} description="LAMHA operates as a technology services company and as a builder of its own systems. The two reinforce each other." />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-2">
            {approach.map((a, i) => (
              <Reveal key={a.number} as="li" delay={i * 60}>
                <div className="h-full bg-white p-8">
                  <span className="font-mono text-xs text-blue">{a.number}</span>
                  <h3 className="mt-4 text-xl font-semibold text-navy">{a.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-slate-600">{a.description}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="status-heading" className="bg-cloud">
        <div className="container-x section-y">
          <div className="rounded-lg border border-slate-200 bg-white p-8 sm:p-10">
            <p className="label-caps text-blue">Publication status</p>
            <h2 id="status-heading" className="mt-3 text-h3 font-semibold text-navy">
              Approved product information will be published here.
            </h2>
            <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-slate-600">
              This page is prepared for the Products content model (name, description, status, screenshots, CTA and approved visibility). Until products are approved for public release, no product details are shown.
            </p>
          </div>
        </div>
      </section>

      <CTASection headline="Interested in how we approach product engineering?" description="Tell us about your product idea or operational problem. We apply the same discipline to client products that we apply to our own." location="products" />
    </>
  );
}
