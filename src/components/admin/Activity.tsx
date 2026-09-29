import type { AuditLog } from "@prisma/client";
import { Empty, fmtDate } from "./ui";

export function describeAction(e: Pick<AuditLog, "action" | "details">): string {
  const d = (e.details ?? {}) as Record<string, unknown>;
  switch (e.action) {
    case "inquiry.status_changed":
    case "application.status_changed":
    case "contact.status_changed":
      return `Status ${String(d.from)} → ${String(d.to)}`;
    case "inquiry.assigned":
    case "application.assigned":
      return d.to ? "Assigned" : "Unassigned";
    case "note.added":
      return "Note added";
    case "reply.sent":
      return `Email sent to ${String(d.to ?? "recipient")}`;
    case "reply.failed":
      return `Email to ${String(d.to ?? "recipient")} failed: ${String(d.error ?? "unknown error")}`;
    case "file.downloaded":
      return `Downloaded ${String(d.name ?? "file")}`;
    case "export.created":
      return `Exported ${String(d.rows ?? "")} rows`;
    case "auth.login":
      return "Signed in";
    case "auth.login_failed":
      return "Failed sign-in";
    case "auth.logout":
      return "Signed out";
    case "auth.password_changed":
      return "Password changed";
    case "user.created":
      return `User created (${String(d.role ?? "")})`;
    case "user.role_changed":
      return `Role ${String(d.from)} → ${String(d.to)}`;
    case "user.active_changed":
      return d.active ? "Reactivated" : "Deactivated";
    case "user.password_reset":
      return "Temporary password issued";
    case "setup.owner_created":
      return "Owner account created";
    case "backup.created":
      return `Backup created (${String(d.trigger ?? "")}, ${Math.round(Number(d.bytes ?? 0) / 1024)} KB)`;
    case "backup.downloaded":
      return "Backup downloaded";
    case "notification.failed":
      return `Email notification failed (${String(d.provider ?? "")}): ${String(d.error ?? "")}`;
    default:
      return e.action;
  }
}

export function ActivityList({ entries }: { entries: Pick<AuditLog, "id" | "action" | "details" | "actorEmail" | "createdAt">[] }) {
  if (entries.length === 0) return <Empty>No activity recorded yet.</Empty>;
  return (
    <ol className="space-y-3">
      {entries.map((e) => (
        <li key={e.id} className="text-sm">
          <p className="text-slate-900">{describeAction(e)}</p>
          <p className="text-xs text-slate-500">
            {e.actorEmail} · {fmtDate(e.createdAt)}
          </p>
        </li>
      ))}
    </ol>
  );
}
