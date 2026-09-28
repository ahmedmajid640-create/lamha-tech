import { describe, expect, it } from "vitest";
import { projectInquirySchema } from "@/lib/validation/project";
import { contactSchema } from "@/lib/validation/contact";
import { applicationSchema } from "@/lib/validation/application";

const validLead = {
  fullName: "Test Person",
  email: "Test@Example.com",
  service: "Software Development",
  description: "A sufficiently long description of the project we would like to build together.",
  consent: true,
};

describe("projectInquirySchema", () => {
  it("accepts a minimal valid inquiry and normalises email", () => {
    const r = projectInquirySchema.safeParse(validLead);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("test@example.com");
  });
  it("rejects missing consent, short description, bad email and unknown service", () => {
    const r = projectInquirySchema.safeParse({ ...validLead, consent: false, description: "short", email: "nope", service: "Blockchain" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const fields = r.error.issues.map((i) => i.path.join("."));
      expect(fields).toEqual(expect.arrayContaining(["consent", "description", "email", "service"]));
    }
  });
  it("accepts en-dash budget and timeline options", () => {
    const r = projectInquirySchema.safeParse({ ...validLead, budget: "$10k–$25k", timeline: "1–3 months" });
    expect(r.success).toBe(true);
  });
  it("rejects a filled honeypot", () => {
    expect(projectInquirySchema.safeParse({ ...validLead, website: "http://spam" }).success).toBe(false);
  });
  it("rejects phone numbers with letters", () => {
    expect(projectInquirySchema.safeParse({ ...validLead, phone: "call me" }).success).toBe(false);
  });
});

describe("contactSchema", () => {
  it("accepts a valid message", () => {
    expect(contactSchema.safeParse({ name: "Jane", email: "j@example.com", topic: "Partnership", message: "Hello there, let's talk.", consent: true }).success).toBe(true);
  });
  it("rejects an unknown topic and short message", () => {
    const r = contactSchema.safeParse({ name: "Jane", email: "j@example.com", topic: "Spam", message: "hi", consent: true });
    expect(r.success).toBe(false);
  });
});

describe("applicationSchema", () => {
  const base = { role: "QA Engineer", roleSlug: "qa-engineer", name: "Sam", email: "sam@example.com", consent: true };
  it("accepts valid https links and rejects non-URL links", () => {
    expect(applicationSchema.safeParse({ ...base, linkedin: "https://linkedin.com/in/sam" }).success).toBe(true);
    expect(applicationSchema.safeParse({ ...base, github: "not a url" }).success).toBe(false);
  });
});
