import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DarkBackdrop } from "@/components/visuals/GridPattern";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <SiteShell>
    <section className="dark-section relative flex min-h-[80vh] items-center overflow-hidden bg-abyss text-white">
      <DarkBackdrop />
      <div className="container-x relative py-[calc(var(--header-h)+4rem)]">
        <SectionLabel number="404" tone="dark">
          Page not found
        </SectionLabel>
        <h1 className="mt-6 max-w-2xl text-h1 font-semibold">This route does not resolve.</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
          The page you requested may have moved or never existed. The links below will take you back to somewhere useful.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/" size="lg" icon="arrow">
            Back to home
          </Button>
          <Button href="/services" variant="outline-light" size="lg">
            Explore services
          </Button>
          <Button href="/start-a-project" variant="outline-light" size="lg">
            Start a Project
          </Button>
        </div>
      </div>
    </section>
    </SiteShell>
  );
}
