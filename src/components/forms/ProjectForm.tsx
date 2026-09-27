"use client";

import { useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import {
  projectInquirySchema,
  projectInquiryDefaults,
  budgetOptions,
  timelineOptions,
  stageOptions,
  ATTACHMENT_RULES,
  type ProjectInquiryFormValues,
} from "@/lib/validation/project";
import { serviceOptions } from "@/data/services";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";
import { TextareaField } from "./TextareaField";
import { CheckboxField } from "./CheckboxField";
import { FileUpload } from "./FileUpload";
import { ErrorBanner, Spinner, SuccessPanel } from "./FormStatus";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "success" | "error" | "offline";

const SUCCESS_MESSAGE =
  "Thank you — we've received your project inquiry. Our team will review the information you provided and contact you using the details submitted.";

function SectionTitle({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="font-mono text-xs font-semibold text-blue">{number}</span>
      <span aria-hidden="true" className="h-px w-6 bg-slate-300" />
      <h2 className="label-caps text-slate-600">{children}</h2>
    </div>
  );
}

export function ProjectForm({ initialService }: { initialService?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | undefined>(undefined);
  const started = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  const validInitial = initialService && (serviceOptions as readonly string[]).includes(initialService) ? initialService : "";

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ProjectInquiryFormValues>({
    resolver: zodResolver(projectInquirySchema) as unknown as Resolver<ProjectInquiryFormValues>,
    defaultValues: { ...projectInquiryDefaults, service: validInitial as ProjectInquiryFormValues["service"] },
    mode: "onBlur",
  });

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    track(ANALYTICS_EVENTS.PROJECT_FORM_START);
  };

  const submitValues = async (values: ProjectInquiryFormValues) => {
    setServerMessage(null);
    setFileError(undefined);

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setStatus("offline");
      track(ANALYTICS_EVENTS.PROJECT_FORM_ERROR, { reason: "offline" });
      return;
    }

    setStatus("submitting");
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (k === "consent") fd.append(k, v ? "true" : "false");
      else fd.append(k, String(v ?? ""));
    });
    files.forEach((f) => fd.append("attachments", f));

    try {
      const res = await fetch("/api/projects", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; id: string }
        | { ok: false; error: { code: string; message: string; fieldErrors?: Record<string, string> } }
        | null;

      if (res.ok && data && data.ok) {
        setReferenceId(data.id);
        setStatus("success");
        track(ANALYTICS_EVENTS.PROJECT_FORM_SUBMIT, { service: values.service, budget: values.budget || null, timeline: values.timeline || null });
        reset();
        setFiles([]);
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const err = data && !data.ok ? data.error : null;
      if (err?.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          if (field === "attachments") setFileError(message);
          else setError(field as keyof ProjectInquiryFormValues, { type: "server", message });
        });
      }
      setServerMessage(err?.message ?? "Something went wrong while submitting. Please try again.");
      setStatus("error");
      track(ANALYTICS_EVENTS.PROJECT_FORM_ERROR, { reason: err?.code ?? `http_${res.status}` });
    } catch {
      setStatus("offline");
      track(ANALYTICS_EVENTS.PROJECT_FORM_ERROR, { reason: "network" });
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    handleSubmit(submitValues, () => {
      track(ANALYTICS_EVENTS.PROJECT_FORM_ERROR, { reason: "client_validation" });
    })(e);

  if (status === "success") {
    return (
      <div ref={topRef}>
        <SuccessPanel title="Project inquiry received" message={SUCCESS_MESSAGE}>
          {referenceId && (
            <p className="text-xs text-slate-500">
              Reference: <span className="font-mono text-slate-700">{referenceId}</span>
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/services" variant="outline" size="sm" icon="arrow">
              Explore services
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatus("idle");
                setReferenceId(null);
                started.current = false;
              }}
            >
              Submit another inquiry
            </Button>
          </div>
        </SuccessPanel>
      </div>
    );
  }

  const busy = status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate onFocusCapture={markStarted} onChangeCapture={markStarted} className="space-y-12" aria-busy={busy}>
      {/* Honeypot (hidden from users and assistive tech) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <input type="hidden" {...register("source")} />

      <fieldset disabled={busy} className="min-w-0">
        <legend className="sr-only">Contact details</legend>
        <SectionTitle number="01">Contact</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="fullName" label="Full name" required autoComplete="name" placeholder="Your full name" error={errors.fullName?.message} {...register("fullName")} />
          <FormField id="company" label="Company" autoComplete="organization" placeholder="Company or organization" error={errors.company?.message} {...register("company")} />
          <FormField id="email" label="Work email" type="email" required inputMode="email" autoComplete="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
          <FormField id="phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+1 555 000 0000" error={errors.phone?.message} {...register("phone")} />
          <FormField id="country" label="Country" autoComplete="country-name" placeholder="Where you are based" error={errors.country?.message} wrapperClassName="sm:col-span-2" {...register("country")} />
        </div>
      </fieldset>

      <fieldset disabled={busy} className="min-w-0">
        <legend className="sr-only">Project details</legend>
        <SectionTitle number="02">Project</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="projectName" label="Project name" placeholder="Working title" error={errors.projectName?.message} {...register("projectName")} />
          <SelectField id="service" label="Service required" required options={serviceOptions} placeholder="Select a service" error={errors.service?.message} {...register("service")} />
          <FormField id="industry" label="Business / industry" placeholder="e.g. Logistics, Healthcare, Retail" error={errors.industry?.message} {...register("industry")} />
          <SelectField id="stage" label="Current stage" options={stageOptions} placeholder="Where the project stands today" error={errors.stage?.message} {...register("stage")} />
          <TextareaField
            id="description"
            label="Project description"
            required
            rows={7}
            placeholder="What problem are you solving, who is it for, and what does success look like?"
            hint="The more context you share, the more precisely we can respond."
            error={errors.description?.message}
            wrapperClassName="sm:col-span-2"
            {...register("description")}
          />
        </div>
      </fieldset>

      <fieldset disabled={busy} className="min-w-0">
        <legend className="sr-only">Budget and timeline</legend>
        <SectionTitle number="03">Scope</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField id="budget" label="Budget" options={budgetOptions} placeholder="Indicative budget range" error={errors.budget?.message} {...register("budget")} />
          <SelectField id="timeline" label="Timeline" options={timelineOptions} placeholder="When you would like to start" error={errors.timeline?.message} {...register("timeline")} />
        </div>
      </fieldset>

      <fieldset disabled={busy} className="min-w-0">
        <legend className="sr-only">Attachments and consent</legend>
        <SectionTitle number="04">Attachments &amp; consent</SectionTitle>
        <div className="space-y-6">
          <FileUpload
            id="attachments"
            label="Attachments"
            files={files}
            onChange={(f) => {
              setFileError(undefined);
              setFiles(f);
            }}
            maxFiles={ATTACHMENT_RULES.maxFiles}
            maxBytesPerFile={ATTACHMENT_RULES.maxBytesPerFile}
            allowedExtensions={ATTACHMENT_RULES.allowedExtensions}
            error={fileError}
            disabled={busy}
          />
          <CheckboxField
            id="consent"
            label={
              <>
                I agree that LAMHA Technologies may contact me about this project inquiry using the details provided. <span className="text-slate-500">We use your information only to respond to this request.</span>
              </>
            }
            error={errors.consent?.message}
            {...register("consent")}
          />
        </div>
      </fieldset>

      {(status === "error" || status === "offline") && (
        <ErrorBanner
          kind={status === "offline" ? "network" : "error"}
          message={
            status === "offline"
              ? "We could not reach the server. Check your connection and try again. Your entries have been kept."
              : serverMessage ?? "Something went wrong while submitting. Please try again."
          }
        />
      )}

      <div className="flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-500">
          Fields marked <span className="text-blue">*</span> are required. Submissions are validated and stored securely.
        </p>
        <button
          type="submit"
          disabled={busy}
          className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-blue px-6 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-70 sm:w-auto"
        >
          {busy ? (
            <>
              <Spinner /> Submitting…
            </>
          ) : (
            <>
              Submit Project Inquiry
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
