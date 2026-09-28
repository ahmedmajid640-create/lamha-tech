import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { put, del, get, list } from "@vercel/blob";

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

export type StoredObject = { key: string; size: number; uploadedAt: Date };

export interface FileStorage {
  readonly provider: StorageProvider;
  upload(args: { key: string; bytes: Uint8Array; contentType: string; originalName: string }): Promise<StoredFile>;
  delete(key: string): Promise<void>;
  /** Objects whose key starts with `prefix` (non-recursive listing is not required; returns all matches). */
  list(prefix: string): Promise<StoredObject[]>;
  /** Raw bytes of a stored object. Throws when missing. */
  read(key: string): Promise<Uint8Array>;
  /** Human-readable reference for emails/CRM (never a public download link for private files). */
  getReference(key: string): string;
}

// On serverless hosts the bundle is read-only; only /tmp is writable (and ephemeral).
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
    ? path.join("/tmp", "lamha-data")
    : path.join(process.cwd(), ".data");

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

  async list(prefix: string): Promise<StoredObject[]> {
    assertKey(prefix.replace(/\/$/, "") || "x");
    const dir = path.join(this.root, ...prefix.replace(/\/$/, "").split("/"));
    const out: StoredObject[] = [];
    const walk = async (d: string) => {
      let entries: import("node:fs").Dirent[] = [];
      try {
        entries = await fs.readdir(d, { withFileTypes: true });
      } catch {
        return;
      }
      for (const e of entries) {
        const full = path.join(d, e.name);
        if (e.isDirectory()) await walk(full);
        else {
          const st = await fs.stat(full);
          out.push({ key: path.relative(this.root, full).split(path.sep).join("/"), size: st.size, uploadedAt: st.mtime });
        }
      }
    };
    await walk(dir);
    return out;
  }

  async read(key: string): Promise<Uint8Array> {
    assertKey(key);
    return new Uint8Array(await fs.readFile(path.join(this.root, ...key.split("/"))));
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

  async list(prefix: string): Promise<StoredObject[]> {
    const out: StoredObject[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix, token: this.token, limit: 1000, cursor });
      for (const b of page.blobs) out.push({ key: b.pathname, size: b.size, uploadedAt: new Date(b.uploadedAt) });
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return out;
  }

  async read(key: string): Promise<Uint8Array> {
    assertKey(key);
    const result = await get(key, { access: "private", token: this.token, useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) throw new Error("Object not found");
    return new Uint8Array(await new Response(result.stream).arrayBuffer());
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
