import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { ensureUserHasWorkspace, getActiveWorkspace } from "@/modules/workspaces/service";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser().catch(() => null);
  if (!user) {
    redirect("/login");
  }

  await ensureUserHasWorkspace(user.id, user.name ?? user.email ?? "My");
  const workspace = await getActiveWorkspace(user.id);
  if (!workspace) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar workspaceName={workspace.name} user={user} />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-6 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
