"use server";

import { revalidatePath } from "next/cache";
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

  await prisma.guest.create({
    data: {
      eventId,
      name,
      status: statusValue,
      reason: reason || null,
    },
  });

  revalidatePath("/event/[id]", "page");
  return { success: true };
}