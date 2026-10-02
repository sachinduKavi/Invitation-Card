import { prisma } from "@/lib/db/prisma";

export async function getWorkspaceDashboardStats(workspaceId: string) {
  const [totalInvitations, publishedInvitations, totalViews, totalRsvps, upcomingEvents] =
    await Promise.all([
      prisma.invitation.count({ where: { workspaceId, deletedAt: null } }),
      prisma.invitation.count({
        where: { workspaceId, deletedAt: null, status: "PUBLISHED" },
      }),
      prisma.invitationView.count({
        where: { invitation: { workspaceId, deletedAt: null } },
      }),
      prisma.rsvp.count({ where: { invitation: { workspaceId, deletedAt: null } } }),
      prisma.invitation.count({
        where: {
          workspaceId,
          deletedAt: null,
          eventDate: { gte: new Date() },
        },
      }),
    ]);

  return { totalInvitations, publishedInvitations, totalViews, totalRsvps, upcomingEvents };
}

export function listRecentInvitations(workspaceId: string, limit = 5) {
  return prisma.invitation.findMany({
    where: { workspaceId, deletedAt: null },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export function listUpcomingEvents(workspaceId: string, limit = 5) {
  return prisma.invitation.findMany({
    where: { workspaceId, deletedAt: null, eventDate: { gte: new Date() } },
    orderBy: { eventDate: "asc" },
    take: limit,
  });
}

export async function getWorkspaceRsvpSummary(workspaceId: string) {
  const grouped = await prisma.rsvp.groupBy({
    by: ["status"],
    where: { invitation: { workspaceId, deletedAt: null } },
    _count: { _all: true },
    _sum: { numberOfGuests: true },
  });

  const summary: Record<"ATTENDING" | "NOT_ATTENDING" | "MAYBE", number> = {
    ATTENDING: 0,
    NOT_ATTENDING: 0,
    MAYBE: 0,
  };
  let totalGuests = 0;

  for (const row of grouped) {
    summary[row.status] = row._count._all;
    if (row.status === "ATTENDING") {
      totalGuests = row._sum.numberOfGuests ?? 0;
    }
  }

  return { ...summary, totalGuests };
}
