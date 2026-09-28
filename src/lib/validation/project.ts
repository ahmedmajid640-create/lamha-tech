import { z } from "zod";
import { serviceOptions } from "@/data/services";

/**
 * Shared (client + server) schema for the Start a Project form.
 * Attachments are validated separately on the server (see lib/server/uploads.ts).
 */
export const budgetOptions = [
  "Under $1k",
  "$1k–$5k",
  "$5k–$10k",
  "$10k–$25k",
  "$25k–$50k",
  "$50k+",
  "Not sure",
] as const;

export const timelineOptions = ["ASAP", "1 month", "1–3 months", "3–6 months", "6+ months", "Flexible"] as const;

export const stageOptions = [
  "Idea / concept",
  "Requirements defined",
  "Design in progress",
  "In development",
  "Live product needing improvement",
  "Not sure",
] as const;

export const ATTACHMENT_RULES = {
  maxFiles: 3,
  maxBytesPerFile: 10 * 1024 * 1024, // 10 MB
  allowedExtensions: ["pdf", "doc", "docx"] as const,
  allowedMimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ] as const,
};

const trimmed = (max: number) => z.string().trim().max(max, `Must be ${max} characters or fewer.`);
const optionalTrimmed = (max: number) => trimmed(max).optional().or(z.literal(""));

export const projectInquirySchema = z.object({
  fullName: trimmed(100).min(2, "Please enter your full name."),
  company: optionalTrimmed(120),
  email: z.string().trim().toLowerCase().email("Please enter a valid work email address.").max(254),
  phone: optionalTrimmed(40).refine(
    (v) => !v || /^[+()0-9\s.-]{6,40}$/.test(v),
    "Please enter a valid phone number.",
  ),
  country: optionalTrimmed(80),
  projectName: optionalTrimmed(120),
  service: z.enum(serviceOptions, { message: "Please select the service you need." }),
  industry: optionalTrimmed(120),
  description: trimmed(5000).min(30, "Please describe your project in at least 30 characters."),
  stage: z.enum(stageOptions, { message: "Please choose one of the listed stages." }).optional().or(z.literal("")),
  budget: z.enum(budgetOptions, { message: "Please choose one of the listed budget ranges." }).optional().or(z.literal("")),
  timeline: z.enum(timelineOptions, { message: "Please choose one of the listed timelines." }).optional().or(z.literal("")),
  consent: z.literal(true, { message: "Please confirm that LAMHA may contact you about this inquiry." }),
  /** Honeypot: must remain empty. Bots that fill it are silently discarded. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Epoch ms when the form was opened (bot dwell-time check). Optional. */
  startedAt: z.string().max(20).optional().or(z.literal("")),
  source: optionalTrimmed(120),
});

export type ProjectInquiryInput = z.infer<typeof projectInquirySchema>;

/** Values as they exist in the form before submission (consent is a boolean checkbox). */
export type ProjectInquiryFormValues = Omit<ProjectInquiryInput, "consent"> & { consent: boolean };

export const projectInquiryDefaults: ProjectInquiryFormValues = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  projectName: "",
  service: "" as unknown as ProjectInquiryInput["service"],
  industry: "",
  description: "",
  stage: "",
  budget: "",
  timeline: "",
  consent: false,
  website: "",
  startedAt: "",
  source: "website:start-a-project",
};
