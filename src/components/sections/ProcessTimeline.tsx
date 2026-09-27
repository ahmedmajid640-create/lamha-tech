import { processSteps } from "@/data/process";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Horizontal six-step process on desktop, vertical on mobile.
 * `notes` lets a service page override the step descriptions.
 */
export function ProcessTimeline({ notes, tone = "light" }: { notes?: string[]; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ol className="relative grid gap-8 md:grid-cols-3 xl:grid-cols-6 xl:gap-6">
      {/* connecting line (desktop) */}
      <span aria-hidden="true" className={cn("absolute left-0 right-0 top-5 hidden h-px xl:block", dark ? "bg-white/10" : "bg-slate-200")} />
      {processSteps.map((step, i) => (
        <Reveal key={step.number} as="li" delay={i * 70} className="relative flex gap-4 xl:block">
          <div className="flex flex-col items-center xl:block">
            <span className={cn("relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold", dark ? "border-blue-2/60 bg-deep text-blue-200" : "border-blue-200 bg-white text-blue")}>
              {step.number}
            </span>
            {i < processSteps.length - 1 && <span aria-hidden="true" className={cn("mt-2 w-px flex-1 xl:hidden", dark ? "bg-white/10" : "bg-slate-200")} />}
          </div>
          <div className="pb-2 xl:mt-6">
            <h3 className={cn("text-lg font-semibold", dark ? "text-white" : "text-navy")}>{step.title}</h3>
            <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-slate-400" : "text-slate-600")}>{notes?.[i] ?? step.description}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
