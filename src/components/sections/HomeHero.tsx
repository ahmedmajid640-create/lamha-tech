import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { capabilityStrip } from "@/data/whyLamha";
import { publishedServices } from "@/data/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { TrackedCTA } from "@/components/analytics/TrackedLink";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { DarkBackdrop } from "@/components/visuals/GridPattern";
import { Magnetic, Marquee, Rise, TextReveal } from "@/components/motion/Motion";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

export function HomeHero() {
  return (
    <section className="dark-section relative overflow-hidden bg-abyss text-white" aria-labelledby="hero-heading">
      <DarkBackdrop />
      <div className="container-x relative pt-[calc(var(--header-h)+3rem)] sm:pt-[calc(var(--header-h)+4.5rem)]">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="relative z-10 lg:col-span-8">
            <Rise y={12}>
              <SectionLabel number="01" tone="dark">
                LAMHA Technologies
              </SectionLabel>
            </Rise>
            <h1 id="hero-heading" className="mt-7 max-w-[13ch] text-display font-semibold tracking-tight text-white lg:max-w-none">
              <TextReveal lines={["Technology That Turns", "Problems Into", <span key="p" className="text-gradient-blue">Progress.</span>]} delay={0.1} />
            </h1>
            <Rise delay={0.5}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">
                We design, build, test and evolve software, digital products and technology solutions for businesses worldwide.
              </p>
            </Rise>
            <Rise delay={0.65}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <TrackedCTA href={site.cta.primary.href} event={ANALYTICS_EVENTS.START_PROJECT_CLICK} eventProps={{ location: "hero" }} size="lg" icon="arrow">
                    {site.cta.primary.label}
                  </TrackedCTA>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <Button href={site.cta.secondary.href} variant="outline-light" size="lg">
                    {site.cta.secondary.label}
                  </Button>
                </Magnetic>
              </div>
            </Rise>
            <Rise delay={0.8}>
              <p className="mt-8 text-sm font-medium tracking-wide text-slate-400">{site.supportingLine}</p>
            </Rise>
          </div>

          <div className="relative lg:col-span-4">
            <div aria-hidden="true" className="absolute inset-0 rounded-full bg-blue/20 blur-[110px]" />
            <div className="relative mx-auto -my-6 max-w-md lg:-my-16 lg:max-w-none lg:scale-[1.2]">
              <HeroCanvas />
            </div>
          </div>
        </div>

        {/* Services at a glance — Wezero-style scannability */}
        <Rise delay={0.9} className="mt-10 sm:mt-14">
          <Marquee duration={60} className="border-y border-white/10 py-4">
            {publishedServices.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="group inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-slate-300 transition-colors hover:text-white">
                <span className="font-mono text-[0.65rem] text-blue-200">{s.globalNumber}</span>
                {s.navLabel}
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-200" aria-hidden="true" />
              </Link>
            ))}
          </Marquee>
        </Rise>

        {/* Numbered capability strip */}
        <ol className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-t-lg border border-b-0 border-white/10 bg-white/10 md:grid-cols-5">
          {capabilityStrip.map((c, i) => (
            <Rise key={c.number} as="li" delay={0.2 + i * 0.08} className="bg-abyss/90 px-5 py-5 last:col-span-2 md:last:col-span-1">
              <span className="font-mono text-xs text-blue-200">{c.number}</span>
              <p className="mt-2 text-sm font-semibold text-white sm:text-base">{c.title}</p>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}
