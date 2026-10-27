"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
    (statusValue !== "ACCEPT" && statusValue !== "DECLINE")
  ) {
    return { success: false, error: "Please provide valid RSVP details." };
  }

  if (statusValue === "DECLINE" && !reason) {
    return {
      success: false,
      error: "Please include a reason when declining the invitation.",
    };
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { isClosed: true },
  });

  if (!event) {
    return { success: false, error: "This event could not be found." };
  }

  if (event.isClosed) {
    return {
      success: false,
      error: "This event is no longer accepting responses.",
    };
  }

  try {
    await prisma.guest.create({
      data: {
        eventId,
        name,
        status: statusValue,
        reason: reason || null,
      },
    });
  } catch (error) {
    console.error("Failed to submit RSVP.", error);
    return { success: false, error: "Unable to submit your RSVP. Please try again." };
  }

  revalidatePath(`/invite/${eventId}`);
  revalidatePath(`/event/${eventId}`);
  redirect(`/event/${eventId}?submitted=1&status=${statusValue}`);
}