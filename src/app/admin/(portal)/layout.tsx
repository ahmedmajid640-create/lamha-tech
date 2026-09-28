import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/server/auth";
import { AdminShell } from "@/components/admin/Shell";

/** Every portal page requires a valid session. Pages additionally call requireUser() / requirePermission(). */
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return <AdminShell user={user}>{children}</AdminShell>;
}
