"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  inviteMemberAction,
  removeMemberAction,
  updateMemberRoleAction,
  updateWorkspaceNameAction,
} from "@/modules/workspaces/actions";

type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

interface Member {
  userId: string;
  role: WorkspaceRole;
  name: string | null;
  email: string;
  image: string | null;
}

interface WorkspaceSettingsProps {
  workspace: { id: string; name: string };
  members: Member[];
  currentUserId: string;
  currentUserRole: WorkspaceRole;
}

const renameSchema = z.object({ name: z.string().trim().min(2).max(100) });
const inviteSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  role: z.enum(["ADMIN", "MEMBER"]),
});

export function WorkspaceSettings({
  workspace,
  members,
  currentUserId,
  currentUserRole,
}: WorkspaceSettingsProps) {
  const canManage = currentUserRole === "OWNER" || currentUserRole === "ADMIN";
  const isOwner = currentUserRole === "OWNER";

  return (
    <div className="flex flex-col gap-6">
      <RenameCard workspace={workspace} disabled={!canManage} />
      <Card>
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <CardDescription>People with access to this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {canManage && <InviteForm workspaceId={workspace.id} />}
          <ul className="flex flex-col gap-3">
            {members.map((member) => (
              <li key={member.userId} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={member.image ?? undefined} alt={member.name ?? ""} />
                    <AvatarFallback>
                      {(member.name ?? member.email).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">
                      {member.name ?? member.email}
                      {member.userId === currentUserId && (
                        <span className="text-muted-foreground"> (you)</span>
                      )}
                    </p>
                    <p className="text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isOwner && member.role !== "OWNER" ? (
                    <RoleSelect workspaceId={workspace.id} member={member} />
                  ) : (
                    <Badge variant="secondary">{member.role}</Badge>
                  )}
                  {isOwner && member.role !== "OWNER" && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemove(workspace.id, member.userId)}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

async function handleRemove(workspaceId: string, memberUserId: string) {
  const result = await removeMemberAction({ workspaceId, memberUserId });
  if (!result.success) {
    toast.error(result.error);
    return;
  }
  toast.success("Member removed.");
}

function RenameCard({
  workspace,
  disabled,
}: {
  workspace: { id: string; name: string };
  disabled: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof renameSchema>>({
    resolver: zodResolver(renameSchema),
    defaultValues: { name: workspace.name },
  });

  async function onSubmit(data: z.infer<typeof renameSchema>) {
    const result = await updateWorkspaceNameAction({ workspaceId: workspace.id, ...data });
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Workspace updated.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace</CardTitle>
        <CardDescription>This name appears across your dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-3" noValidate>
          <Field className="flex-1" data-invalid={!!errors.name}>
            <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
            <Input id="workspace-name" disabled={disabled} {...register("name")} />
            <FieldError errors={[errors.name]} />
          </Field>
          <Button type="submit" disabled={disabled || isSubmitting}>
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function InviteForm({ workspaceId }: { workspaceId: string }) {
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", role: "MEMBER" },
  });

  async function onSubmit(data: z.infer<typeof inviteSchema>) {
    const result = await inviteMemberAction({ workspaceId, ...data, role });
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Member added.");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-2" noValidate>
      <FieldGroup className="flex-1">
        <Field data-invalid={!!errors.email}>
          <Input placeholder="teammate@email.com" {...register("email")} />
          <FieldError errors={[errors.email]} />
        </Field>
      </FieldGroup>
      <Select
        value={role}
        onValueChange={(value) => value && setRole(value as "ADMIN" | "MEMBER")}
      >
        <SelectTrigger className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="MEMBER">Member</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isSubmitting}>
        Invite
      </Button>
    </form>
  );
}

function RoleSelect({ workspaceId, member }: { workspaceId: string; member: Member }) {
  async function handleChange(value: string | null) {
    if (!value) return;
    const result = await updateMemberRoleAction({
      workspaceId,
      memberUserId: member.userId,
      role: value as "ADMIN" | "MEMBER",
    });
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Role updated.");
  }

  return (
    <Select defaultValue={member.role} onValueChange={handleChange}>
      <SelectTrigger size="sm" className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="MEMBER">Member</SelectItem>
        <SelectItem value="ADMIN">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
