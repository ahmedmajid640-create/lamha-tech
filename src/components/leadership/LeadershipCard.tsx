import Image from "next/image";
import type { Leader } from "@/data/leadership";
import { cn } from "@/lib/utils";

/** Portrait or initials placeholder. Only approved portraits are rendered. */
export function Portrait({ leader, className, size = "md" }: { leader: Leader; className?: string; size?: "md" | "lg" }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-navy-700 via-navy to-abyss",
        size === "lg" ? "aspect-[4/5]" : "aspect-square",
        className,
      )}
    >
      <div aria-hidden="true" className="absolute inset-0 grid-texture opacity-60" />
      <div aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue/30 blur-3xl" />
      {leader.portrait ? (
        <Image
          src={leader.portrait}
          alt={`Portrait of ${leader.name}, ${leader.role} at LAMHA Technologies`}
          fill
          sizes="(min-width: 1024px) 420px, 60vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
          style={{ objectPosition: leader.portraitPosition ?? "50% 25%" }}
          priority={size === "lg"}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center" role="img" aria-label={`Placeholder portrait for ${leader.name}`}>
          <span className={cn("font-semibold tracking-tight text-white/90", size === "lg" ? "text-6xl" : "text-4xl")}>{leader.initials}</span>
          <span className="mt-3 label-caps text-slate-400">Portrait pending</span>
        </div>
      )}
    </div>
  );
}

export function LeadershipCard({ leader, tone = "light", className }: { leader: Leader; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <article className={cn("group flex h-full flex-col", className)}>
      <Portrait leader={leader} className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1" />
      <div className="mt-5">
        <h3 className={cn("text-lg font-semibold", dark ? "text-white" : "text-navy")}>{leader.name}</h3>
        <p className={cn("mt-1 text-sm font-medium", dark ? "text-blue-200" : "text-blue")}>{leader.role}</p>
        <p className={cn("mt-3 text-sm leading-relaxed", dark ? "text-slate-400" : "text-slate-500")}>
          {leader.bio ?? "Leadership biography coming soon."}
        </p>
      </div>
    </article>
  );
}
