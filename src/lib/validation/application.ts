import { z } from "zod";

/** Shared schema for job applications (careers). CV validated server-side as a file. */
const trimmed = (max: number) => z.string().trim().max(max, `Must be ${max} characters or fewer.`);
const optionalTrimmed = (max: number) => trimmed(max).optional().or(z.literal(""));
const optionalUrl = z
  .string()
  .trim()
  .max(300)
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || /^https?:\/\/[^\s]+$/i.test(v), "Please enter a valid URL starting with https://");

export const applicationSchema = z.object({
  role: trimmed(120).min(2, "Please select a role."),
  roleSlug: trimmed(120),
  name: trimmed(100).min(2, "Please enter your full name."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(254),
  phone: optionalTrimmed(40).refine((v) => !v || /^[+()0-9\s.-]{6,40}$/.test(v), "Please enter a valid phone number."),
  portfolio: optionalUrl,
  linkedin: optionalUrl,
  github: optionalUrl,
  coverLetter: optionalTrimmed(5000),
  consent: z.literal(true, { message: "Please confirm that LAMHA may contact you about your application." }),
  website: z.string().max(0).optional().or(z.literal("")),
  /** Epoch ms when the form was opened (bot dwell-time check). Optional. */
  startedAt: z.string().max(20).optional().or(z.literal("")),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ApplicationFormValues = Omit<ApplicationInput, "consent"> & { consent: boolean };

export const CV_RULES = {
  maxBytes: 10 * 1024 * 1024,
  allowedExtensions: ["pdf", "doc", "docx"] as const,
};
