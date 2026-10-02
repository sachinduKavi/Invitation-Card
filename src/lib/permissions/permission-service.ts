import { prisma } from "@/lib/db/prisma";
import { findWorkspaceMembership } from "@/modules/workspaces/repository";
import type { WorkspaceRole } from "@/generated/prisma/enums";

export class PermissionError extends Error {
  constructor(public readonly code: "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND", message: string) {
    super(message);
    this.name = "PermissionError";
  }
}

/**
 * Step 1-2 of the authorization chain: confirms the user belongs to the
 * workspace before any resource lookup happens. Never trust a workspaceId
 * supplied by the client without this check.
 */
export async function requireWorkspaceMembership(userId: string, workspaceId: string) {
  const membership = await findWorkspaceMembership(userId, workspaceId);
  if (!membership) {
    throw new PermissionError("FORBIDDEN", "You do not have access to this workspace.");
  }
  return membership;
}

export async function requireWorkspaceRole(
  userId: string,
  workspaceId: string,
  allowedRoles: WorkspaceRole[]
) {
  const membership = await requireWorkspaceMembership(userId, workspaceId);
  if (!allowedRoles.includes(membership.role)) {
    throw new PermissionError("FORBIDDEN", "You do not have permission to perform this action.");
  }
  return membership;
}

/**
 * Step 3 of the authorization chain: resolves an invitation's owning
 * workspace and verifies membership (and optionally role) in one call.
 * Use this instead of trusting an invitationId's workspace association
 * supplied by the client.
 */
export async function requireInvitationAccess(
  userId: string,
  invitationId: string,
  allowedRoles?: WorkspaceRole[]
) {
  const invitation = await prisma.invitation.findFirst({
    where: { id: invitationId, deletedAt: null },
    select: { id: true, workspaceId: true },
  });

  if (!invitation) {
    throw new PermissionError("NOT_FOUND", "Invitation not found.");
  }

  const membership = allowedRoles
    ? await requireWorkspaceRole(userId, invitation.workspaceId, allowedRoles)
    : await requireWorkspaceMembership(userId, invitation.workspaceId);

  return { invitation, membership };
}
