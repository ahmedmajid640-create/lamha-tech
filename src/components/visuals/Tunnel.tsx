"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Perspective tunnel illusion: concentric square frames recede into the page and
 * advance toward the viewer as the wrapping section scrolls. Pure CSS transforms.
 */
export function Tunnel({ className, tone = "light", frames = 9 }: { className?: string; tone?: "light" | "dark"; frames?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const z = useTransform(scrollYProgress, [0, 1], [-400, 400]);
  const rot = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const stroke = tone === "dark" ? "rgba(127,176,255,0.22)" : "rgba(11,27,58,0.12)";
  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div style={{ z, rotateZ: rot, transformStyle: "preserve-3d" }} className="absolute left-1/2 top-1/2 h-0 w-0 [perspective:900px]">
        {Array.from({ length: frames }).map((_, i) => {
          const size = 220 + i * 150;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border"
              style={{ width: size, height: size * 0.62, borderColor: stroke, transform: `translate(-50%, -50%) translateZ(${-i * 140}px)`, opacity: 1 - i / (frames + 1) }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
