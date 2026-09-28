import "server-only";
import type { Job } from "@/data/jobs";
import { getPrisma, isDatabaseConfigured } from "./db";
import { FileRepository, type ApplicationRecord, type ContactRecord, type LeadRecord } from "./storage";

/**
 * Persistence facade used by the API routes.
 *
 *   DATABASE_URL set  -> PostgreSQL via Prisma (production)
 *   otherwise         -> JSON files under DATA_DIR (development fallback)
 *
 * Routes only ever call these functions, so the backend can change without touching them.
 */
export type Backend = "postgres" | "file";

export function getBackend(): Backend {
  return isDatabaseConfigured() ? "postgres" : "file";
}

export type NotifiableKind = "lead" | "application" | "contact";

export interface Repositories {
  backend: Backend;
  createLead(record: LeadRecord): Promise<{ id: string }>;
  /** Same email + same content within the window: returns the earlier record id (double-click / retry protection). */
  findRecentDuplicate(kind: NotifiableKind, email: string, fingerprint: string, windowMs: number): Promise<string | null>;
  createContact(record: ContactRecord): Promise<{ id: string }>;
  /** Ensures the job exists (Postgres) and returns its database id, or null on the file backend. */
  ensureJob(job: Job): Promise<string | null>;
  createApplication(record: ApplicationRecord): Promise<{ id: string }>;
  markNotified(kind: NotifiableKind, id: string): Promise<void>;
}

/* ------------------------------------------------------------------ */
/* File backend                                                         */
/* ------------------------------------------------------------------ */
const fileLeads = new FileRepository<LeadRecord>("leads");
const fileApplications = new FileRepository<ApplicationRecord>("applications");
const fileContacts = new FileRepository<ContactRecord>("contacts");

function fp(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

const fileRepositories: Repositories = {
  backend: "file",
  async findRecentDuplicate(kind, email, fingerprint, windowMs) {
    const since = Date.now() - windowMs;
    if (kind === "lead") {
      const hit = (await fileLeads.list()).find((r) => r.email === email && fp(r.description) === fp(fingerprint) && Date.parse(r.createdAt) > since);
      return hit?.id ?? null;
    }
    if (kind === "contact") {
      const hit = (await fileContacts.list()).find((r) => r.email === email && fp(r.message) === fp(fingerprint) && Date.parse(r.createdAt) > since);
      return hit?.id ?? null;
    }
    const hit = (await fileApplications.list()).find((r) => r.email === email && r.roleSlug === fingerprint && Date.parse(r.createdAt) > since);
    return hit?.id ?? null;
  },
  async createLead(record) {
    const saved = await fileLeads.create(record);
    return { id: saved.id };
  },
  async createContact(record) {
    const saved = await fileContacts.create(record);
    return { id: saved.id };
  },
  async ensureJob() {
    return null;
  },
  async createApplication(record) {
    const saved = await fileApplications.create(record);
    return { id: saved.id };
  },
  async markNotified() {
    /* no-op for the development backend */
  },
};

/* ------------------------------------------------------------------ */
/* Postgres (Prisma) backend                                            */
/* ------------------------------------------------------------------ */
const upper = <T extends string>(s: T) => s.toUpperCase();

const prismaRepositories: Repositories = {
  backend: "postgres",

  async findRecentDuplicate(kind, email, fingerprint, windowMs) {
    const prisma = getPrisma();
    const since = new Date(Date.now() - windowMs);
    if (kind === "lead") {
      const hit = await prisma.projectInquiry.findFirst({ where: { email, description: fingerprint, createdAt: { gt: since } }, select: { id: true }, orderBy: { createdAt: "desc" } });
      return hit?.id ?? null;
    }
    if (kind === "contact") {
      const hit = await prisma.contactMessage.findFirst({ where: { email, message: fingerprint, createdAt: { gt: since } }, select: { id: true }, orderBy: { createdAt: "desc" } });
      return hit?.id ?? null;
    }
    const hit = await prisma.jobApplication.findFirst({ where: { email, roleSlug: fingerprint, createdAt: { gt: since } }, select: { id: true }, orderBy: { createdAt: "desc" } });
    return hit?.id ?? null;
  },

  async createLead(record) {
    const prisma = getPrisma();
    const created = await prisma.projectInquiry.create({
      data: {
        id: record.id,
        fullName: record.fullName,
        company: record.company,
        email: record.email,
        phone: record.phone,
        country: record.country,
        projectName: record.projectName,
        service: record.service,
        industry: record.industry,
        description: record.description,
        stage: record.stage,
        budget: record.budget,
        timeline: record.timeline,
        consent: record.consent,
        source: record.source,
        status: upper(record.status) as "NEW",
        userAgent: record.meta.userAgent,
        referer: record.meta.referer,
        locale: record.meta.locale,
        crmId: record.integrations.crmId ?? null,
        linkedOutId: record.integrations.linkedOutId ?? null,
        dialerId: record.integrations.dialerId ?? null,
        createdAt: new Date(record.createdAt),
        attachments: {
          create: record.attachments.map((a) => ({
            originalName: a.originalName,
            storageProvider: a.provider,
            storageKey: a.key,
            url: a.url,
            size: a.size,
            mimeType: a.mimeType,
          })),
        },
      },
      select: { id: true },
    });
    return created;
  },

  async createContact(record) {
    const prisma = getPrisma();
    return prisma.contactMessage.create({
      data: {
        id: record.id,
        name: record.name,
        email: record.email,
        topic: record.topic,
        message: record.message,
        consent: record.consent,
        source: record.source,
        status: upper(record.status) as "NEW",
        userAgent: record.meta.userAgent,
        referer: record.meta.referer,
        createdAt: new Date(record.createdAt),
      },
      select: { id: true },
    });
  },

  async ensureJob(job) {
    const prisma = getPrisma();
    const data = {
      title: job.title,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      summary: job.summary,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      niceToHave: job.niceToHave,
      benefits: job.benefits,
      status: upper(job.status) as "OPEN",
    };
    const row = await prisma.job.upsert({
      where: { slug: job.slug },
      create: { slug: job.slug, ...data },
      update: data,
      select: { id: true },
    });
    return row.id;
  },

  async createApplication(record) {
    const prisma = getPrisma();
    return prisma.jobApplication.create({
      data: {
        id: record.id,
        jobId: record.jobId,
        roleSlug: record.roleSlug,
        roleTitle: record.role,
        name: record.name,
        email: record.email,
        phone: record.phone,
        portfolio: record.portfolio,
        linkedin: record.linkedin,
        github: record.github,
        coverLetter: record.coverLetter,
        cvOriginalName: record.cv?.originalName ?? null,
        cvStorageProvider: record.cv?.provider ?? null,
        cvStorageKey: record.cv?.key ?? null,
        cvUrl: record.cv?.url ?? null,
        cvSize: record.cv?.size ?? null,
        cvMimeType: record.cv?.mimeType ?? null,
        consent: record.consent,
        source: record.source,
        status: upper(record.status) as "NEW",
        userAgent: record.meta.userAgent,
        referer: record.meta.referer,
        createdAt: new Date(record.createdAt),
      },
      select: { id: true },
    });
  },

  async markNotified(kind, id) {
    const prisma = getPrisma();
    const data = { notifiedAt: new Date() };
    if (kind === "lead") await prisma.projectInquiry.update({ where: { id }, data });
    else if (kind === "contact") await prisma.contactMessage.update({ where: { id }, data });
    else await prisma.jobApplication.update({ where: { id }, data });
  },
};

export function getRepositories(): Repositories {
  return getBackend() === "postgres" ? prismaRepositories : fileRepositories;
}
