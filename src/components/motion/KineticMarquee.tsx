"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Oversized outlined text that slides continuously and skews/speeds up with scroll velocity.
 */
export function KineticMarquee({ words, className, dark = true }: { words: string[]; className?: string; dark?: boolean }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smoothVelocity, [-2000, 0, 2000], [-4, 1, 4], { clamp: true });
  const skew = useTransform(smoothVelocity, [-2000, 0, 2000], [8, 0, -8], { clamp: true });
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    let next = baseX.get() + dir.current * Math.abs(f) * (delta / 1000) * 3;
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    baseX.set(next);
  });

  const x = useTransform(baseX, (v) => `${v}%`);
  const text = words.join("  ·  ") + "  ·  ";

  return (
    <div aria-hidden="true" className={cn("overflow-hidden py-6", className)}>
      <motion.div style={{ x, skewX: skew }} className="flex w-max whitespace-nowrap">
        {[0, 1].map((i) => (
          <span
            key={i}
            className={cn(
              "text-[clamp(3.5rem,9vw,8.5rem)] font-bold uppercase leading-none tracking-tight",
              dark ? "text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]" : "text-transparent [-webkit-text-stroke:1px_rgba(11,27,58,0.35)]",
            )}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
