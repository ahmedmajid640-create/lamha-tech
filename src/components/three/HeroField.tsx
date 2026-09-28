"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useMediaQuery, useMounted, usePrefersReducedMotion, useWebGLSupport } from "@/components/motion/useReducedMotion";
import type { ProgressRef } from "./ScrollField";
import { cn } from "@/lib/utils";

const ScrollField = dynamic(() => import("./ScrollField"), { ssr: false });

export type HeroFieldBase = "sphere" | "ring" | "wave";

/**
 * Particle field for inner-page heroes. It forms the chosen base formation on entry and
 * blows apart as the visitor scrolls the hero out of view (the site's signature transition).
 * Field progress: 0 = sphere, ~0.34 = burst, ~0.66 = wave, ~0.98 = ring.
 */
const MAP: Record<HeroFieldBase, (v: number) => number> = {
  sphere: (v) => v * 0.34,
  wave: (v) => 0.62 - v * 0.42,
  ring: (v) => 1 - v * 0.78,
};

export function HeroField({ base = "sphere", className }: { base?: HeroFieldBase; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef<number>(MAP[base](0)) as ProgressRef;
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const mobile = useMediaQuery("(max-width: 768px)");
  const [active, setActive] = useState(true);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = MAP[base](Math.min(1, Math.max(0, v)));
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!mounted || !webgl) return null;

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-y-0 left-0 right-0 lg:left-[18%]">
        <ScrollField progress={progress} active={active} reduced={reduced} mobile={mobile} />
      </div>
    </div>
  );
}
