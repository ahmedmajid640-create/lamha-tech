"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Tunnel } from "@/components/visuals/Tunnel";
import { cn } from "@/lib/utils";

/**
 * Statement: as the section scrolls through the viewport, each word fills from dim to bright (no pinning, no dead space).
 * Reusable on any page (home tagline, solution intro, about vision, technology philosophy).
 */
const DEFAULT_TEXT =
  "We are a technology company obsessed with one thing: turning real-world problems into software, systems and results that a business can actually run on.";

function Word({ word, index, total, progress, dark }: { word: string; index: number; total: number; progress: MotionValue<number>; dark: boolean }) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [dark ? 0.22 : 0.18, 1]);
  const y = useTransform(progress, [start, end], [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className="word-hover-soft inline-block transition-[color,filter] duration-300 will-change-[opacity,transform]">
      {word}&nbsp;
    </motion.span>
  );
}

export function Statement({
  text = DEFAULT_TEXT,
  number = "02",
  label = "What drives us",
  aside,
  tone = "light",
  size = "lg",
  className,
}: {
  text?: string;
  number?: string;
  label?: string;
  aside?: { title: string; body: string };
  tone?: "light" | "dark";
  size?: "lg" | "md";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.6"] });
  const words = text.split(" ");
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const dark = tone === "dark";

  return (
    <section ref={ref} className={cn("relative", dark ? "dark-section bg-abyss text-white" : "bg-white", className)} aria-label={label}>
      <div className={cn("relative overflow-hidden", size === "lg" ? "py-20 md:py-24 lg:py-28" : "py-16 md:py-20")}>
        <div className="relative">
          <Tunnel tone={tone} />
          <div className="container-x relative">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <SectionLabel number={number} tone={tone}>
                  {label}
                </SectionLabel>
                <div className={cn("mt-6 h-px w-full origin-left", dark ? "bg-white/15" : "bg-slate-200")}>
                  <motion.div style={{ scaleX: lineScale }} className="h-px w-full origin-left bg-blue-2" />
                </div>
                {aside && (
                  <dl className={cn("mt-8 space-y-4 text-sm", dark ? "text-slate-400" : "text-slate-500")}>
                    <div>
                      <dt className="label-caps">{aside.title}</dt>
                      <dd className={cn("mt-1", dark ? "text-slate-200" : "text-navy")}>{aside.body}</dd>
                    </div>
                  </dl>
                )}
              </div>
              <p className={cn("text-balance font-semibold leading-[1.15] tracking-tight lg:col-span-9", size === "lg" ? "text-[clamp(1.75rem,3.6vw,3.25rem)]" : "text-[clamp(1.5rem,2.8vw,2.5rem)]", dark ? "text-white" : "text-navy")}>
                {words.map((w, i) => (
                  <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} dark={dark} />
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
