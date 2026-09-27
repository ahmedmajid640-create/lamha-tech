import { AlertTriangle, CheckCircle2, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function SuccessPanel({ title, message, children, className }: { title: string; message: string; children?: React.ReactNode; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn("rounded-lg border border-blue-200 bg-blue-50 p-6 sm:p-8", className)}>
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue text-white">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-navy">{title}</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-700">{message}</p>
          {children && <div className="mt-5">{children}</div>}
        </div>
      </div>
    </div>
  );
}

export function ErrorBanner({ message, kind = "error", className }: { message: string; kind?: "error" | "network"; className?: string }) {
  const Icon = kind === "network" ? WifiOff : AlertTriangle;
  return (
    <div role="alert" className={cn("flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800", className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent", className)}
    />
  );
}
