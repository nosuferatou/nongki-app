"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/actions/eventActions";

type DeleteEventButtonProps = {
  eventId: string;
};

export default function DeleteEventButton({
  eventId,
}: DeleteEventButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const result = await deleteEvent(eventId);
      if (!result.success) {
        setError(result.error ?? "Unable to delete this event. Please try again.");
        return;
      }

      router.replace("/");
    } catch (caughtError) {
      console.error("Failed to delete event.", caughtError);
      setError("Unable to delete this event. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Deleting..." : "Delete Event"}
      </button>
      {error && (
        <p role="alert" className="max-w-xs text-sm text-red-700 sm:text-right">
          {error}
        </p>
      )}
    </div>
  );
}
