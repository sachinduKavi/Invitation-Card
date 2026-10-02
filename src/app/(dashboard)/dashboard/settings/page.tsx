import { requireUser } from "@/lib/auth/session";
import { getActiveWorkspace } from "@/modules/workspaces/service";
import { listWorkspaceMembers } from "@/modules/workspaces/repository";
import { WorkspaceSettings } from "@/modules/workspaces/components/workspace-settings";

export default async function SettingsPage() {
  const user = await requireUser();
  const workspace = await getActiveWorkspace(user.id);
  if (!workspace) return null;

  const members = await listWorkspaceMembers(workspace.id);
  const currentMembership = members.find((member) => member.userId === user.id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your workspace and team.</p>
      </div>

      <WorkspaceSettings
        workspace={{ id: workspace.id, name: workspace.name }}
        members={members.map((member) => ({
          userId: member.userId,
          role: member.role,
          name: member.user.name,
          email: member.user.email,
          image: member.user.image,
        }))}
        currentUserId={user.id}
        currentUserRole={currentMembership?.role ?? "MEMBER"}
      />
    </div>
  );
}
