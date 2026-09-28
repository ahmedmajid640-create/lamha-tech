import { cn } from "@/lib/utils";

export function Tag({
  children,
  tone = "light",
  accent = false,
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  accent?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-[0.65rem] font-medium uppercase tracking-[0.12em]",
        tone === "dark" ? "border-white/15 text-slate-300" : "border-slate-200 text-slate-600",
        accent && (tone === "dark" ? "border-blue-2/40 bg-blue/15 text-blue-200" : "border-blue-200 bg-blue-50 text-blue-700"),
        className,
      )}
    >
      {children}
    </span>
  );
}
