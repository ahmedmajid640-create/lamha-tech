"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Section content wipes in from the bottom edge (clip-path) the first time it scrolls into view. */
export function SectionReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={cn("will-change-[clip-path]", className)}
      initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0.6 }}
      whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
