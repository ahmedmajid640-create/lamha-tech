import { site } from "@/data/site";
import { TrackedCTA } from "@/components/analytics/TrackedLink";
import { Button } from "@/components/ui/Button";
import { DarkBackdrop } from "@/components/visuals/GridPattern";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

/** Final conversion section with a dark technical visual. */
export function CTASection({
  headline = "Have a problem worth solving?",
  description = "Tell us about the challenge. We will review your requirements and respond using the details you provide.",
  location = "cta_section",
  className,
}: {
  headline?: React.ReactNode;
  description?: string;
  location?: string;
  className?: string;
}) {
  return (
    <section aria-labelledby="cta-heading" className={cn("dark-section relative overflow-hidden bg-abyss text-white", className)}>
      <DarkBackdrop />
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <svg viewBox="0 0 600 400" className="h-full w-full opacity-70" preserveAspectRatio="xMidYMid slice">
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
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <path key={`s-${i}`} d={`M-50 ${60 + i * 50} C 200 ${20 + i * 50}, 350 ${140 + i * 40}, 650 ${80 + i * 45}`} fill="none" stroke="rgba(127,176,255,0.15)" strokeWidth="1" />
          ))}
        </svg>
      </div>
      <div className="container-x relative section-y">
        <div className="max-w-2xl">
          <h2 id="cta-heading" className="text-h2 font-semibold text-white">
            {headline}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-300">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedCTA href={site.cta.primary.href} event={ANALYTICS_EVENTS.START_PROJECT_CLICK} eventProps={{ location }} size="lg" icon="arrow">
              {site.cta.primary.label}
            </TrackedCTA>
            <Button href="/contact" variant="outline-light" size="lg">
              Contact us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
