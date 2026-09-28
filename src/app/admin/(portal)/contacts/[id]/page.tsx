import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/server/auth";
import { can } from "@/lib/server/rbac";
import { getPrisma } from "@/lib/server/db";
import { addNoteAction, updateContactStatusAction } from "@/app/admin/actions";
import { ActionForm, NoteForm } from "@/components/admin/Forms";
import { CONTACT_STATUSES, Card, Dl, PageHeader, StatusBadge, fmtDate } from "@/components/admin/ui";
import { ActivityList } from "@/components/admin/Activity";

export const metadata: Metadata = { title: "Contact message" };

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const prisma = getPrisma();
  const msg = await prisma.contactMessage.findUnique({ where: { id } });
  if (!msg) notFound();
  const [notes, activity] = await Promise.all([
    prisma.note.findMany({ where: { entityType: "CONTACT", entityId: id }, orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } }),
    prisma.auditLog.findMany({ where: { entityType: "contact", entityId: id }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  return (
    <>
      <PageHeader
        title={msg.topic}
        description={`${msg.name} · received ${fmtDate(msg.createdAt)}`}
        actions={
          <>
            <StatusBadge status={msg.status} />
            <Link href="/admin/contacts" className="text-sm text-blue hover:underline">
              ← All messages
            </Link>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card title="Message">
            <Dl
              items={[
                { label: "Name", value: msg.name },
                { label: "Email", value: <a className="text-blue hover:underline" href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.topic)}`}>{msg.email}</a> },
                { label: "Topic", value: msg.topic },
                { label: "Consent", value: msg.consent ? "Given" : "Not given" },
              ]}
            />
            <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-slate-900">{msg.message}</p>
          </Card>
          <Card title={`Internal notes (${notes.length})`}>
            {can(user.role, "notes:add") ? <NoteForm action={addNoteAction} entityType="CONTACT" entityId={msg.id} /> : <p className="text-xs text-slate-500">Your role can read notes but not add them.</p>}
            {notes.length > 0 && (
              <ul className="mt-5 space-y-3">
                {notes.map((n) => (
                  <li key={n.id} className="rounded border border-slate-100 bg-slate-50 p-3">
                    <p className="whitespace-pre-wrap text-sm text-slate-900">{n.body}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {n.author?.name ?? "Former user"} · {fmtDate(n.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Status">
            {can(user.role, "status:update") ? (
              <ActionForm action={updateContactStatusAction} hidden={{ id: msg.id }} label="Status" select={{ name: "status", defaultValue: msg.status, options: CONTACT_STATUSES.map((s) => ({ value: s, label: s })) }} submitLabel="Update" />
            ) : (
              <StatusBadge status={msg.status} />
            )}
          </Card>
          <Card title="Metadata">
            <Dl
              items={[
                { label: "Record ID", value: <span className="font-mono text-xs">{msg.id}</span> },
                { label: "Source", value: msg.source },
                { label: "Notified", value: msg.notifiedAt ? fmtDate(msg.notifiedAt) : "Not sent" },
                { label: "Updated", value: fmtDate(msg.updatedAt) },
              ]}
            />
          </Card>
          <Card title="Activity">
            <ActivityList entries={activity} />
          </Card>
        </div>
      </div>
    </>
  );
}
