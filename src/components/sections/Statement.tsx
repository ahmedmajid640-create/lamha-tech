"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Pinned statement: as the visitor scrolls, each word fills from dim to bright.
 * (Wezero-style tagline / motto block, LAMHA copy.)
 */
const STATEMENT =
  "We are a technology company obsessed with one thing: turning real-world problems into software, systems and results that a business can actually run on.";

function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.18, 1]);
  const y = useTransform(progress, [start, end], [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block will-change-[opacity,transform]">
      {word}&nbsp;
    </motion.span>
  );
}

export function Statement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.6"] });
  const words = STATEMENT.split(" ");
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="relative bg-white" aria-label="What drives LAMHA">
      <div className="h-[170vh] md:h-[200vh]">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="container-x">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <SectionLabel number="02">What drives us</SectionLabel>
                <div className="mt-6 h-px w-full origin-left bg-slate-200">
                  <motion.div style={{ scaleX: lineScale }} className="h-px w-full origin-left bg-blue" />
                </div>
                <dl className="mt-8 space-y-4 text-sm text-slate-500">
                  <div>
                    <dt className="label-caps">Mission</dt>
                    <dd className="mt-1 text-navy">To solve meaningful problems through technology, engineering and continuous innovation.</dd>
                  </div>
                </dl>
              </div>
              <p className="text-balance text-[clamp(1.75rem,3.6vw,3.25rem)] font-semibold leading-[1.15] tracking-tight text-navy lg:col-span-9">
                {words.map((w, i) => (
                  <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
