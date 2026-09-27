import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";
import { FieldMessage } from "./FormField";

export type CheckboxFieldProps = ComponentPropsWithRef<"input"> & {
  id: string;
  label: React.ReactNode;
  error?: string;
  wrapperClassName?: string;
};

export function CheckboxField({ id, label, error, className, wrapperClassName, ...props }: CheckboxFieldProps) {
  const msgId = `${id}-msg`;
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-600">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? msgId : undefined}
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-blue accent-blue focus:ring-2 focus:ring-blue/30",
            error && "border-red-400",
            className,
          )}
          {...props}
        />
        <span>{label}</span>
      </label>
      <FieldMessage id={msgId} error={error} />
    </div>
  );
}
