import { z } from "zod";

const trimmed = (max: number) => z.string().trim().max(max, `Must be ${max} characters or fewer.`);

export const contactTopics = ["General inquiry", "New project", "Partnership", "Careers", "Press / media", "Other"] as const;

export const contactSchema = z.object({
  name: trimmed(100).min(2, "Please enter your name."),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(254),
  topic: z.enum(contactTopics, { message: "Please choose a topic." }),
  message: trimmed(3000).min(10, "Please write at least 10 characters."),
  consent: z.literal(true, { message: "Please confirm that LAMHA may contact you." }),
  website: z.string().max(0).optional().or(z.literal("")),
  /** Epoch ms when the form was opened (bot dwell-time check). Optional. */
  startedAt: z.string().max(20).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactFormValues = Omit<ContactInput, "consent"> & { consent: boolean };
