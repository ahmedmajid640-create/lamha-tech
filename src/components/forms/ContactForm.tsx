"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { contactSchema, contactTopics, type ContactFormValues } from "@/lib/validation/contact";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";
import { TextareaField } from "./TextareaField";
import { CheckboxField } from "./CheckboxField";
import { ErrorBanner, Spinner, SuccessPanel } from "./FormStatus";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "success" | "error" | "offline";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema) as unknown as Resolver<ContactFormValues>,
    defaultValues: { name: "", email: "", topic: "" as ContactFormValues["topic"], message: "", consent: false, website: "", startedAt: "" },
    mode: "onBlur",
  });

  // Records when the form was opened; the server ignores submissions made within ~2.5 s (bots).
  useEffect(() => {
    setValue("startedAt", String(Date.now()));
  }, [setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setServerMessage(null);
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setStatus("offline");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; id: string }
        | { ok: false; error: { code: string; message: string; fieldErrors?: Record<string, string> } }
        | null;
      if (res.ok && data?.ok) {
        setStatus("success");
        track(ANALYTICS_EVENTS.CONTACT_FORM_SUBMIT, { topic: values.topic });
        reset();
        return;
      }
      const err = data && !data.ok ? data.error : null;
      if (err?.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, message]) => setError(field as keyof ContactFormValues, { type: "server", message }));
      }
      setServerMessage(err?.message ?? "Something went wrong. Please try again.");
      setStatus("error");
      track(ANALYTICS_EVENTS.CONTACT_FORM_ERROR, { reason: err?.code ?? `http_${res.status}` });
    } catch {
      setStatus("offline");
      track(ANALYTICS_EVENTS.CONTACT_FORM_ERROR, { reason: "network" });
    }
  });

  if (status === "success") {
    return (
      <SuccessPanel title="Message received" message="Thank you — we've received your message. Our team will review it and contact you using the details submitted.">
        <Button variant="ghost" size="sm" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </SuccessPanel>
    );
  }

  const busy = status === "submitting";
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" aria-busy={busy}>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <input type="hidden" {...register("startedAt")} />
      <fieldset disabled={busy} className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">Your message</legend>
        <FormField id="c-name" label="Name" required autoComplete="name" error={errors.name?.message} {...register("name")} />
        <FormField id="c-email" label="Email" type="email" required inputMode="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        <SelectField id="c-topic" label="Topic" required options={contactTopics} placeholder="What is this about?" error={errors.topic?.message} wrapperClassName="sm:col-span-2" {...register("topic")} />
        <TextareaField id="c-message" label="Message" required rows={6} error={errors.message?.message} wrapperClassName="sm:col-span-2" {...register("message")} />
        <CheckboxField
          id="c-consent"
          label="I agree that LAMHA Technologies may contact me about this message using the details provided."
          error={errors.consent?.message}
          wrapperClassName="sm:col-span-2"
          {...register("consent")}
        />
      </fieldset>
      {(status === "error" || status === "offline") && (
        <ErrorBanner kind={status === "offline" ? "network" : "error"} message={status === "offline" ? "We could not reach the server. Check your connection and try again." : serverMessage ?? "Something went wrong."} />
      )}
      <button type="submit" disabled={busy} className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-blue px-6 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-70 sm:w-auto">
        {busy ? (
          <>
            <Spinner /> Sending…
          </>
        ) : (
          <>
            Send message <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
