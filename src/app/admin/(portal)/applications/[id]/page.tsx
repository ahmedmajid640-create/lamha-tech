import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/server/auth";
import { can } from "@/lib/server/rbac";
import { getPrisma } from "@/lib/server/db";
import { addNoteAction, assignApplicationAction, updateApplicationStatusAction } from "@/app/admin/actions";
import { ActionForm, NoteForm } from "@/components/admin/Forms";
import { APPLICATION_STATUSES, Card, Dl, PageHeader, StatusBadge, btnCls, fmtDate } from "@/components/admin/ui";
import { ActivityList } from "@/components/admin/Activity";
import { RepliesCard } from "@/components/admin/Replies";

export const metadata: Metadata = { title: "Application" };

function ext(href: string | null | undefined) {
  if (!href) return "—";
  const url = /^https?:\/\//i.test(href) ? href : `https://${href}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-blue hover:underline">
      {href}
    </a>
  );
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const prisma = getPrisma();
  const app = await prisma.jobApplication.findUnique({ where: { id }, include: { assignedTo: { select: { id: true, name: true } } } });
  if (!app) notFound();
  const [notes, activity, team, replies] = await Promise.all([
    prisma.note.findMany({ where: { entityType: "APPLICATION", entityId: id }, orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } }),
    prisma.auditLog.findMany({ where: { OR: [{ entityType: "application", entityId: id }, { entityType: "cv", entityId: id }] }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.user.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.reply.findMany({ where: { entityType: "APPLICATION", entityId: id }, orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } }),
  ]);

  return (
    <>
      <PageHeader
        title={app.name}
        description={`${app.roleTitle} · received ${fmtDate(app.createdAt)}`}
        actions={
          <>
            <StatusBadge status={app.status} />
            <Link href="/admin/applications" className="text-sm text-blue hover:underline">
              ← All applications
            </Link>
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card title="Candidate">
            <Dl
              items={[
                { label: "Name", value: app.name },
                { label: "Email", value: <a className="text-blue hover:underline" href={`mailto:${app.email}`}>{app.email}</a> },
                { label: "Phone", value: app.phone ?? "—" },
                { label: "Role applied for", value: app.roleTitle },
                { label: "Portfolio", value: ext(app.portfolio) },
                { label: "LinkedIn", value: ext(app.linkedin) },
                { label: "GitHub", value: ext(app.github) },
                { label: "Consent", value: app.consent ? "Given" : "Not given" },
              ]}
            />
            {app.coverLetter && (
              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Cover letter</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-900">{app.coverLetter}</p>
              </div>
            )}
          </Card>
          <RepliesCard entityType="APPLICATION" entityId={app.id} to={app.email} defaultSubject={`Re: your application for ${app.roleTitle} at LAMHA Technologies`} canReply={can(user.role, "reply:send")} replies={replies} />
          <Card title="CV">
            {app.cvStorageKey ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{app.cvOriginalName}</p>
                  <p className="text-xs text-slate-500">
                    {app.cvMimeType} · {app.cvSize ? `${(app.cvSize / 1024).toFixed(0)} KB` : ""} · stored privately ({app.cvStorageProvider})
                  </p>
                </div>
                {can(user.role, "files:download") ? (
                  <a href={`/admin/api/file?kind=cv&id=${app.id}`} className={btnCls}>
                    Download CV
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Your role cannot download files.</span>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No CV on file.</p>
            )}
          </Card>
          <Card title={`Internal notes (${notes.length})`}>
            {can(user.role, "notes:add") ? <NoteForm action={addNoteAction} entityType="APPLICATION" entityId={app.id} /> : <p className="text-xs text-slate-500">Your role can read notes but not add them.</p>}
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
              <ActionForm action={updateApplicationStatusAction} hidden={{ id: app.id }} label="Hiring stage" select={{ name: "status", defaultValue: app.status, options: APPLICATION_STATUSES.map((s) => ({ value: s, label: s })) }} submitLabel="Update" />
            ) : (
              <StatusBadge status={app.status} />
            )}
          </Card>
          <Card title="Owner">
            {can(user.role, "assign") ? (
              <ActionForm action={assignApplicationAction} hidden={{ id: app.id }} label="Assigned to" select={{ name: "assigneeId", defaultValue: app.assignedToId ?? "", options: [{ value: "", label: "Unassigned" }, ...team.map((t) => ({ value: t.id, label: t.name }))] }} submitLabel="Assign" />
            ) : (
              <p className="text-sm text-slate-600">{app.assignedTo?.name ?? "Unassigned"}</p>
            )}
          </Card>
          <Card title="Metadata">
            <Dl
              items={[
                { label: "Record ID", value: <span className="font-mono text-xs">{app.id}</span> },
                { label: "Source", value: app.source },
                { label: "Notified", value: app.notifiedAt ? fmtDate(app.notifiedAt) : "Not sent" },
                { label: "Updated", value: fmtDate(app.updatedAt) },
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
