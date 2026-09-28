import type { Metadata } from "next";
import { requireUser } from "@/lib/server/auth";
import { changePasswordAction } from "@/app/admin/actions";
import { FieldsForm } from "@/components/admin/Forms";
import { Card, Dl, PageHeader, RoleBadge, param } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser({ allowPasswordChange: true });
  const required = param(await searchParams, "required", 1) === "1" || user.mustChangePassword;
  return (
    <>
      <PageHeader title="Your account" description="Manage your sign-in credentials." />
      {required && user.mustChangePassword && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">You are using a temporary password. Set a new one to continue to the portal.</div>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Profile">
          <Dl
            items={[
              { label: "Name", value: user.name },
              { label: "Email", value: user.email },
              { label: "Role", value: <RoleBadge role={user.role} /> },
            ]}
          />
        </Card>
        <Card title="Change password">
          <FieldsForm
            action={changePasswordAction}
            submitLabel="Update password"
            fields={[
              { name: "current", label: "Current password", type: "password", required: true, autoComplete: "current-password" },
              { name: "password", label: "New password (12+ characters, upper, lower, number)", type: "password", required: true, minLength: 12, autoComplete: "new-password" },
              { name: "confirm", label: "Confirm new password", type: "password", required: true, minLength: 12, autoComplete: "new-password" },
            ]}
          />
          <p className="mt-3 text-xs text-slate-500">Changing your password signs out every other device.</p>
        </Card>
      </div>
    </>
  );
}
