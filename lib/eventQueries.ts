import { prisma } from "@/lib/prisma";

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
      locationName: true,
      locationUrl: true,
      description: true,
      isClosed: true,
    },
  });
}
