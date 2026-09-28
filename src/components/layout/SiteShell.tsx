import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";

/** Marketing-site chrome: header, footer, smooth scroll, cursor and preloader. Not used by the owner portal. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </MotionProvider>
  );
}
