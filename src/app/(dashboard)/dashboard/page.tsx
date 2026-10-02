import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getActiveWorkspace } from "@/modules/workspaces/service";
import {
  getWorkspaceDashboardStats,
  getWorkspaceRsvpSummary,
  listRecentInvitations,
  listUpcomingEvents,
} from "@/modules/invitations/repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatDate(date: Date | null) {
  if (!date) return "No date set";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function DashboardPage() {
  const user = await requireUser();
  const workspace = await getActiveWorkspace(user.id);
  if (!workspace) return null;

  const [stats, recentInvitations, upcomingEvents, rsvpSummary] = await Promise.all([
    getWorkspaceDashboardStats(workspace.id),
    listRecentInvitations(workspace.id),
    listUpcomingEvents(workspace.id),
    getWorkspaceRsvpSummary(workspace.id),
  ]);

  const statCards = [
    { label: "Total Invitations", value: stats.totalInvitations },
    { label: "Published Invitations", value: stats.publishedInvitations },
    { label: "Total Views", value: stats.totalViews },
    { label: "Total RSVPs", value: stats.totalRsvps },
    { label: "Upcoming Events", value: stats.upcomingEvents },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user.name ?? user.email}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent invitations</CardTitle>
            <Button variant="ghost" size="sm" render={<Link href="/dashboard/invitations" />}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {recentInvitations.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="flex flex-col gap-3">
                {recentInvitations.map((invitation) => (
                  <li key={invitation.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{invitation.title}</p>
                      <p className="text-muted-foreground">{invitation.eventType}</p>
                    </div>
                    <Badge variant="secondary">{invitation.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming events</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="flex flex-col gap-3">
                {upcomingEvents.map((invitation) => (
                  <li key={invitation.id} className="flex items-center justify-between text-sm">
                    <p className="font-medium">{invitation.title}</p>
                    <span className="text-muted-foreground">
                      {formatDate(invitation.eventDate)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RSVP summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-semibold">{rsvpSummary.ATTENDING}</p>
                <p className="text-xs text-muted-foreground">Attending</p>
              </div>
              <div>
                <p className="text-xl font-semibold">{rsvpSummary.NOT_ATTENDING}</p>
                <p className="text-xs text-muted-foreground">Not attending</p>
              </div>
              <div>
                <p className="text-xl font-semibold">{rsvpSummary.MAYBE}</p>
                <p className="text-xs text-muted-foreground">Maybe</p>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {rsvpSummary.totalGuests} total guests confirmed
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
      <p>Nothing here yet.</p>
      <Button size="sm" render={<Link href="/dashboard/invitations/new" />}>
        Create your first invitation
      </Button>
    </div>
  );
}
