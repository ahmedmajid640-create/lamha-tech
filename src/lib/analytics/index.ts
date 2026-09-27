"use client";

import { ANALYTICS_EVENTS, type AnalyticsEventName, type AnalyticsProps } from "./events";

export { ANALYTICS_EVENTS };
export type { AnalyticsEventName, AnalyticsProps };

/**
 * Provider abstraction. Add a provider by implementing `AnalyticsProvider`
 * and registering it in `resolveProviders()`. Nothing else in the app changes.
 *
 * Providers are enabled purely through public environment variables:
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID   -> Google Analytics 4 (gtag)
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN    -> Plausible
 *   NEXT_PUBLIC_ANALYTICS_DEBUG=1   -> console logging
 */
export interface AnalyticsProvider {
  name: string;
  track(event: AnalyticsEventName, props?: AnalyticsProps): void;
}

type GtagFn = (...args: unknown[]) => void;
type PlausibleFn = (event: string, options?: { props?: AnalyticsProps }) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    plausible?: PlausibleFn;
    dataLayer?: unknown[];
  }
}

const gaProvider = (measurementId: string): AnalyticsProvider => ({
  name: "ga4",
  track(event, props) {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    if (event === ANALYTICS_EVENTS.PAGE_VIEW) {
      window.gtag("config", measurementId, { page_path: props?.path });
      return;
    }
    window.gtag("event", event, props ?? {});
  },
});

const plausibleProvider = (): AnalyticsProvider => ({
  name: "plausible",
  track(event, props) {
    if (typeof window === "undefined" || typeof window.plausible !== "function") return;
    if (event === ANALYTICS_EVENTS.PAGE_VIEW) {
      window.plausible("pageview");
      return;
    }
    window.plausible(event, { props });
  },
});

const consoleProvider = (): AnalyticsProvider => ({
  name: "console",
  track(event, props) {
    // Never log user-entered content: callers pass only non-sensitive metadata.
    console.info(`[analytics] ${event}`, props ?? {});
  },
});

let cached: AnalyticsProvider[] | null = null;

function resolveProviders(): AnalyticsProvider[] {
  if (cached) return cached;
  const providers: AnalyticsProvider[] = [];
  const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const debug = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "1" || process.env.NODE_ENV === "development";
  if (ga) providers.push(gaProvider(ga));
  if (plausible) providers.push(plausibleProvider());
  if (debug) providers.push(consoleProvider());
  cached = providers;
  return providers;
}

/** Fire an analytics event to every configured provider. Safe to call anywhere on the client. */
export function track(event: AnalyticsEventName, props?: AnalyticsProps): void {
  try {
    for (const p of resolveProviders()) p.track(event, props);
  } catch {
    // Analytics must never break the UI.
  }
}

export function trackPageView(path: string): void {
  track(ANALYTICS_EVENTS.PAGE_VIEW, { path });
}

export const analyticsConfig = {
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? null,
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? null,
};
