"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { capabilityStrip } from "@/data/whyLamha";
import { publishedServices } from "@/data/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { TrackedCTA } from "@/components/analytics/TrackedLink";
import { NetworkVisual } from "@/components/visuals/NetworkVisual";
import { Magnetic, Marquee, TextReveal } from "@/components/motion/Motion";
import { useMediaQuery, useMounted, usePrefersReducedMotion, useWebGLSupport } from "@/components/motion/useReducedMotion";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import type { ProgressRef } from "@/components/three/ScrollField";

const ScrollField = dynamic(() => import("@/components/three/ScrollField"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Pinned, scroll-driven hero. The section is tall; the viewport-sized stage sticks while the
 * particle field morphs (sphere → burst → wave → ring) and three statements hand over.
 */
export function ImmersiveHero() {
  const wrap = useRef<HTMLElement>(null);
  const progress = useRef<number>(0) as ProgressRef;
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const mobile = useMediaQuery("(max-width: 768px)");
  const [active, setActive] = useState(true);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
  });

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Statement hand-over (opacity + drift per phase). Explicit ramps: fully 0 outside each window.
  const ramp = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));
  // Phase 1 blows apart with the sphere: fades, scales up and blurs during the burst window.
  const o1 = useTransform(scrollYProgress, (v) => 1 - ramp(v, 0.05, 0.16));
  const y1 = useTransform(scrollYProgress, (v) => -60 * ramp(v, 0, 0.2));
  const s1 = useTransform(scrollYProgress, (v) => 1 + 0.22 * ramp(v, 0.04, 0.2));
  const blur1 = useTransform(scrollYProgress, (v) => `blur(${(14 * ramp(v, 0.05, 0.18)).toFixed(1)}px)`);
  // Screen flash at ignition
  const flash = useTransform(scrollYProgress, (v) => {
    const t = Math.min(1, Math.max(0, (v - 0.04) / 0.11));
    return Math.sin(t * Math.PI) * 0.55;
  });
  const o2 = useTransform(scrollYProgress, (v) => ramp(v, 0.32, 0.42) * (1 - ramp(v, 0.56, 0.64)));
  const y2 = useTransform(scrollYProgress, (v) => 60 - 120 * ramp(v, 0.32, 0.64));
  const o3 = useTransform(scrollYProgress, (v) => ramp(v, 0.66, 0.76));
  const y3 = useTransform(scrollYProgress, (v) => 60 - 60 * ramp(v, 0.66, 0.8));
  const hint = useTransform(scrollYProgress, (v) => 1 - ramp(v, 0, 0.06));
  const phaseIndex = useTransform(scrollYProgress, (v) => (v < 0.32 ? 0 : v < 0.66 ? 1 : 2));
  const [phase, setPhase] = useState(0);
  useMotionValueEvent(phaseIndex, "change", (v) => setPhase(v));

  return (
    <>
      <section ref={wrap} data-hero className="dark-section relative h-[300vh] bg-abyss text-white md:h-[340vh]" aria-labelledby="hero-heading">
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Field */}
          <div className="absolute inset-0">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,124,246,0.18),transparent_60%)]" />
            <div aria-hidden="true" className="absolute inset-0 grid-texture opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            {mounted && webgl ? (
              <ScrollField progress={progress} active={active} reduced={reduced} mobile={mobile} />
            ) : (
              <NetworkVisual className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 opacity-70" />
            )}
            {/* Ignition flash */}
            <motion.div aria-hidden="true" style={{ opacity: flash }} className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.95),rgba(127,176,255,0.55)_25%,rgba(46,124,246,0.15)_50%,transparent_70%)] mix-blend-screen" />
          </div>

          {/* Stage content */}
          <div className="container-x relative flex h-full flex-col justify-end pb-16 pt-[var(--header-h)] sm:justify-center sm:pb-0">
            {/* Phase 01 */}
            <motion.div style={{ opacity: o1, y: y1, scale: s1, filter: blur1, transformOrigin: "left center" }} className={phase === 0 ? "max-w-4xl" : "pointer-events-none max-w-4xl"} aria-hidden={phase !== 0}>
              <SectionLabel number="01" tone="dark">
                LAMHA Technologies · Remote-first · Worldwide
              </SectionLabel>
              <h1 id="hero-heading" className="mt-6 text-display font-semibold tracking-tight text-white">
                <TextReveal lines={["Technology That Turns", "Problems Into", <span key="p" className="text-gradient-blue">Progress.</span>]} delay={0.1} />
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">
                We design, build, test and evolve software, digital products and technology solutions for businesses worldwide.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
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
            </motion.div>

            {/* Phase 02 */}
            <motion.div style={{ opacity: o2, y: y2 }} className="pointer-events-none absolute inset-x-5 top-1/2 -translate-y-1/2 sm:inset-x-8 lg:inset-x-12" aria-hidden={phase !== 1}>
              <div className="mx-auto max-w-5xl text-center">
                <p className="label-caps text-blue-200">02 · From Ideas to Systems</p>
                <p className="mt-6 text-h1 font-semibold text-white">
                  Requirements, constraints and messy real-world problems, turned into <span className="text-gradient-blue">architecture, code and working systems.</span>
                </p>
              </div>
            </motion.div>

            {/* Phase 03 */}
            <motion.div style={{ opacity: o3, y: y3 }} className="absolute inset-x-5 top-1/2 -translate-y-1/2 sm:inset-x-8 lg:inset-x-12" aria-hidden={phase !== 2}>
              <div className={phase === 2 ? "mx-auto max-w-5xl text-center" : "pointer-events-none mx-auto max-w-5xl text-center"}>
                <p className="label-caps text-blue-200">03 · From Systems to Impact</p>
                <p className="mt-6 text-h1 font-semibold text-white">
                  Software, engineering and digital products that keep improving <span className="text-gradient-blue">long after launch.</span>
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <Magnetic>
                    <TrackedCTA href={site.cta.primary.href} event={ANALYTICS_EVENTS.START_PROJECT_CLICK} eventProps={{ location: "hero_phase3" }} size="lg" icon="arrow">
                      {site.cta.primary.label}
                    </TrackedCTA>
                  </Magnetic>
                  <Button href="/work" variant="outline-light" size="lg">
                    See our work
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Scroll hint */}
            <motion.div style={{ opacity: hint }} className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400 sm:flex">
              <motion.span animate={reduced ? undefined : { y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </motion.span>
              Scroll to explore
            </motion.div>

            {/* Phase indicator */}
            <ol className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-4 sm:right-8 lg:right-12 lg:flex" aria-hidden="true">
              {["Progress", "Systems", "Impact"].map((label, i) => (
                <li key={label} className="flex items-center justify-end gap-3 text-[0.65rem] uppercase tracking-[0.2em]">
                  <span className={phase === i ? "text-white" : "text-slate-600"}>{label}</span>
                  <span className={`h-px transition-all duration-500 ${phase === i ? "w-10 bg-blue-2" : "w-5 bg-white/20"}`} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Services at a glance + capability strip (normal flow) */}
      <div className="dark-section relative bg-abyss text-white">
        <div className="container-x">
          <Marquee duration={60} className="border-y border-white/10 py-4">
            {publishedServices.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="group inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-slate-300 transition-colors hover:text-white">
                <span className="font-mono text-[0.65rem] text-blue-200">{s.globalNumber}</span>
                {s.navLabel}
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-200" aria-hidden="true" />
              </Link>
            ))}
          </Marquee>
          <ol className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-t-lg border border-b-0 border-white/10 bg-white/10 md:grid-cols-5">
            {capabilityStrip.map((c, i) => (
              <motion.li
                key={c.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
                className="bg-abyss/90 px-5 py-5 last:col-span-2 md:last:col-span-1"
              >
                <span className="font-mono text-xs text-blue-200">{c.number}</span>
                <p className="mt-2 text-sm font-semibold text-white sm:text-base">{c.title}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
