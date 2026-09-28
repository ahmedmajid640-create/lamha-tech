"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMediaQuery, useMounted, usePrefersReducedMotion, useWebGLSupport } from "@/components/motion/useReducedMotion";
import type { AccentVariant } from "./AccentScene";
import { cn } from "@/lib/utils";

const AccentScene = dynamic(() => import("./AccentScene"), { ssr: false });

/**
 * Lazy 3D accent. `fallback` (usually an SVG illustration) shows until the scene is
 * running and stays when WebGL is unavailable. Rendering pauses when off-screen.
 */
export function AccentCanvas({
  variant,
  className,
  fallback,
  minWidth,
}: {
  variant: AccentVariant;
  className?: string;
  fallback?: ReactNode;
  /** Skip mounting the WebGL scene below this viewport width (e.g. when the container is hidden on small screens). */
  minWidth?: number;
}) {
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const wideEnough = useMediaQuery(`(min-width: ${minWidth ?? 0}px)`, !minWidth);
  const webgl = useWebGLSupport() && wideEnough;
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.05, rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showScene = mounted && webgl;

  return (
    <div ref={ref} className={cn("relative aspect-[4/3] w-full", className)}>
      {fallback && (
        <div className={cn("absolute inset-0 transition-opacity duration-700", showScene && active ? "opacity-0" : "opacity-100")} aria-hidden={showScene}>
          {fallback}
        </div>
      )}
      {showScene && (
        <div className="absolute inset-0">
          <AccentScene variant={variant} active={active} reduced={reduced} />
        </div>
      )}
    </div>
  );
}
