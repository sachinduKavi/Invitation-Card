import { prisma } from "@/lib/db/prisma";
import type { WorkspaceRole } from "@/generated/prisma/enums";

export function findWorkspaceMembership(userId: string, workspaceId: string) {
  return prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });
}

export function listWorkspacesForUser(userId: string) {
  return prisma.workspace.findMany({
    where: { deletedAt: null, members: { some: { userId } } },
    include: {
      members: { where: { userId } },
      subscription: { include: { plan: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export function getWorkspaceById(workspaceId: string) {
  return prisma.workspace.findFirst({
    where: { id: workspaceId, deletedAt: null },
  });
}

export function createWorkspaceWithOwner(name: string, slug: string, ownerId: string) {
  return prisma.workspace.create({
    data: {
      name,
      slug,
      members: {
        create: { userId: ownerId, role: "OWNER" },
      },
    },
  });
}

export function addWorkspaceMember(workspaceId: string, userId: string, role: WorkspaceRole) {
  return prisma.workspaceMember.create({
    data: { workspaceId, userId, role },
  });
}

export function updateWorkspaceMemberRole(
  workspaceId: string,
  userId: string,
  role: WorkspaceRole
) {
  return prisma.workspaceMember.update({
    where: { workspaceId_userId: { workspaceId, userId } },
    data: { role },
  });
}

export function removeWorkspaceMember(workspaceId: string, userId: string) {
  return prisma.workspaceMember.delete({
    where: { workspaceId_userId: { workspaceId, userId } },
  });
}

export function listWorkspaceMembers(workspaceId: string) {
  return prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });
}
