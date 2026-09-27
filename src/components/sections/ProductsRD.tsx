import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ArchitectureVisual } from "@/components/visuals/ArchitectureVisual";
import { DarkBackdrop } from "@/components/visuals/GridPattern";

const points = [
  { title: "Internal systems", description: "Operational tooling built to remove friction from how LAMHA itself runs." },
  { title: "Automation", description: "Workflows and integrations that replace repetitive manual work with reliable processes." },
  { title: "Reusable technology", description: "Selected internal technologies may later become reusable products, published only when approved." },
];

export function ProductsRD({ number = "07" }: { number?: string }) {
  return (
    <section aria-labelledby="products-heading" className="dark-section relative overflow-hidden bg-navy text-white">
      <DarkBackdrop />
      <div className="container-x section-y relative">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel number={number} tone="dark">
              Products &amp; R&amp;D
            </SectionLabel>
            <h2 id="products-heading" className="mt-6 text-h2 font-semibold text-white">
              We Build for Ourselves, Too.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              LAMHA develops internal systems, automation and technology to solve real operational problems. Selected technologies may later become reusable products.
            </p>
            <ul className="mt-10 space-y-6">
              {points.map((p, i) => (
                <Reveal key={p.title} as="li" delay={i * 80} className="flex gap-5">
                  <span className="mt-1 font-mono text-xs text-blue-200">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-semibold text-white">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{p.description}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
            <div className="mt-10">
              <Button href="/products" variant="outline-light" icon="arrow">
                About our R&amp;D approach
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <Reveal delay={120}>
              <ArchitectureVisual />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
