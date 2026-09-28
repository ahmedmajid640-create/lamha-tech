"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery, usePrefersReducedMotion } from "./useReducedMotion";

/** Custom cursor: a dot that follows exactly and a ring that lags and grows over interactive elements. Mouse-only. */
export function Cursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine || reduced) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setHover(Boolean(t?.closest("a, button, [role=button], input, select, textarea, label, summary")));
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.classList.add("custom-cursor");
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [fine, reduced, x, y]);

  if (!fine || reduced) return null;

  return (
    <>
      <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[90] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-2 mix-blend-difference" style={{ x, y, opacity: visible ? 1 : 0 }} />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-2/70 mix-blend-difference"
        style={{ x: rx, y: ry, opacity: visible ? 1 : 0 }}
        animate={{ width: hover ? 56 : 32, height: hover ? 56 : 32, backgroundColor: hover ? "rgba(46,124,246,0.15)" : "rgba(46,124,246,0)" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      />
    </>
  );
}
