"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/** Giant outlined section numeral that drifts with scroll behind the content. Decorative. */
export function GhostNumber({ value, tone = "light", className, side = "right" }: { value: string; tone?: "light" | "dark"; className?: string; side?: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-y-0 hidden w-1/2 overflow-hidden lg:block", side === "right" ? "right-0" : "left-0", className)}>
      <motion.span
        style={{ y, rotate }}
        className={cn(
          "absolute top-8 select-none font-mono text-[clamp(10rem,24vw,22rem)] font-semibold leading-none tracking-tighter text-transparent",
          side === "right" ? "right-[-2vw]" : "left-[-2vw]",
          tone === "dark" ? "[-webkit-text-stroke:1px_rgba(127,176,255,0.18)]" : "[-webkit-text-stroke:1px_rgba(11,27,58,0.1)]",
        )}
      >
        {value}
      </motion.span>
    </div>
  );
}
