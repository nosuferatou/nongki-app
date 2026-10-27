import { prisma } from "@/lib/prisma";

export async function getPublicEvents() {
  return prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      eventDate: true,
      endDate: true,
      locationName: true,
      isClosed: true,
    },
  });
}

export async function getUpcomingPublicEvents() {
  return prisma.event.findMany({
    where: { eventDate: { gte: new Date() } },
    orderBy: { eventDate: "asc" },
    select: {
      id: true,
      title: true,
      eventDate: true,
      endDate: true,
      locationName: true,
      isClosed: true,
    },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: { guests: true },
  });
}

export async function getPublicInviteEvent(id: string) {
  return prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      eventDate: true,
      endDate: true,
      locationName: true,
      locationUrl: true,
      description: true,
      notes: true,
      isClosed: true,
      guests: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          status: true,
          reason: true,
        },
      },
    },
  });
}
