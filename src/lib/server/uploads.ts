import "server-only";
import { randomUUID } from "node:crypto";
import { getFileStorage } from "./files";
import type { StoredAttachment } from "./storage";

/**
 * Secure file validation and storage for form attachments.
 * - extension allow-list
 * - MIME allow-list (by extension) + magic-byte sniffing (PDF, legacy DOC, DOCX/zip)
 * - per-file size limit and max file count
 * - files are stored under a random key; the original name is metadata only.
 */
export type UploadRules = {
  maxFiles: number;
  maxBytesPerFile: number;
  allowedExtensions: readonly string[];
};

export type UploadError = { code: "too_many" | "too_large" | "bad_type" | "empty"; message: string; file?: string };

const MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function extensionOf(name: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(name);
  return m ? m[1].toLowerCase() : "";
}

function sniff(buf: Uint8Array): "pdf" | "doc" | "docx" | null {
  if (buf.length >= 5 && buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46 && buf[4] === 0x2d) return "pdf"; // %PDF-
  if (buf.length >= 8 && buf[0] === 0xd0 && buf[1] === 0xcf && buf[2] === 0x11 && buf[3] === 0xe0) return "doc"; // OLE compound file
  if (buf.length >= 4 && buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04) return "docx"; // PK zip
  return null;
}

function safeOriginalName(name: string): string {
  return name.replace(/[\r\n\t\\/:*?"<>|]/g, "_").slice(0, 160);
}

export type ValidatedFile = { file: File; ext: string; bytes: Uint8Array };

export async function validateFiles(files: File[], rules: UploadRules): Promise<{ ok: true; files: ValidatedFile[] } | { ok: false; error: UploadError }> {
  const real = files.filter((f) => f && typeof f.size === "number" && f.size > 0);
  if (real.length > rules.maxFiles) {
    return { ok: false, error: { code: "too_many", message: `You can attach up to ${rules.maxFiles} files.` } };
  }
  const out: ValidatedFile[] = [];
  for (const file of real) {
    const ext = extensionOf(file.name);
    if (!rules.allowedExtensions.includes(ext)) {
      return { ok: false, error: { code: "bad_type", message: `"${safeOriginalName(file.name)}" is not an allowed file type (PDF, DOC, DOCX).`, file: file.name } };
    }
    if (file.size > rules.maxBytesPerFile) {
      const mb = Math.round(rules.maxBytesPerFile / (1024 * 1024));
      return { ok: false, error: { code: "too_large", message: `"${safeOriginalName(file.name)}" exceeds the ${mb} MB limit.`, file: file.name } };
    }
    const declared = (file.type || "").toLowerCase();
    if (declared && declared !== "application/octet-stream" && declared !== MIME_BY_EXT[ext]) {
      return { ok: false, error: { code: "bad_type", message: `"${safeOriginalName(file.name)}" has an unexpected content type.`, file: file.name } };
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    const kind = sniff(bytes);
    const consistent = (ext === "pdf" && kind === "pdf") || (ext === "doc" && kind === "doc") || (ext === "docx" && kind === "docx");
    if (!consistent) {
      return { ok: false, error: { code: "bad_type", message: `"${safeOriginalName(file.name)}" does not appear to be a valid ${ext.toUpperCase()} file.`, file: file.name } };
    }
    out.push({ file, ext, bytes });
  }
  return { ok: true, files: out };
}

/** Stores validated files under `<folder>/<uuid>.<ext>` using the configured storage provider. */
export async function storeFiles(validated: ValidatedFile[], folder: string): Promise<StoredAttachment[]> {
  if (validated.length === 0) return [];
  const storage = getFileStorage();
  const safeFolder = folder.replace(/[^a-zA-Z0-9/-]/g, "").replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
  const stored: StoredAttachment[] = [];
  for (const { file, ext, bytes } of validated) {
    const key = `${safeFolder}/${randomUUID()}.${ext}`;
    const result = await storage.upload({ key, bytes, contentType: MIME_BY_EXT[ext] ?? "application/octet-stream", originalName: safeOriginalName(file.name) });
    stored.push({ originalName: result.originalName, provider: result.provider, key: result.key, url: result.url, size: result.size, mimeType: result.contentType });
  }
  return stored;
}
