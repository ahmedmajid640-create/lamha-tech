import "server-only";

/**
 * Input sanitization for stored text. User content is never rendered as HTML,
 * but we still normalize it so downstream systems (CRM, email) receive clean values.
 */
export function cleanText(value: unknown, max = 5000): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // control chars (keep \t \n \r)
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim()
    .slice(0, max);
}

export function cleanLine(value: unknown, max = 200): string {
  return cleanText(value, max).replace(/\s+/g, " ");
}

export function nullable(value: string): string | null {
  return value.length ? value : null;
}

/** Convert FormData into a plain object of strings (files excluded). */
export function formDataToObject(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of fd.entries()) {
    if (typeof value === "string" && !(key in out)) out[key] = value;
  }
  return out;
}
