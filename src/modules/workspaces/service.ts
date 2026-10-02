import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import { slugWithSuffix } from "@/lib/utils/slug";
import { createWorkspaceWithOwner, listWorkspacesForUser } from "@/modules/workspaces/repository";

export async function createDefaultWorkspaceForUser(userId: string, displayName: string) {
  const workspace = await createWorkspaceWithOwner(
    `${displayName}'s Workspace`,
    slugWithSuffix(displayName),
    userId
  );

  const freePlan = await prisma.plan.findUnique({ where: { tier: "FREE" } });
  if (freePlan) {
    const now = new Date();
    const oneYearOut = new Date(now);
    oneYearOut.setFullYear(now.getFullYear() + 1);
    await prisma.subscription.create({
      data: {
        workspaceId: workspace.id,
        planId: freePlan.id,
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: oneYearOut,
      },
    });
  }

  return workspace;
}

export async function ensureUserHasWorkspace(userId: string, displayName: string) {
  const existing = await prisma.workspaceMember.findFirst({ where: { userId } });
  if (existing) return;

  await createDefaultWorkspaceForUser(userId, displayName);
}

/**
 * Returns the workspace a dashboard session should operate on. Until a
 * workspace switcher ships, this is simply the user's oldest workspace.
 */
export const getActiveWorkspace = cache(async (userId: string) => {
  const workspaces = await listWorkspacesForUser(userId);
  return workspaces[0] ?? null;
});
