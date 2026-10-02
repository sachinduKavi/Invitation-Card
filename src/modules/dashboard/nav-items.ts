import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  MailOpen,
  LayoutTemplate,
  Users,
  CheckSquare,
  BarChart3,
  Image as ImageIcon,
  CreditCard,
  Settings,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Invitations", href: "/dashboard/invitations", icon: MailOpen },
  { title: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
  { title: "Guests", href: "/dashboard/guests", icon: Users },
  { title: "RSVP", href: "/dashboard/rsvp", icon: CheckSquare },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Media", href: "/dashboard/media", icon: ImageIcon },
  { title: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];
