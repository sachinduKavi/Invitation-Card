"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { requireWorkspaceRole, PermissionError } from "@/lib/permissions/permission-service";
import { prisma } from "@/lib/db/prisma";
import {
  addWorkspaceMember,
  removeWorkspaceMember,
  updateWorkspaceMemberRole,
} from "@/modules/workspaces/repository";

export type ActionResult = { success: true } | { success: false; error: string };

const renameSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().trim().min(2).max(100),
});

export async function updateWorkspaceNameAction(input: unknown): Promise<ActionResult> {
  const parsed = renameSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const user = await requireUser();
    await requireWorkspaceRole(user.id, parsed.data.workspaceId, ["OWNER", "ADMIN"]);
    await prisma.workspace.update({
      where: { id: parsed.data.workspaceId },
      data: { name: parsed.data.name },
    });
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

const inviteSchema = z.object({
  workspaceId: z.string().min(1),
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(["ADMIN", "MEMBER"]),
});

export async function inviteMemberAction(input: unknown): Promise<ActionResult> {
  const parsed = inviteSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const user = await requireUser();
    await requireWorkspaceRole(user.id, parsed.data.workspaceId, ["OWNER", "ADMIN"]);

    const invitedUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!invitedUser) {
      return {
        success: false,
        error: "No account found with that email yet. Ask them to sign up first.",
      };
    }

    const existingMembership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId: parsed.data.workspaceId, userId: invitedUser.id },
      },
    });
    if (existingMembership) {
      return { success: false, error: "This person is already a member." };
    }

    await addWorkspaceMember(parsed.data.workspaceId, invitedUser.id, parsed.data.role);
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

const memberActionSchema = z.object({
  workspaceId: z.string().min(1),
  memberUserId: z.string().min(1),
});

export async function removeMemberAction(input: unknown): Promise<ActionResult> {
  const parsed = memberActionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  try {
    const user = await requireUser();
    await requireWorkspaceRole(user.id, parsed.data.workspaceId, ["OWNER"]);

    if (user.id === parsed.data.memberUserId) {
      return { success: false, error: "You cannot remove yourself from the workspace." };
    }

    await removeWorkspaceMember(parsed.data.workspaceId, parsed.data.memberUserId);
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

const updateRoleSchema = memberActionSchema.extend({
  role: z.enum(["ADMIN", "MEMBER"]),
});

export async function updateMemberRoleAction(input: unknown): Promise<ActionResult> {
  const parsed = updateRoleSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  try {
    const user = await requireUser();
    await requireWorkspaceRole(user.id, parsed.data.workspaceId, ["OWNER"]);

    await updateWorkspaceMemberRole(
      parsed.data.workspaceId,
      parsed.data.memberUserId,
      parsed.data.role
    );
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}

function toErrorMessage(error: unknown): string {
  if (error instanceof PermissionError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}
