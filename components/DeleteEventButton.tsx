"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { deleteEvent } from "@/actions/eventActions";

type DeleteEventButtonProps = {
  eventId: string;
  className?: string;
  iconOnly?: boolean;
  icon?: ReactNode;
};

export default function DeleteEventButton({
  eventId,
  className,
  iconOnly = false,
  icon,
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
    <div className="relative flex flex-col items-start gap-2 sm:items-end">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        aria-label={iconOnly ? "Delete event" : undefined}
        title={iconOnly ? "Delete event" : undefined}
        className={
          className ??
          "inline-flex min-h-11 items-center justify-center rounded-xl border border-rose-600/20 px-4 py-2.5 text-sm font-semibold text-rose-700 transition-all hover:bg-rose-50 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-950/40"
        }
      >
        {iconOnly ? (
          isPending ? (
            <LoaderCircle aria-hidden="true" size={20} className="animate-spin" />
          ) : (
            icon
          )
        ) : isPending ? (
          "Deleting..."
        ) : (
          "Delete Event"
        )}
      </button>
      {error && (
        <p role="alert" className="absolute right-0 top-full z-10 mt-1 w-56 rounded-xl border border-slate-100 bg-white p-2 text-sm text-rose-700 shadow-[0_2px_16px_rgba(32,39,52,0.05)] dark:border-[#5C7057]/50 dark:bg-[#3b4a38] dark:text-rose-300 dark:shadow-none">
          {error}
        </p>
      )}
    </div>
  );
}
