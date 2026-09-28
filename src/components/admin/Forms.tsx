"use client";

import { useActionState, useRef, useState } from "react";
import type { ActionState } from "@/app/admin/actions";
import { btnCls, btnGhostCls, inputCls } from "./ui";
import { cn } from "@/lib/utils";

type Action = (prev: ActionState, fd: FormData) => Promise<ActionState>;

export function Feedback({ state }: { state: ActionState }) {
  if (!state?.message) return null;
  return (
    <p role="status" className={cn("mt-2 text-sm", state.ok ? "text-emerald-700" : "text-rose-700")}>
      {state.message}
    </p>
  );
}

/** Reveal-once display of a generated temporary password. Never persisted client-side. */
export function Secret({ value }: { value?: string }) {
  const [copied, setCopied] = useState<string | null>(null);
  if (!value) return null;
  const isCopied = copied === value;
  return (
    <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-amber-800">Temporary password (shown once)</p>
      <div className="mt-1 flex items-center gap-2">
        <code className="rounded bg-white px-2 py-1 font-mono text-sm text-slate-900">{value}</code>
        <button
          type="button"
          className={btnGhostCls}
          onClick={() =>
            navigator.clipboard
              ?.writeText(value)
              .then(() => setCopied(value))
              .catch(() => undefined)
          }
        >
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

/** Generic inline action form: hidden fields + optional select + submit. */
export function ActionForm({
  action,
  hidden,
  select,
  label,
  submitLabel,
  confirm,
  variant = "primary",
  className,
}: {
  action: Action;
  hidden: Record<string, string>;
  select?: { name: string; options: { value: string; label: string }[]; defaultValue?: string };
  label?: string;
  submitLabel: string;
  confirm?: string;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form
      action={formAction}
      className={className}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <div className="flex flex-wrap items-end gap-2">
        {select && (
          <label className="block min-w-44 flex-1 text-xs font-medium text-slate-600">
            {label}
            <select name={select.name} defaultValue={select.defaultValue} className={cn(inputCls, "mt-1")}>
              {select.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <button type="submit" disabled={pending} className={variant === "primary" ? btnCls : btnGhostCls}>
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
      <Feedback state={state} />
      <Secret value={state?.secret} />
    </form>
  );
}

export function NoteForm({ action, entityType, entityId }: { action: Action; entityType: string; entityId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (prev: ActionState, fd: FormData) => {
    const result = await action(prev, fd);
    if (result?.ok) formRef.current?.reset();
    return result;
  }, null);
  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="entityType" value={entityType} />
      <input type="hidden" name="entityId" value={entityId} />
      <textarea name="body" required minLength={2} maxLength={4000} rows={3} placeholder="Add an internal note (visible to the team only)…" className={inputCls} />
      <div className="mt-2 flex items-center gap-3">
        <button type="submit" disabled={pending} className={btnCls}>
          {pending ? "Saving…" : "Add note"}
        </button>
        <Feedback state={state} />
      </div>
    </form>
  );
}

export function FieldsForm({
  action,
  fields,
  submitLabel,
  hidden,
  children,
}: {
  action: Action;
  fields: { name: string; label: string; type?: string; required?: boolean; autoComplete?: string; options?: { value: string; label: string }[]; defaultValue?: string; minLength?: number }[];
  submitLabel: string;
  hidden?: Record<string, string>;
  children?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className="space-y-3">
      {hidden && Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      {fields.map((f) => (
        <label key={f.name} className="block text-xs font-medium text-slate-600">
          {f.label}
          {f.options ? (
            <select name={f.name} defaultValue={f.defaultValue} className={cn(inputCls, "mt-1")}>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input name={f.name} type={f.type ?? "text"} required={f.required} autoComplete={f.autoComplete} defaultValue={f.defaultValue} minLength={f.minLength} className={cn(inputCls, "mt-1")} />
          )}
        </label>
      ))}
      {children}
      <button type="submit" disabled={pending} className={btnCls}>
        {pending ? "Working…" : submitLabel}
      </button>
      <Feedback state={state} />
      <Secret value={state?.secret} />
    </form>
  );
}
