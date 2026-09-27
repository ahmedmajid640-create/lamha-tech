import { site } from "@/data/site";
import { capabilityStrip } from "@/data/whyLamha";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { TrackedCTA } from "@/components/analytics/TrackedLink";
import { NetworkVisual } from "@/components/visuals/NetworkVisual";
import { DarkBackdrop } from "@/components/visuals/GridPattern";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

export function HomeHero() {
  return (
    <section className="dark-section relative overflow-hidden bg-abyss text-white" aria-labelledby="hero-heading">
      <DarkBackdrop />
      <div className="container-x relative pt-[calc(var(--header-h)+3.5rem)] sm:pt-[calc(var(--header-h)+5rem)]">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <SectionLabel number="01" tone="dark">
              LAMHA Technologies
            </SectionLabel>
            <h1 id="hero-heading" className="mt-7 max-w-[13ch] text-display font-semibold tracking-tight text-white lg:max-w-none">
              Technology That Turns
              <br className="hidden lg:block" /> Problems Into
              <br className="hidden lg:block" /> <span className="text-gradient-blue">Progress.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              We design, build, test and evolve software, digital products and technology solutions for businesses worldwide.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <TrackedCTA href={site.cta.primary.href} event={ANALYTICS_EVENTS.START_PROJECT_CLICK} eventProps={{ location: "hero" }} size="lg" icon="arrow">
                {site.cta.primary.label}
              </TrackedCTA>
              <Button href={site.cta.secondary.href} variant="outline-light" size="lg">
                {site.cta.secondary.label}
              </Button>
            </div>
            <p className="mt-8 text-sm font-medium tracking-wide text-slate-400">{site.supportingLine}</p>
          </div>
          <div className="relative lg:col-span-4">
            <div aria-hidden="true" className="absolute inset-0 -z-0 rounded-full bg-blue/20 blur-[100px]" />
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <NetworkVisual />
            </div>
          </div>
        </div>

        {/* Numbered capability strip */}
        <ol className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-t-lg border border-b-0 border-white/10 bg-white/10 sm:mt-24 md:grid-cols-5">
          {capabilityStrip.map((c) => (
            <li key={c.number} className="bg-abyss/90 px-5 py-5 last:col-span-2 md:last:col-span-1">
              <span className="font-mono text-xs text-blue-200">{c.number}</span>
              <p className="mt-2 text-sm font-semibold text-white sm:text-base">{c.title}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
