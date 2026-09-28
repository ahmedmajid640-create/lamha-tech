"use client";

import { useEffect } from "react";
import { btnCls } from "@/components/admin/ui";

export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[portal error]", error.digest ?? "no-digest");
  }, [error]);
  return (
    <div className="rounded-md border border-rose-200 bg-white p-10 text-center">
      <h1 className="font-display text-xl font-semibold text-navy">Something went wrong</h1>
      <p className="mt-2 text-sm text-slate-600">The page could not be loaded. {error.digest && <span className="font-mono text-xs text-slate-400">Ref {error.digest}</span>}</p>
      <button type="button" onClick={reset} className={`${btnCls} mt-6`}>
        Try again
      </button>
    </div>
  );
}
