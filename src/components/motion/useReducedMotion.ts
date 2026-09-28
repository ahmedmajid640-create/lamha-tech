"use client";

import { useSyncExternalStore } from "react";

/** Subscribes to a media query. Server snapshot is `fallback`. */
export function useMediaQuery(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

/** True when the user prefers reduced motion. Defaults to true on the server so nothing animates before hydration. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}

const noop = () => () => {};

/** True once rendering on the client (false during SSR and hydration's first pass). */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

let webglCache: boolean | null = null;

export function supportsWebGL(): boolean {
  if (typeof document === "undefined") return false;
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement("canvas");
    webglCache = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

/** WebGL availability as a stable client snapshot (false on the server). */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(noop, supportsWebGL, () => false);
}
