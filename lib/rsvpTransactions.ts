import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function lockEventForRsvp(
  transaction: Prisma.TransactionClient,
  eventId: string,
): Promise<boolean> {
  const rows = await transaction.$queryRaw<Array<{ id: string }>>`
    SELECT "id" FROM "Event" WHERE "id" = ${eventId} FOR UPDATE
  `;
  return rows.length > 0;
}

export async function promoteNextWaitlistedGuest(
  transaction: Prisma.TransactionClient,
  eventId: string,
): Promise<string | null> {
  const event = await transaction.event.findUnique({
    where: { id: eventId },
    select: { maxGuests: true },
  });
  if (!event) return null;

  const attendingCount = await transaction.guest.count({
    where: { eventId, status: "ATTENDING" },
  });
  if (attendingCount >= event.maxGuests) return null;

  const nextGuest = await transaction.guest.findFirst({
    where: { eventId, status: "WAITLISTED" },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: { id: true },
  });
  if (!nextGuest) return null;

  const promotion = await transaction.guest.updateMany({
    where: { id: nextGuest.id, status: "WAITLISTED" },
    data: { status: "ATTENDING" },
  });
  if (promotion.count !== 1) {
    throw new Error("Waitlisted guest status changed during promotion.");
  }

  return nextGuest.id;
}

export async function withEventRsvpLock<T>(
  eventId: string,
  operation: (transaction: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (transaction) => {
    const eventExists = await lockEventForRsvp(transaction, eventId);
    if (!eventExists) throw new Error("EVENT_NOT_FOUND");
    return operation(transaction);
  });
}
