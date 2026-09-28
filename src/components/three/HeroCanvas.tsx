"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { NetworkVisual } from "@/components/visuals/NetworkVisual";
import { useMediaQuery, useMounted, usePrefersReducedMotion, useWebGLSupport } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <NetworkVisual className="absolute inset-0 h-full w-full" />,
});

/**
 * Lazy WebGL hero. Falls back to the SVG network illustration when WebGL is unavailable.
 * Rendering pauses when the hero scrolls out of view.
 */
export function HeroCanvas({ className }: { className?: string }) {
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const mobile = useMediaQuery("(max-width: 768px)");
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("relative aspect-square w-full", className)}>
      {mounted && webgl ? (
        <div className="absolute inset-0">
          <HeroScene active={active} reduced={reduced} mobile={mobile} />
        </div>
      ) : (
        <NetworkVisual className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}
