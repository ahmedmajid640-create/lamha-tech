"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu } from "lucide-react";
import { primaryNav } from "@/data/navigation";
import { site } from "@/data/site";
import { LamhaLogo } from "@/components/ui/Logo";
import { MobileNav } from "./MobileNav";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Sticky header. Every page opens with a dark hero, so the header starts transparent
 * with light text and transitions to a solid light surface once the page scrolls.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation (state adjustment during render, per React guidance)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const close = useCallback(() => setOpen(false), []);
  const light = !scrolled; // light text on dark hero

  return (
    <>
      <a href="#main" className="sr-only-focusable">
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
          light ? "border-b border-transparent bg-transparent" : "border-b border-slate-200/80 bg-white/85 shadow-[0_1px_0_rgba(11,27,58,0.02)] backdrop-blur-md",
          light && "dark-section",
        )}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <LamhaLogo tone={light ? "light" : "dark"} />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex h-10 items-center rounded-md px-3 text-[0.9rem] font-medium transition-colors",
                        light ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-navy",
                        active && (light ? "text-white" : "text-navy"),
                        "after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-blue after:transition-transform after:duration-300",
                        active && "after:scale-x-100",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={site.cta.primary.href}
              onClick={() => track(ANALYTICS_EVENTS.START_PROJECT_CLICK, { location: "header" })}
              className={cn(
                "group hidden h-10 items-center gap-2 rounded-md bg-blue px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:inline-flex",
              )}
            >
              {site.cta.primary.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Open menu"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors lg:hidden",
                light ? "border-white/20 text-white hover:bg-white/10" : "border-slate-200 text-navy hover:bg-slate-100",
              )}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <MobileNav open={open} onClose={close} />
    </>
  );
}
