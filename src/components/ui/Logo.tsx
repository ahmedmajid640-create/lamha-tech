import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Original LAMHA mark built to the written brand spec:
 * angular L-form (navy) + two blue diamond nodes. Recognizable in one color.
 */
export function LamhaMark({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" | "mono" }) {
  const structure = tone === "dark" ? "#0B1B3A" : tone === "light" ? "#FFFFFF" : "currentColor";
  const node1 = tone === "mono" ? "currentColor" : "#1769E0";
  const node2 = tone === "mono" ? "currentColor" : "#2E7CF6";
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={cn("h-8 w-8", className)}>
      <path d="M4 3h7v14.5l3.5 3.5H28v7H4z" fill={structure} />
      <path d="M20.5 5.5l4.5 4.5-4.5 4.5L16 10z" fill={node1} />
      <path d="M27.5 2.5l2.5 2.5-2.5 2.5L25 5z" fill={node2} />
    </svg>
  );
}

export function LamhaLogo({
  tone = "dark",
  withDescriptor = false,
  className,
  href = "/",
  markClassName,
}: {
  tone?: "dark" | "light";
  withDescriptor?: boolean;
  className?: string;
  href?: string | null;
  markClassName?: string;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LamhaMark tone={tone} className={markClassName} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[1.05rem] font-bold tracking-[0.2em]",
            tone === "dark" ? "text-navy" : "text-white",
          )}
        >
          LAMHA
        </span>
        {withDescriptor && (
          <span
            className={cn(
              "mt-1 text-[0.5rem] font-medium uppercase tracking-[0.22em]",
              tone === "dark" ? "text-slate-500" : "text-slate-400",
            )}
          >
            Technologies
          </span>
        )}
      </span>
    </span>
  );
  if (!href) return content;
  return (
    <Link href={href} aria-label="LAMHA Technologies home" className="inline-flex rounded-sm">
      {content}
    </Link>
  );
}
