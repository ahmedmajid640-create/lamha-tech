"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";
import { Feedback } from "@/components/admin/Forms";
import { btnCls, inputCls } from "@/components/admin/ui";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, null);
  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block text-xs font-medium text-slate-600">
        Email
        <input name="email" type="email" required autoComplete="username" autoFocus className={`${inputCls} mt-1`} />
      </label>
      <label className="block text-xs font-medium text-slate-600">
        Password
        <input name="password" type="password" required autoComplete="current-password" className={`${inputCls} mt-1`} />
      </label>
      <button type="submit" disabled={pending} className={`${btnCls} w-full`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <Feedback state={state} />
    </form>
  );
}
