"use client";

import { useEffect } from "react";
import { track, type AnalyticsEventName, type AnalyticsProps } from "@/lib/analytics";

/** Fires a single analytics event when mounted (e.g. service_view, job_view). Renders nothing. */
export function ViewTracker({ event, props }: { event: AnalyticsEventName; props?: AnalyticsProps }) {
  const key = JSON.stringify(props ?? {});
  useEffect(() => {
    track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, key]);
  return null;
}
