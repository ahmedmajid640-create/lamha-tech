import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/server/auth";
import { can } from "@/lib/server/rbac";
import { getPrisma } from "@/lib/server/db";
import { addNoteAction, assignInquiryAction, updateInquiryStatusAction } from "@/app/admin/actions";
import { ActionForm, NoteForm } from "@/components/admin/Forms";
import { Card, Dl, Empty, INQUIRY_STATUSES, PageHeader, StatusBadge, fmtDate } from "@/components/admin/ui";
import { ActivityList } from "@/components/admin/Activity";

export const metadata: Metadata = { title: "Inquiry" };

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const prisma = getPrisma();
  const inquiry = await prisma.projectInquiry.findUnique({ where: { id }, include: { attachments: true, assignedTo: { select: { id: true, name: true } } } });
  if (!inquiry) notFound();

  const [notes, activity, team] = await Promise.all([
    prisma.note.findMany({ where: { entityType: "INQUIRY", entityId: id }, orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } }),
    prisma.auditLog.findMany({ where: { entityType: "inquiry", entityId: id }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.user.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const canDownload = can(user.role, "files:download");
  const canUpdate = can(user.role, "status:update");
  const canAssign = can(user.role, "assign");
  const canNote = can(user.role, "notes:add");

  return (
    <>
      <PageHeader
        title={inquiry.projectName || inquiry.fullName}
        description={`${inquiry.fullName} · ${inquiry.company} · received ${fmtDate(inquiry.createdAt)}`}
        actions={
          <>
            <StatusBadge status={inquiry.status} />
            <Link href="/admin/inquiries" className="text-sm text-blue hover:underline">
              ← All inquiries
            </Link>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card title="Requester">
            <Dl
              items={[
                { label: "Full name", value: inquiry.fullName },
                { label: "Company", value: inquiry.company },
                { label: "Email", value: <a className="text-blue hover:underline" href={`mailto:${inquiry.email}`}>{inquiry.email}</a> },
                { label: "Phone", value: inquiry.phone ? <a className="text-blue hover:underline" href={`tel:${inquiry.phone}`}>{inquiry.phone}</a> : "—" },
                { label: "Country", value: inquiry.country },
                { label: "Consent", value: inquiry.consent ? "Given" : "Not given" },
              ]}
            />
          </Card>
          <Card title="Project">
            <Dl
              items={[
                { label: "Project name", value: inquiry.projectName },
                { label: "Service", value: inquiry.service },
                { label: "Industry", value: inquiry.industry },
                { label: "Stage", value: inquiry.stage },
                { label: "Budget", value: inquiry.budget },
                { label: "Timeline", value: inquiry.timeline },
              ]}
            />
            <div className="mt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Description</p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-900">{inquiry.description}</p>
            </div>
          </Card>
          <Card title={`Attachments (${inquiry.attachments.length})`}>
            {inquiry.attachments.length === 0 ? (
              <Empty>No files were attached.</Empty>
            ) : (
              <ul className="divide-y divide-slate-100">
                {inquiry.attachments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{a.originalName}</p>
                      <p className="text-xs text-slate-500">
                        {a.mimeType} · {(a.size / 1024).toFixed(0)} KB · {a.storageProvider}
                      </p>
                    </div>
                    {canDownload ? (
                      <a href={`/admin/api/file?kind=attachment&id=${a.id}`} className="whitespace-nowrap text-blue hover:underline">
                        Download
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">No download permission</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title={`Internal notes (${notes.length})`}>
            {canNote ? <NoteForm action={addNoteAction} entityType="INQUIRY" entityId={inquiry.id} /> : <p className="text-xs text-slate-500">Your role can read notes but not add them.</p>}
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
            {canUpdate ? (
              <ActionForm action={updateInquiryStatusAction} hidden={{ id: inquiry.id }} label="Pipeline status" select={{ name: "status", defaultValue: inquiry.status, options: INQUIRY_STATUSES.map((s) => ({ value: s, label: s })) }} submitLabel="Update" />
            ) : (
              <p className="text-sm text-slate-600">
                Current: <StatusBadge status={inquiry.status} />
              </p>
            )}
          </Card>
          <Card title="Owner">
            {canAssign ? (
              <ActionForm action={assignInquiryAction} hidden={{ id: inquiry.id }} label="Assigned to" select={{ name: "assigneeId", defaultValue: inquiry.assignedToId ?? "", options: [{ value: "", label: "Unassigned" }, ...team.map((t) => ({ value: t.id, label: t.name }))] }} submitLabel="Assign" />
            ) : (
              <p className="text-sm text-slate-600">{inquiry.assignedTo?.name ?? "Unassigned"}</p>
            )}
          </Card>
          <Card title="Metadata">
            <Dl
              items={[
                { label: "Record ID", value: <span className="font-mono text-xs">{inquiry.id}</span> },
                { label: "Source", value: inquiry.source },
                { label: "Notified", value: inquiry.notifiedAt ? fmtDate(inquiry.notifiedAt) : "Not sent" },
                { label: "Updated", value: fmtDate(inquiry.updatedAt) },
                { label: "Locale", value: inquiry.locale ?? "—" },
                { label: "Referer", value: inquiry.referer ? <span className="break-all text-xs">{inquiry.referer}</span> : "—" },
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
