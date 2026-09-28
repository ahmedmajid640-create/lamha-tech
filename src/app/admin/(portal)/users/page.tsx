import type { Metadata } from "next";
import { requirePermission } from "@/lib/server/auth";
import { ROLE_LABEL, assignableRoles, roleRank } from "@/lib/server/rbac";
import { getPrisma } from "@/lib/server/db";
import { createUserAction, resetUserPasswordAction, setUserActiveAction, updateUserRoleAction } from "@/app/admin/actions";
import { ActionForm, FieldsForm } from "@/components/admin/Forms";
import { Card, PageHeader, RoleBadge, Td, Th, fmtDate } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const actor = await requirePermission("users:manage");
  const users = await getPrisma().user.findMany({ orderBy: [{ role: "asc" }, { createdAt: "asc" }], select: { id: true, email: true, name: true, role: true, active: true, mustChangePassword: true, lastLoginAt: true, createdAt: true, _count: { select: { assignedInquiries: true } } } });
  const roles = assignableRoles(actor.role);

  return (
    <>
      <PageHeader title="Users & roles" description="Owner: full control. Admin: manage users below Admin, all records, audit log. Manager: update statuses, assign, export. Staff: notes and file access. Viewer: read-only." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Team" className="xl:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Last sign-in</Th>
                  <Th>Manage</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const self = u.id === actor.id;
                  const editable = !self && (actor.role === "OWNER" || roleRank(u.role) < roleRank(actor.role));
                  return (
                    <tr key={u.id}>
                      <Td>
                        <p className="font-medium text-slate-900">
                          {u.name} {self && <span className="text-xs text-slate-400">(you)</span>}
                        </p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </Td>
                      <Td>
                        <RoleBadge role={u.role} />
                      </Td>
                      <Td className="text-xs">
                        {u.active ? <span className="text-emerald-700">Active</span> : <span className="text-rose-700">Deactivated</span>}
                        {u.mustChangePassword && <div className="text-amber-700">Must change password</div>}
                      </Td>
                      <Td className="whitespace-nowrap text-xs text-slate-500">{u.lastLoginAt ? fmtDate(u.lastLoginAt) : "Never"}</Td>
                      <Td>
                        {editable ? (
                          <div className="space-y-2">
                            <ActionForm action={updateUserRoleAction} hidden={{ id: u.id }} select={{ name: "role", defaultValue: u.role, options: roles.map((r) => ({ value: r, label: ROLE_LABEL[r] })) }} submitLabel="Set role" variant="ghost" />
                            <div className="flex flex-wrap gap-2">
                              <ActionForm action={setUserActiveAction} hidden={{ id: u.id, active: u.active ? "false" : "true" }} submitLabel={u.active ? "Deactivate" : "Reactivate"} variant="ghost" confirm={u.active ? `Deactivate ${u.email}? Their sessions end immediately.` : undefined} />
                              <ActionForm action={resetUserPasswordAction} hidden={{ id: u.id }} submitLabel="Reset password" variant="ghost" confirm={`Issue a new temporary password for ${u.email}?`} />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">{self ? "Use Account to change your password" : "Not editable at your level"}</span>
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Invite a team member">
          <p className="mb-4 text-xs text-slate-500">A temporary password is generated and shown once. Share it through a secure channel; the user must change it at first sign-in.</p>
          <FieldsForm
            action={createUserAction}
            submitLabel="Create user"
            fields={[
              { name: "name", label: "Full name", required: true, minLength: 2 },
              { name: "email", label: "Work email", type: "email", required: true, autoComplete: "off" },
              { name: "role", label: "Role", options: roles.filter((r) => r !== "OWNER").map((r) => ({ value: r, label: ROLE_LABEL[r] })), defaultValue: "STAFF" },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
