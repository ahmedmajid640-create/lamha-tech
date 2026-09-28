"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { applicationSchema, CV_RULES, type ApplicationFormValues } from "@/lib/validation/application";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { FormField } from "@/components/forms/FormField";
import { TextareaField } from "@/components/forms/TextareaField";
import { CheckboxField } from "@/components/forms/CheckboxField";
import { FileUpload } from "@/components/forms/FileUpload";
import { ErrorBanner, Spinner, SuccessPanel } from "@/components/forms/FormStatus";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "success" | "error" | "offline";

export function ApplicationForm({ roleTitle, roleSlug }: { roleTitle: string; roleSlug: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [cv, setCv] = useState<File[]>([]);
  const [cvError, setCvError] = useState<string | undefined>(undefined);
  const started = useRef(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema) as unknown as Resolver<ApplicationFormValues>,
    defaultValues: { role: roleTitle, roleSlug, name: "", email: "", phone: "", portfolio: "", linkedin: "", github: "", coverLetter: "", consent: false, website: "", startedAt: "" },
    mode: "onBlur",
  });

  // Records when the form was opened; the server ignores submissions made within ~2.5 s (bots).
  useEffect(() => {
    setValue("startedAt", String(Date.now()));
  }, [setValue]);

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    track(ANALYTICS_EVENTS.APPLICATION_START, { role: roleSlug });
  };

  const onSubmit = handleSubmit(async (values) => {
    setServerMessage(null);
    setCvError(undefined);
    if (cv.length === 0) {
      setCvError("Please attach your CV (PDF, DOC or DOCX).");
      return;
    }
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setStatus("offline");
      return;
    }
    setStatus("submitting");
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => fd.append(k, k === "consent" ? (v ? "true" : "false") : String(v ?? "")));
    fd.append("cv", cv[0]);
    try {
      const res = await fetch("/api/applications", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; id: string }
        | { ok: false; error: { code: string; message: string; fieldErrors?: Record<string, string> } }
        | null;
      if (res.ok && data?.ok) {
        setStatus("success");
        track(ANALYTICS_EVENTS.APPLICATION_SUBMIT, { role: roleSlug });
        reset();
        setCv([]);
        return;
      }
      const err = data && !data.ok ? data.error : null;
      if (err?.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          if (field === "cv") setCvError(message);
          else setError(field as keyof ApplicationFormValues, { type: "server", message });
        });
      }
      setServerMessage(err?.message ?? "Something went wrong. Please try again.");
      setStatus("error");
      track(ANALYTICS_EVENTS.APPLICATION_ERROR, { reason: err?.code ?? `http_${res.status}` });
    } catch {
      setStatus("offline");
      track(ANALYTICS_EVENTS.APPLICATION_ERROR, { reason: "network" });
    }
  });

  if (status === "success") {
    return (
      <SuccessPanel title="Application received" message="Thank you — we've received your application. Our team will review it and contact you using the details submitted.">
        <Button href="/careers" variant="outline" size="sm" icon="arrow">
          Back to careers
        </Button>
      </SuccessPanel>
    );
  }

  const busy = status === "submitting";
  return (
    <form onSubmit={onSubmit} noValidate onFocusCapture={markStarted} className="space-y-6" aria-busy={busy}>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="a-website">Website</label>
        <input id="a-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <input type="hidden" {...register("startedAt")} />
      <input type="hidden" {...register("roleSlug")} />
      <fieldset disabled={busy} className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">Your details</legend>
        <FormField id="a-role" label="Role" required readOnly error={errors.role?.message} {...register("role")} className="bg-slate-50" wrapperClassName="sm:col-span-2" />
        <FormField id="a-name" label="Full name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
        <FormField id="a-email" label="Email" type="email" required inputMode="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <FormField id="a-phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
        <FormField id="a-portfolio" label="Portfolio" type="url" inputMode="url" placeholder="https://" error={errors.portfolio?.message} {...register("portfolio")} />
        <FormField id="a-linkedin" label="LinkedIn" type="url" inputMode="url" placeholder="https://linkedin.com/in/…" error={errors.linkedin?.message} {...register("linkedin")} />
        <FormField id="a-github" label="GitHub" type="url" inputMode="url" placeholder="https://github.com/…" error={errors.github?.message} {...register("github")} />
        <FileUpload id="a-cv" label="CV / Résumé" required files={cv} onChange={(f) => { setCvError(undefined); setCv(f); }} maxFiles={1} maxBytesPerFile={CV_RULES.maxBytes} allowedExtensions={CV_RULES.allowedExtensions} error={cvError} disabled={busy} wrapperClassName="sm:col-span-2" />
        <TextareaField id="a-cover" label="Cover letter" rows={6} placeholder="Tell us why this role and why LAMHA." error={errors.coverLetter?.message} wrapperClassName="sm:col-span-2" {...register("coverLetter")} />
        <CheckboxField id="a-consent" label="I agree that LAMHA Technologies may contact me about this application and process my details for recruitment purposes." error={errors.consent?.message} wrapperClassName="sm:col-span-2" {...register("consent")} />
      </fieldset>
      {(status === "error" || status === "offline") && (
        <ErrorBanner kind={status === "offline" ? "network" : "error"} message={status === "offline" ? "We could not reach the server. Check your connection and try again." : serverMessage ?? "Something went wrong."} />
      )}
      <button type="submit" disabled={busy} className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-blue px-6 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-70 sm:w-auto">
        {busy ? (
          <>
            <Spinner /> Submitting…
          </>
        ) : (
          <>
            Submit application <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
