import { whyLamha } from "@/data/whyLamha";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function WhyLamhaSection({ number = "05" }: { number?: string }) {
  return (
    <section aria-labelledby="why-heading" className="bg-cloud">
      <div className="container-x section-y">
        <SectionHeading
          number={number}
          label="Why LAMHA"
          title={<span id="why-heading">Engineering that starts with the business.</span>}
          description="Six principles that shape how we scope, build and support technology."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {whyLamha.map((p, i) => (
            <Reveal key={p.number} as="li" delay={i * 50}>
              <div className="group flex h-full flex-col bg-white p-7 transition-colors hover:bg-cloud">
                <span className="font-mono text-xs text-blue">{p.number}</span>
                <h3 className="mt-5 text-lg font-semibold text-navy">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
