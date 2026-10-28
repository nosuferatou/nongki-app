"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  lockEventForRsvp,
  promoteNextWaitlistedGuest,
  withEventRsvpLock,
} from "@/lib/rsvpTransactions";
import { prisma } from "@/lib/prisma";

export async function submitRsvp(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  const eventIdValue = formData.get("eventId");
  const nameValue = formData.get("name");
  const statusValue = formData.get("status");
  const reasonValue = formData.get("reason");

  if (
    typeof eventIdValue !== "string" ||
    typeof nameValue !== "string" ||
    typeof statusValue !== "string" ||
    (reasonValue !== null && typeof reasonValue !== "string")
  ) {
    return { success: false, error: "Invalid RSVP details." };
  }

  const eventId = eventIdValue.trim();
  const name = nameValue.trim();
  const reason = typeof reasonValue === "string" ? reasonValue.trim() : "";

  if (
    !eventId ||
    !name ||
    (statusValue !== "ATTENDING" && statusValue !== "DECLINED")
  ) {
    return { success: false, error: "Please provide valid RSVP details." };
  }

  if (statusValue === "DECLINED" && !reason) {
    return {
      success: false,
      error: "Please include a reason when declining the invitation.",
    };
  }

  let savedStatus: "ATTENDING" | "DECLINED" | "WAITLISTED";
  try {
    savedStatus = await withEventRsvpLock(eventId, async (transaction) => {
      const event = await transaction.event.findUnique({
        where: { id: eventId },
        select: { isClosed: true, maxGuests: true },
      });
      if (!event) throw new Error("EVENT_NOT_FOUND");
      if (event.isClosed) throw new Error("EVENT_CLOSED");

      let finalStatus: "ATTENDING" | "DECLINED" | "WAITLISTED" = statusValue;
      if (statusValue === "ATTENDING") {
        const attendingCount = await transaction.guest.count({
          where: { eventId, status: "ATTENDING" },
        });
        if (attendingCount >= event.maxGuests) finalStatus = "WAITLISTED";
      }

      await transaction.guest.create({
        data: {
          eventId,
          name,
          status: finalStatus,
          reason: reason || null,
        },
      });
      return finalStatus;
    });
  } catch (error) {
    if (error instanceof Error && error.message === "EVENT_NOT_FOUND") {
      return { success: false, error: "This event could not be found." };
    }
    if (error instanceof Error && error.message === "EVENT_CLOSED") {
      return {
        success: false,
        error: "This event is no longer accepting responses.",
      };
    }
    console.error("Failed to submit RSVP.", error);
    return { success: false, error: "Unable to submit your RSVP. Please try again." };
  }

  revalidatePath(`/invite/${eventId}`);
  revalidatePath(`/event/${eventId}`);
  redirect(`/event/${eventId}?submitted=1&status=${savedStatus}`);
}

export async function adminUpdateGuestStatus(
  guestId: string,
  nextStatus: "ATTENDING" | "DECLINED",
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "You must be signed in as an admin." };
  }

  if (!guestId || (nextStatus !== "ATTENDING" && nextStatus !== "DECLINED")) {
    return { success: false, error: "Invalid guest status." };
  }

  try {
    const eventId = await prisma.$transaction(async (transaction) => {
      const guest = await transaction.guest.findUnique({
        where: { id: guestId },
        select: { eventId: true },
      });
      if (!guest) throw new Error("GUEST_NOT_FOUND");

      const locked = await lockEventForRsvp(transaction, guest.eventId);
      if (!locked) throw new Error("EVENT_NOT_FOUND");

      const currentGuest = await transaction.guest.findUnique({
        where: { id: guestId },
        select: { status: true },
      });
      if (!currentGuest) throw new Error("GUEST_NOT_FOUND");

      const event = await transaction.event.findUnique({
        where: { id: guest.eventId },
        select: { maxGuests: true },
      });
      if (!event) throw new Error("EVENT_NOT_FOUND");

      const finalStatus = nextStatus;
      if (nextStatus === "ATTENDING" && currentGuest.status !== "ATTENDING") {
        const attendingCount = await transaction.guest.count({
          where: { eventId: guest.eventId, status: "ATTENDING" },
        });
        if (attendingCount >= event.maxGuests) {
          throw new Error("EVENT_FULL");
        }
      }

      await transaction.guest.update({
        where: { id: guestId },
        data: { status: finalStatus },
      });

      if (
        currentGuest.status === "ATTENDING" &&
        finalStatus === "DECLINED"
      ) {
        await promoteNextWaitlistedGuest(transaction, guest.eventId);
      }

      return guest.eventId;
    });

    revalidatePath(`/event/${eventId}`);
    revalidatePath(`/invite/${eventId}`);
    revalidatePath(`/`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "EVENT_FULL") {
      return { success: false, error: "There are no available event spots." };
    }
    if (
      error instanceof Error &&
      (error.message === "GUEST_NOT_FOUND" || error.message === "EVENT_NOT_FOUND")
    ) {
      return { success: false, error: "This guest could not be found." };
    }
    console.error("Failed to update guest RSVP status.", error);
    return { success: false, error: "Unable to update guest status." };
  }
}

export async function adminRemoveGuest(
  guestId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "You must be signed in as an admin." };
  }

  if (!guestId) return { success: false, error: "Invalid guest." };

  try {
    const eventId = await prisma.$transaction(async (transaction) => {
      const guest = await transaction.guest.findUnique({
        where: { id: guestId },
        select: { eventId: true },
      });
      if (!guest) throw new Error("GUEST_NOT_FOUND");

      const locked = await lockEventForRsvp(transaction, guest.eventId);
      if (!locked) throw new Error("EVENT_NOT_FOUND");

      const currentGuest = await transaction.guest.findUnique({
        where: { id: guestId },
        select: { status: true },
      });
      if (!currentGuest) throw new Error("GUEST_NOT_FOUND");

      await transaction.guest.delete({ where: { id: guestId } });
      if (currentGuest.status === "ATTENDING") {
        await promoteNextWaitlistedGuest(transaction, guest.eventId);
      }
      return guest.eventId;
    });

    revalidatePath(`/event/${eventId}`);
    revalidatePath(`/invite/${eventId}`);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "GUEST_NOT_FOUND" || error.message === "EVENT_NOT_FOUND")
    ) {
      return { success: false, error: "This guest could not be found." };
    }
    console.error("Failed to remove guest.", error);
    return { success: false, error: "Unable to remove guest." };
  }
}