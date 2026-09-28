"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DarkBackdrop } from "@/components/visuals/GridPattern";

/** Route-level error boundary: shown when a page throws at render time. Never exposes internals. */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Digest only: safe to log, lets us correlate with server logs without leaking details to the user.
    console.error("[page error]", error.digest ?? "no-digest");
  }, [error]);

  return (
    <section className="dark-section relative flex min-h-[80vh] items-center overflow-hidden bg-abyss text-white">
      <DarkBackdrop />
      <div className="container-x relative py-[calc(var(--header-h)+4rem)]">
        <SectionLabel number="500" tone="dark">
          Something went wrong
        </SectionLabel>
        <h1 className="mt-6 max-w-2xl text-h1 font-semibold">This page could not be displayed.</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
          An unexpected error occurred while rendering this page. You can try again, or return to the home page.
          {error.digest && (
            <>
              {" "}
              Reference: <span className="font-mono text-sm text-slate-400">{error.digest}</span>
            </>
          )}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={reset} size="lg">
            Try again
          </Button>
          <Button href="/" variant="outline-light" size="lg">
            Back to home
          </Button>
          <Button href="/contact" variant="outline-light" size="lg">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
