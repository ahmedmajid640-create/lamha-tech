"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Cursor spotlight: a soft blue light follows the pointer across the wrapped content
 * (radial gradient positioned via CSS variables; no re-renders).
 */
export function Spotlight({ children, className, tone = "dark", radius = 520 }: { children: React.ReactNode; className?: string; tone?: "light" | "dark"; radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={cn("group/spot relative", className)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(${radius}px circle at var(--mx, 50%) var(--my, 50%), ${tone === "dark" ? "rgba(46,124,246,0.22)" : "rgba(46,124,246,0.14)"}, transparent 60%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
