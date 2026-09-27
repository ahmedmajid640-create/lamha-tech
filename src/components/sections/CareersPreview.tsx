import { careerValues, visibleJobs } from "@/data/jobs";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { DarkBackdrop } from "@/components/visuals/GridPattern";

export function CareersPreview({ number = "11" }: { number?: string }) {
  const count = visibleJobs.length;
  return (
    <section aria-labelledby="careers-heading" className="dark-section relative overflow-hidden bg-deep text-white">
      <DarkBackdrop />
      <div className="container-x section-y relative">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel number={number} tone="dark">
              Careers
            </SectionLabel>
            <h2 id="careers-heading" className="mt-6 text-h2 font-semibold text-white">
              Build What Comes Next With Us.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-300">
              Join a team building a global technology company around software, engineering and emerging technologies.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/careers" icon="arrow">
                View open positions
              </Button>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              {count > 0 ? "Listings shown on the careers page are marked where they are demonstration entries." : "Open positions will be published here."}
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {careerValues.map((v, i) => (
              <Reveal key={v.number} as="li" delay={i * 70}>
                <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.03] p-6">
                  <span className="font-mono text-xs text-blue-200">{v.number}</span>
                  <h3 className="mt-4 text-lg font-semibold text-white">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
