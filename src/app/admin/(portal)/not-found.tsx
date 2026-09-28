import Link from "next/link";
import { btnGhostCls } from "@/components/admin/ui";

export default function PortalNotFound() {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-10 text-center">
      <p className="font-mono text-xs uppercase tracking-wide text-slate-500">404</p>
      <h1 className="mt-2 font-display text-xl font-semibold text-navy">Record not found</h1>
      <p className="mt-2 text-sm text-slate-600">It may have been removed, or the link is incorrect.</p>
      <Link href="/admin" className={`${btnGhostCls} mt-6`}>
        Back to dashboard
      </Link>
    </div>
  );
}
