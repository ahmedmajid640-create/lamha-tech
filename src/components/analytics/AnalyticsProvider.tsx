"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { analyticsConfig, trackPageView } from "@/lib/analytics";

/**
 * Mounts provider scripts (only when configured via env) and reports page views
 * on client-side navigation. Scripts load lazily so they never block rendering.
 */
export function AnalyticsProvider() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || last.current === pathname) return;
    last.current = pathname;
    trackPageView(pathname);
  }, [pathname]);

  return (
    <>
      {analyticsConfig.gaMeasurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsConfig.gaMeasurementId)}`}
            strategy="lazyOnload"
          />
          <Script id="ga-init" strategy="lazyOnload">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${analyticsConfig.gaMeasurementId}', { send_page_view: false, anonymize_ip: true });`}
          </Script>
        </>
      )}
      {analyticsConfig.plausibleDomain && (
        <Script
          src="https://plausible.io/js/script.manual.js"
          data-domain={analyticsConfig.plausibleDomain}
          strategy="lazyOnload"
        />
      )}
    </>
  );
}
