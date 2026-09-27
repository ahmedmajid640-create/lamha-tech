import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { put, del } from "@vercel/blob";

/**
 * File storage abstraction.
 *
 *   BLOB_READ_WRITE_TOKEN set  -> Vercel Blob (PRIVATE access: CVs/briefs are never public)
 *   otherwise                  -> local filesystem under DATA_DIR/uploads (development only)
 *
 * Keys are always randomized by the caller; original names are metadata only.
 */
export type StorageProvider = "local" | "vercel-blob";

export type StoredFile = {
  provider: StorageProvider;
  /** Provider-specific key/pathname. Use getReference() to describe it to humans. */
  key: string;
  /** Provider URL when one exists. Private blobs need a token to read; local files have no URL. */
  url: string | null;
  size: number;
  contentType: string;
  originalName: string;
};

export interface FileStorage {
  readonly provider: StorageProvider;
  upload(args: { key: string; bytes: Uint8Array; contentType: string; originalName: string }): Promise<StoredFile>;
  delete(key: string): Promise<void>;
  /** Human-readable reference for emails/CRM (never a public download link for private files). */
  getReference(key: string): string;
}

export const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(process.cwd(), ".data");

const SAFE_KEY = /^[a-zA-Z0-9/_.-]{1,255}$/;

function assertKey(key: string) {
  if (!SAFE_KEY.test(key) || key.includes("..")) throw new Error("Invalid storage key");
}

class LocalFileStorage implements FileStorage {
  readonly provider = "local" as const;
  private root = path.join(DATA_DIR, "uploads");

  async upload({ key, bytes, contentType, originalName }: { key: string; bytes: Uint8Array; contentType: string; originalName: string }): Promise<StoredFile> {
    assertKey(key);
    const full = path.join(this.root, ...key.split("/"));
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, bytes, { flag: "wx" });
    return { provider: "local", key, url: null, size: bytes.byteLength, contentType, originalName };
  }

  async delete(key: string): Promise<void> {
    assertKey(key);
    await fs.rm(path.join(this.root, ...key.split("/")), { force: true });
  }

  getReference(key: string): string {
    return `local:${path.relative(process.cwd(), path.join(this.root, key)).split(path.sep).join("/")}`;
  }
}

class VercelBlobStorage implements FileStorage {
  readonly provider = "vercel-blob" as const;
  constructor(private token: string) {}

  async upload({ key, bytes, contentType, originalName }: { key: string; bytes: Uint8Array; contentType: string; originalName: string }): Promise<StoredFile> {
    assertKey(key);
    const result = await put(key, Buffer.from(bytes), {
      access: "private",
      addRandomSuffix: false,
      contentType,
      token: this.token,
    });
    return { provider: "vercel-blob", key: result.pathname, url: result.url, size: bytes.byteLength, contentType, originalName };
  }

  async delete(key: string): Promise<void> {
    assertKey(key);
    await del(key, { token: this.token });
  }

  getReference(key: string): string {
    return `vercel-blob(private):${key}`;
  }
}

let cached: FileStorage | null = null;

export function getFileStorage(): FileStorage {
  if (cached) return cached;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    cached = new VercelBlobStorage(token);
  } else {
    if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
      console.warn("[files] BLOB_READ_WRITE_TOKEN is not set; uploads will use ephemeral local storage.");
    }
    cached = new LocalFileStorage();
  }
  return cached;
}
