import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DATA_DIR } from "./files";
import type { StorageProvider } from "./files";

/**
 * Development persistence: one JSON document per record under DATA_DIR/<collection>/.
 * Used only when DATABASE_URL is not configured (see repositories.ts).
 */
export interface Repository<T extends { id: string }> {
  create(record: Omit<T, "id"> & { id?: string }): Promise<T>;
  get(id: string): Promise<T | null>;
  list(): Promise<T[]>;
}

export { DATA_DIR };

const SAFE_ID = /^[a-zA-Z0-9-]{8,64}$/;

export class FileRepository<T extends { id: string }> implements Repository<T> {
  private dir: string;

  constructor(collection: string) {
    if (!/^[a-z-]+$/.test(collection)) throw new Error("Invalid collection name");
    this.dir = path.join(DATA_DIR, collection);
  }

  async create(record: Omit<T, "id"> & { id?: string }): Promise<T> {
    await fs.mkdir(this.dir, { recursive: true });
    const id = record.id && SAFE_ID.test(record.id) ? record.id : randomUUID();
    const full = { ...record, id } as T;
    await fs.writeFile(path.join(this.dir, `${id}.json`), JSON.stringify(full, null, 2), { encoding: "utf8", flag: "wx" });
    return full;
  }

  async get(id: string): Promise<T | null> {
    if (!SAFE_ID.test(id)) return null;
    try {
      return JSON.parse(await fs.readFile(path.join(this.dir, `${id}.json`), "utf8")) as T;
    } catch {
      return null;
    }
  }

  async list(): Promise<T[]> {
    try {
      const files = await fs.readdir(this.dir);
      return Promise.all(files.filter((f) => f.endsWith(".json")).map(async (f) => JSON.parse(await fs.readFile(path.join(this.dir, f), "utf8")) as T));
    } catch {
      return [];
    }
  }
}

/* ------------------------------------------------------------------ */
/* Record types (CRM-ready payloads shared by both backends)            */
/* ------------------------------------------------------------------ */
export type StoredAttachment = {
  originalName: string;
  provider: StorageProvider;
  key: string;
  url: string | null;
  size: number;
  mimeType: string;
};

export type LeadStatus = "new" | "qualified" | "contacted" | "proposal" | "won" | "lost" | "spam";

export type LeadRecord = {
  id: string;
  fullName: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  projectName: string | null;
  service: string;
  industry: string | null;
  description: string;
  stage: string | null;
  budget: string | null;
  timeline: string | null;
  attachments: StoredAttachment[];
  consent: true;
  source: string;
  createdAt: string;
  status: LeadStatus;
  meta: { userAgent: string | null; referer: string | null; locale: string | null };
  integrations: Record<string, string | null>;
};

export type ApplicationRecord = {
  id: string;
  jobId: string | null;
  role: string;
  roleSlug: string;
  name: string;
  email: string;
  phone: string | null;
  portfolio: string | null;
  linkedin: string | null;
  github: string | null;
  coverLetter: string | null;
  cv: StoredAttachment | null;
  consent: true;
  source: string;
  createdAt: string;
  status: "new" | "reviewing" | "interview" | "offer" | "rejected" | "hired";
  meta: { userAgent: string | null; referer: string | null };
};

export type ContactRecord = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  consent: true;
  source: string;
  createdAt: string;
  status: "new" | "replied" | "closed" | "spam";
  meta: { userAgent: string | null; referer: string | null };
};
