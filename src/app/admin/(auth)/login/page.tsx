import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/server/auth";
import { isDatabaseConfigured } from "@/lib/server/db";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await getSessionUser();
  if (user) redirect("/admin");
  const sp = await searchParams;
  const next = typeof sp.next === "string" && sp.next.startsWith("/admin") ? sp.next : "/admin";
  const dbReady = isDatabaseConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight text-navy">LAMHA Technologies</p>
          <p className="mt-1 text-sm text-slate-500">Owner & team portal</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-6">
          {dbReady ? (
            <LoginForm next={next} />
          ) : (
            <p className="text-sm text-rose-700">The portal requires a database connection. Set DATABASE_URL to enable sign-in.</p>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">Access is restricted to authorised LAMHA staff. All activity is logged.</p>
      </div>
    </div>
  );
}
