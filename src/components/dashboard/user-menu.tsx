"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface UserMenuProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
}

function initials(name?: string | null, email?: string | null) {
  const source = name ?? email ?? "?";
  return source.slice(0, 2).toUpperCase();
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg">
                <Avatar className="size-7 rounded-md">
                  <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
                  <AvatarFallback>{initials(user.name, user.email)}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col text-left leading-tight">
                  <span className="truncate text-sm font-medium">{user.name ?? "Account"}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
              <Settings className="size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
