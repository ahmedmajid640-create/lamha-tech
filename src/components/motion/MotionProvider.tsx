"use client";

import { MotionConfig } from "motion/react";
import { SmoothScroll } from "./SmoothScroll";
import { ScrollProgress } from "./Motion";
import { Cursor } from "./Cursor";
import { Preloader } from "./Preloader";

/** Global motion configuration: honours prefers-reduced-motion; smooth scroll, progress bar, cursor and intro. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      <Preloader />
      <SmoothScroll />
      <ScrollProgress />
      <Cursor />
      {children}
    </MotionConfig>
  );
}
