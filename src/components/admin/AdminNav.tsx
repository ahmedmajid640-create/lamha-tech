"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminNav({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Portal" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0">
      {items.map((it) => {
        const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} aria-current={active ? "page" : undefined} className={cn("whitespace-nowrap rounded px-3 py-2 text-sm font-medium transition", active ? "bg-navy text-white" : "text-slate-700 hover:bg-slate-100")}>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
