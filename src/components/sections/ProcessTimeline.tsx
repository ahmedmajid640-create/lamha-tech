"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { processSteps } from "@/data/process";
import { cn } from "@/lib/utils";

/**
 * Six-step process. Horizontal on desktop, vertical on mobile. The connecting line draws
 * and each step lights up in sequence as the visitor scrolls through the section.
 */
function Step({ i, total, step, note, progress, dark }: { i: number; total: number; step: (typeof processSteps)[number]; note?: string; progress: MotionValue<number>; dark: boolean }) {
  const start = i / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.3, 1]);
  const y = useTransform(progress, [start, end], [18, 0]);
  const ring = useTransform(progress, [start, start + 0.5 / total], [0, 1]);
  const bg = useTransform(ring, (v) => (v > 0.5 ? (dark ? "#2e7cf6" : "#1769e0") : dark ? "#071129" : "#ffffff"));
  const color = useTransform(ring, (v) => (v > 0.5 ? "#ffffff" : dark ? "#bcd6ff" : "#1769e0"));
  return (
    <motion.li style={{ opacity, y }} className="relative flex gap-4 xl:block">
      <div className="flex flex-col items-center xl:block">
        <motion.span
          style={{ backgroundColor: bg, color }}
          className={cn("relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold transition-colors", dark ? "border-blue-2/60" : "border-blue-200")}
        >
          {step.number}
        </motion.span>
        {i < total - 1 && <span aria-hidden="true" className={cn("mt-2 w-px flex-1 xl:hidden", dark ? "bg-white/10" : "bg-slate-200")} />}
      </div>
      <div className="pb-2 xl:mt-6">
        <h3 className={cn("text-lg font-semibold", dark ? "text-white" : "text-navy")}>{step.title}</h3>
        <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-slate-400" : "text-slate-600")}>{note ?? step.description}</p>
      </div>
    </motion.li>
  );
}

export function ProcessTimeline({ notes, tone = "light" }: { notes?: string[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <ol ref={ref} className="relative grid gap-8 md:grid-cols-3 xl:grid-cols-6 xl:gap-6">
      <span aria-hidden="true" className={cn("absolute left-0 right-0 top-5 hidden h-px xl:block", dark ? "bg-white/10" : "bg-slate-200")} />
      <motion.span aria-hidden="true" style={{ scaleX }} className="absolute left-0 right-0 top-5 hidden h-px origin-left bg-blue xl:block" />
      {processSteps.map((step, i) => (
        <Step key={step.number} i={i} total={processSteps.length} step={step} note={notes?.[i]} progress={scrollYProgress} dark={dark} />
      ))}
    </ol>
  );
}
