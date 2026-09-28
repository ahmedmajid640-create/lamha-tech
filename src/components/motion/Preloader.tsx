"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LamhaMark } from "@/components/ui/Logo";
import { usePrefersReducedMotion } from "./useReducedMotion";

const KEY = "lamha:preloaded";
const noop = () => () => {};

function readSeen(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return true; // storage unavailable: skip the intro
  }
}

/** Brief first-visit intro: counter to 100 with the mark, then the curtain lifts. Once per session. */
export function Preloader() {
  const reduced = usePrefersReducedMotion();
  // Server snapshot = "seen" so nothing renders during SSR/hydration; the client snapshot decides afterwards.
  const seen = useSyncExternalStore(noop, readSeen, () => true);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  const show = !seen && !reduced && !done;

  useEffect(() => {
    if (!show) return;
    document.documentElement.classList.add("preloading");
    const start = performance.now();
    const duration = 1100;
    let raf = 0;
    let timer = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        timer = window.setTimeout(() => {
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {
            /* ignore */
          }
          document.documentElement.classList.remove("preloading");
          setDone(true);
        }, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      document.documentElement.classList.remove("preloading");
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[100] flex items-end justify-between bg-abyss px-6 pb-8 text-white sm:px-10 sm:pb-10"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="flex items-center gap-3">
            <LamhaMark tone="light" className="h-9 w-9" />
            <span className="text-sm font-bold tracking-[0.25em]">LAMHA</span>
          </div>
          <div className="text-right">
            <p className="label-caps text-slate-500">Technology That Turns Problems Into Progress</p>
            <p className="mt-2 font-mono text-6xl font-semibold tabular-nums leading-none sm:text-8xl">{String(count).padStart(3, "0")}</p>
          </div>
          <motion.div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-blue-2" style={{ scaleX: count / 100 }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
