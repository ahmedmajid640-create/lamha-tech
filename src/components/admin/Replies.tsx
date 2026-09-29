import type { NoteEntity, Reply } from "@prisma/client";
import { sendReplyAction } from "@/app/admin/actions";
import { ReplyForm } from "./Forms";
import { Card, StatusBadge, fmtDate } from "./ui";

export type ReplyRow = Pick<Reply, "id" | "subject" | "body" | "toEmail" | "status" | "error" | "createdAt"> & { author: { name: string } | null };

/** "Reply by email" card: compose form (permission-gated) plus the thread of replies already sent from the portal. */
export function RepliesCard({ entityType, entityId, to, defaultSubject, canReply, replies }: { entityType: NoteEntity; entityId: string; to: string; defaultSubject: string; canReply: boolean; replies: ReplyRow[] }) {
  return (
    <Card title={`Email replies (${replies.length})`}>
      {canReply ? <ReplyForm action={sendReplyAction} entityType={entityType} entityId={entityId} to={to} defaultSubject={defaultSubject} /> : <p className="text-xs text-slate-500">Your role can read replies but not send them.</p>}
      {replies.length > 0 && (
        <ul className="mt-5 space-y-3">
          {replies.map((r) => (
            <li key={r.id} className="rounded border border-slate-100 bg-slate-50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">{r.subject}</p>
                <StatusBadge status={r.status} />
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">{r.body}</p>
              {r.error && <p className="mt-2 text-xs text-rose-700">Not delivered: {r.error}</p>}
              <p className="mt-2 text-xs text-slate-500">
                To {r.toEmail} · {r.author?.name ?? "Former user"} · {fmtDate(r.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
