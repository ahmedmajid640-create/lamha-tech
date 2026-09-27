"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { primaryNav } from "@/data/navigation";
import { site } from "@/data/site";
import { LamhaLogo } from "@/components/ui/Logo";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Scroll lock + Escape to close + initial focus
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-nav"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!open}
      className={cn(
        "dark-section fixed inset-0 z-[60] flex flex-col bg-deep text-white transition-[opacity,visibility,transform] duration-300 ease-[var(--ease-out-expo)] lg:hidden",
        open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0 pointer-events-none",
      )}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between">
        <LamhaLogo tone="light" href={null} />
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/15 text-white hover:bg-white/10"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto pb-8 pt-4">
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {primaryNav.map((item, i) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center justify-between py-4 text-2xl font-semibold tracking-tight transition-colors",
                    active ? "text-blue-200" : "text-white hover:text-blue-200",
                  )}
                  style={{ transitionDelay: open ? `${i * 30}ms` : "0ms" }}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-slate-500">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </span>
                  <ArrowRight className="h-5 w-5 text-slate-500 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 grid gap-3">
          <Link
            href={site.cta.primary.href}
            onClick={() => {
              track(ANALYTICS_EVENTS.START_PROJECT_CLICK, { location: "mobile_nav" });
              onClose();
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-blue px-5 text-base font-medium text-white hover:bg-blue-700"
          >
            {site.cta.primary.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-5 text-base font-medium text-white hover:bg-white/10"
          >
            Contact
          </Link>
        </div>

        <p className="mt-10 text-xs uppercase tracking-[0.2em] text-slate-500">{site.legalName}</p>
      </nav>
    </div>
  );
}
