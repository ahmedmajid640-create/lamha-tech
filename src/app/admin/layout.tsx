import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "LAMHA Portal", template: "%s | LAMHA Portal" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

/** Owner/Admin portal root: no marketing chrome, no smooth scroll, no custom cursor. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin min-h-screen bg-cloud font-sans text-slate-900 antialiased">{children}</div>;
}
