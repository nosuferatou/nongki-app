"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function createEvent(
  formData: FormData,
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "You must be signed in as an admin." };
  }

  const readRequiredString = (field: string) => {
    const value = formData.get(field);
    return typeof value === "string" ? value.trim() : "";
  };

  const title = readRequiredString("title");
  const eventDateValue = readRequiredString("eventDate");
  const endDateValue = readRequiredString("endDate");
  const locationName = readRequiredString("locationName");
  const locationUrl = readRequiredString("locationUrl");
  const maxGuestsValue = readRequiredString("maxGuests");
  const descriptionValue = formData.get("description");
  const notesValue = formData.get("notes");

  if (!title || !eventDateValue || !endDateValue || !locationName || !locationUrl) {
    return { success: false, error: "Please complete all required fields." };
  }

  try {
    const parsedLocationUrl = new URL(locationUrl);
    if (
      !/^https?:\/\//i.test(locationUrl) ||
      (parsedLocationUrl.protocol !== "http:" &&
        parsedLocationUrl.protocol !== "https:") ||
      !parsedLocationUrl.hostname
    ) {
      return {
        success: false,
        error: "Location URL must be a valid http:// or https:// web address.",
      };
    }
  } catch {
    return {
      success: false,
      error: "Location URL must be a valid http:// or https:// web address.",
    };
  }

  const eventDate = new Date(eventDateValue);
  const endDate = new Date(endDateValue);
  if (Number.isNaN(eventDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return { success: false, error: "Please provide valid start and end dates." };
  }
  if (endDate < eventDate) {
    return { success: false, error: "End date and time must be after the start." };
  }

  if (!/^\d+$/.test(maxGuestsValue)) {
    return { success: false, error: "Maximum guests must be a positive number." };
  }

  const maxGuests = Number(maxGuestsValue);
  if (!Number.isSafeInteger(maxGuests) || maxGuests < 1) {
    return { success: false, error: "Maximum guests must be a positive number." };
  }

  if (
    (descriptionValue !== null && typeof descriptionValue !== "string") ||
    (notesValue !== null && typeof notesValue !== "string")
  ) {
    return { success: false, error: "Invalid event details." };
  }

  try {
    const event = await prisma.event.create({
      data: {
        title,
        eventDate,
        endDate,
        locationName,
        locationUrl,
        description:
          typeof descriptionValue === "string"
            ? descriptionValue.trim() || null
            : null,
        maxGuests,
        notes:
          typeof notesValue === "string" ? notesValue.trim() || null : null,
      },
      select: { id: true },
    });

    revalidatePath("/");
    revalidatePath("/events");
    return { success: true, eventId: event.id };
  } catch (error) {
    console.error("Failed to create event.", error);
    return {
      success: false,
      error: "Unable to create event. Please try again.",
    };
  }
}

export async function updateEvent(
  formData: FormData,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "You must be signed in as an admin." };
  }

  const readRequiredString = (field: string) => {
    const value = formData.get(field);
    return typeof value === "string" ? value.trim() : "";
  };

  const id = readRequiredString("eventId");
  const title = readRequiredString("title");
  const eventDateValue = readRequiredString("eventDate");
  const endDateValue = readRequiredString("endDate");
  const locationName = readRequiredString("locationName");
  const locationUrl = readRequiredString("locationUrl");
  const maxGuestsValue = readRequiredString("maxGuests");
  const descriptionValue = formData.get("description");
  const notesValue = formData.get("notes");

  if (
    !id ||
    !title ||
    !eventDateValue ||
    !endDateValue ||
    !locationName ||
    !locationUrl
  ) {
    return { success: false, error: "Please complete all required fields." };
  }

  try {
    const parsedLocationUrl = new URL(locationUrl);
    if (
      !/^https?:\/\//i.test(locationUrl) ||
      (parsedLocationUrl.protocol !== "http:" &&
        parsedLocationUrl.protocol !== "https:") ||
      !parsedLocationUrl.hostname
    ) {
      return {
        success: false,
        error: "Location URL must be a valid http:// or https:// web address.",
      };
    }
  } catch {
    return {
      success: false,
      error: "Location URL must be a valid http:// or https:// web address.",
    };
  }

  const eventDate = new Date(eventDateValue);
  const endDate = new Date(endDateValue);
  if (Number.isNaN(eventDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return { success: false, error: "Please provide valid start and end dates." };
  }
  if (endDate < eventDate) {
    return { success: false, error: "End date and time must be after the start." };
  }
  if (!/^\d+$/.test(maxGuestsValue)) {
    return { success: false, error: "Maximum guests must be a positive number." };
  }

  const maxGuests = Number(maxGuestsValue);
  if (!Number.isSafeInteger(maxGuests) || maxGuests < 1) {
    return { success: false, error: "Maximum guests must be a positive number." };
  }
  if (
    (descriptionValue !== null && typeof descriptionValue !== "string") ||
    (notesValue !== null && typeof notesValue !== "string")
  ) {
    return { success: false, error: "Invalid event details." };
  }

  try {
    await prisma.event.update({
      where: { id },
      data: {
        title,
        eventDate,
        endDate,
        locationName,
        locationUrl,
        description:
          typeof descriptionValue === "string"
            ? descriptionValue.trim() || null
            : null,
        maxGuests,
        notes:
          typeof notesValue === "string" ? notesValue.trim() || null : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath(`/event/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update event.", error);
    return { success: false, error: "Unable to update event. Please try again." };
  }
}

export async function getRecentEvents() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Admin authentication is required to view events.");
  }

  return prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      eventDate: true,
      endDate: true,
      locationName: true,
    },
  });
}

// Untuk toggle buka/tutup RSVP
export async function toggleEventStatus(eventId: string, currentStatus: boolean) {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "You must be signed in as an admin." };
  }

  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { isClosed: !currentStatus },
    });
    revalidatePath(`/event/${eventId}`);
    revalidatePath(`/invite/${eventId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update event RSVP status.", error);
    return { success: false, error: "Gagal mengubah status event" };
  }
}

// Untuk menghapus event
export async function deleteEvent(eventId: string) {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "You must be signed in as an admin." };
  }

  try {
    // Hapus tamunya dulu (cascade delete atau manual)
    await prisma.guest.deleteMany({ where: { eventId } });
    // Hapus event-nya
    await prisma.event.delete({ where: { id: eventId } });
    revalidatePath("/");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event.", error);
    return { success: false, error: "Gagal menghapus event" };
  }
}