"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/** Hero content drifts down and fades as the page starts to scroll (depth against the particle field). */
export function HeroParallax({ children, className, distance = 140 }: { children: React.ReactNode; className?: string; distance?: number }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, distance]);
  const opacity = useTransform(scrollY, [0, 520], [1, 0]);
  return (
    <motion.div style={{ y, opacity }} className={cn("will-change-transform", className)}>
      {children}
    </motion.div>
  );
}
