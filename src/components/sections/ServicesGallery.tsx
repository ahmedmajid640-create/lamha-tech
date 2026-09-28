"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { publishedServices, getFamily } from "@/data/services";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { HoverPreview } from "@/components/services/HoverPreview";

/**
 * Horizontal scroll gallery of all services (desktop). The section pins while the
 * track slides sideways in step with vertical scroll. Mobile gets the vertical grid.
 */
export function ServicesGallery() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progressW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative hidden bg-cloud lg:block" style={{ height: `${Math.max(150, 100 + distance / 16)}vh` }} aria-labelledby="gallery-heading">
      <div className="sticky top-0 flex h-screen flex-col justify-start overflow-hidden pt-[calc(var(--header-h)+2.5rem)]">
        <div className="container-x flex items-end justify-between pb-8">
          <div>
            <SectionLabel number="03">Our services</SectionLabel>
            <h2 id="gallery-heading" className="mt-4 text-h2 font-semibold text-navy">
              Technology services for real-world solutions.
            </h2>
          </div>
          <Button href="/services" variant="outline" size="sm" icon="arrow">
            All services
          </Button>
        </div>

        <HoverPreview>
        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 pl-[max(1.25rem,calc((100vw-1320px)/2+3rem))] pr-24 will-change-transform">
          {publishedServices.map((s) => {
            const family = getFamily(s.family);
            return (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                data-preview-kind={s.visual}
                data-preview-label={s.title}
                className="group relative flex h-[clamp(420px,56vh,540px)] w-[360px] shrink-0 flex-col justify-between border border-slate-300 bg-white p-8 transition-[transform,border-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-2 hover:border-navy"
              >
                <div className="relative flex items-start justify-between">
                  <span className="font-mono text-xs text-blue">{s.globalNumber}</span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-slate-500">{family.title}</span>
                </div>
                <span aria-hidden="true" className="font-display text-[7rem] font-semibold leading-none tracking-tighter text-slate-200 transition-colors group-hover:text-blue-100">{s.globalNumber}</span>
                <div className="relative">
                  <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-navy">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.tagline}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-navy">
                    Explore
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
          <Link href="/services" className="group flex h-[440px] w-[300px] shrink-0 flex-col items-center justify-center border border-dashed border-slate-400 text-center text-navy transition-colors hover:border-blue">
            <span className="text-lg font-semibold">All 13 services</span>
            <span className="mt-2 text-sm text-slate-500">Three families, one process</span>
            <ArrowUpRight className="mt-6 h-6 w-6 text-blue transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>
        </HoverPreview>
        <div className="container-x mt-auto flex items-center justify-between gap-6 pb-10 pt-8">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-slate-500">Scroll to explore · {publishedServices.length} services across 3 families</p>
          <div className="h-px w-56 bg-slate-200">
            <motion.div style={{ width: progressW }} className="h-px bg-blue" />
          </div>
        </div>
      </div>
    </section>
  );
}
