import { site } from "@/data/site";
import { TrackedCTA } from "@/components/analytics/TrackedLink";
import { Button } from "@/components/ui/Button";
import { DarkBackdrop } from "@/components/visuals/GridPattern";
import { AccentCanvas } from "@/components/three/AccentCanvas";
import { Magnetic, Rise, TextReveal } from "@/components/motion/Motion";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

function LinesFallback() {
  return (
    <svg viewBox="0 0 600 400" className="h-full w-full opacity-70" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="cta-l" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#2e7cf6" stopOpacity="0" />
          <stop offset="50%" stopColor="#7fb0ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2e7cf6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M-50 ${60 + i * 50} C 200 ${20 + i * 50}, 350 ${140 + i * 40}, 650 ${80 + i * 45}`} fill="none" stroke="url(#cta-l)" strokeWidth="1" strokeDasharray="120 600" className="animate-dash" style={{ animationDelay: `${i * -1.7}s`, animationDuration: `${14 + i}s` }} />
      ))}
    </svg>
  );
}

/** Final conversion section with a 3D technical accent. */
const steps = [
  { n: "01", title: "Tell us about the project", body: "One form: contact, project, service, budget, timeline and optional brief." },
  { n: "02", title: "We review the requirements", body: "Your inquiry becomes an internal lead record and is read by the team." },
  { n: "03", title: "We contact you", body: "Using the details you submitted, with questions or a proposed next step." },
];

export function CTASection({
  headline = "Have a problem worth solving?",
  description = "Tell us about the challenge. We will review your requirements and respond using the details you provide.",
  location = "cta_section",
  showSteps = false,
  className,
}: {
  headline?: string;
  description?: string;
  location?: string;
  showSteps?: boolean;
  className?: string;
}) {
  return (
    <section aria-labelledby="cta-heading" className={cn("dark-section relative overflow-hidden bg-abyss text-white", className)}>
      <DarkBackdrop />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <div className="absolute right-[-5%] top-1/2 h-[520px] w-[520px] -translate-y-1/2">
          <AccentCanvas variant="torusKnot" minWidth={1024} className="h-full w-full !aspect-auto" fallback={<LinesFallback />} />
        </div>
      </div>
      <div className="container-x relative section-y">
        <div className="max-w-2xl">
          <h2 id="cta-heading" className="text-h2 font-semibold text-white">
            <TextReveal lines={[headline]} />
          </h2>
          <Rise delay={0.25}>
            <p className="mt-5 text-lg leading-relaxed text-slate-300">{description}</p>
          </Rise>
          {showSteps && (
            <Rise delay={0.3}>
              <ol className="mt-8 grid gap-4 sm:grid-cols-3">
                {steps.map((s) => (
                  <li key={s.n} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                    <span className="font-mono text-xs text-blue-200">{s.n}</span>
                    <p className="mt-2 text-sm font-semibold text-white">{s.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{s.body}</p>
                  </li>
                ))}
              </ol>
            </Rise>
          )}
          <Rise delay={0.4}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <TrackedCTA href={site.cta.primary.href} event={ANALYTICS_EVENTS.START_PROJECT_CLICK} eventProps={{ location }} size="lg" icon="arrow">
                  {site.cta.primary.label}
                </TrackedCTA>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Button href="/contact" variant="outline-light" size="lg">
                  Contact us
                </Button>
              </Magnetic>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
