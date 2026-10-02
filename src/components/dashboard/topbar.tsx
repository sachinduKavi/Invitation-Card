import Link from "next/link";
import { Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <Button render={<Link href="/dashboard/invitations/new" />} size="sm">
        <Plus />
        New invitation
      </Button>
    </header>
  );
}
