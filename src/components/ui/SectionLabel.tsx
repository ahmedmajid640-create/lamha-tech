import { cn } from "@/lib/utils";

export function SectionLabel({
  number,
  children,
  tone = "light",
  className,
  as: Tag = "p",
}: {
  number?: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag
      className={cn(
        "label-caps inline-flex items-center gap-3",
        tone === "dark" ? "text-slate-400" : "text-slate-500",
        className,
      )}
    >
      {number && (
        <span className={cn("font-mono text-[0.75rem] font-semibold tabular-nums tracking-normal", tone === "dark" ? "text-blue-2" : "text-blue")}>
          {number}
        </span>
      )}
      {number && <span aria-hidden="true" className={cn("h-px w-6", tone === "dark" ? "bg-white/25" : "bg-slate-300")} />}
      <span>{children}</span>
    </Tag>
  );
}
