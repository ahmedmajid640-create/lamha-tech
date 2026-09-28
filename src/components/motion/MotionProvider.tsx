"use client";

import { MotionConfig } from "motion/react";
import { SmoothScroll } from "./SmoothScroll";
import { ScrollProgress } from "./Motion";

/** Global motion configuration: honours prefers-reduced-motion, enables smooth scroll and the progress bar. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      <SmoothScroll />
      <ScrollProgress />
      {children}
    </MotionConfig>
  );
}
