import { cn } from "@/lib/utils";

/** Subtle technical grid + radial blue glow for dark sections. Purely decorative. */
export function DarkBackdrop({ className, glow = false }: { className?: string; glow?: boolean }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 grid-texture [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" />
      {glow && (
        <>
          <div className="absolute -top-32 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-blue/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] h-[28rem] w-[28rem] rounded-full bg-blue-2/5 blur-[110px]" />
        </>
      )}
    </div>
  );
}

/** Light-section grid texture. */
export function LightBackdrop({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 grid-texture-light [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
    </div>
  );
}
