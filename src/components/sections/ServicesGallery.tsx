"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { publishedServices, getFamily } from "@/data/services";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

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
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-x flex items-end justify-between pb-8">
          <div>
            <SectionLabel number="03">Our services</SectionLabel>
            <h2 id="gallery-heading" className="mt-4 text-h2 font-semibold text-navy">
              Technology services for real-world solutions.
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-px w-40 bg-slate-200">
              <motion.div style={{ width: progressW }} className="h-px bg-blue" />
            </div>
            <Button href="/services" variant="outline" size="sm" icon="arrow">
              All services
            </Button>
          </div>
        </div>

        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 pl-[max(1.25rem,calc((100vw-1320px)/2+3rem))] pr-24 will-change-transform">
          {publishedServices.map((s) => {
            const family = getFamily(s.family);
            return (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group relative flex h-[440px] w-[360px] shrink-0 flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-8 transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-2 hover:border-blue-200 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div aria-hidden="true" className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />
                <div className="relative flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md border border-slate-200 bg-cloud text-blue transition-colors group-hover:border-blue group-hover:bg-blue group-hover:text-white">
                    <Icon name={s.icon} className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-6xl font-semibold leading-none tracking-tighter text-slate-100 transition-colors group-hover:text-blue-100">{s.globalNumber}</span>
                </div>
                <div className="relative">
                  <p className="label-caps text-slate-500">{family.title}</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight text-navy">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.tagline}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue">
                    Explore
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
          <Link href="/services" className="group flex h-[440px] w-[300px] shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 text-center text-navy transition-colors hover:border-blue">
            <span className="text-lg font-semibold">All 13 services</span>
            <span className="mt-2 text-sm text-slate-500">Three families, one process</span>
            <ArrowUpRight className="mt-6 h-6 w-6 text-blue transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
