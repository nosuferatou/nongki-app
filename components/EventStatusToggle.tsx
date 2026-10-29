"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleEventStatus } from "@/actions/eventActions";

type EventStatusToggleProps = {
  eventId: string;
  isClosed: boolean;
};

export default function EventStatusToggle({
  eventId,
  isClosed,
}: EventStatusToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(isOpen: boolean) {
    setError(null);
    startTransition(async () => {
      const result = await toggleEventStatus(eventId, !isOpen);
      if (!result.success) {
        setError(result.error ?? "Unable to update event status.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <label
        className="inline-flex min-h-11 cursor-pointer items-center"
        title={isClosed ? "Open RSVPs" : "Close RSVPs"}
      >
        <input
          type="checkbox"
          className="peer sr-only"
          checked={!isClosed}
          disabled={isPending}
          onChange={(event) => handleChange(event.currentTarget.checked)}
          role="switch"
          aria-checked={!isClosed}
          aria-label="Open RSVPs for event"
        />
        <span
          aria-hidden="true"
          className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-slate-300 transition-colors after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-primary-light peer-checked:after:translate-x-5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-dark peer-disabled:cursor-not-allowed peer-disabled:opacity-60 dark:bg-slate-700"
        />
        <span className="sr-only">
          {isPending
            ? "Updating RSVP availability"
            : isClosed
              ? "RSVPs are closed"
              : "RSVPs are open"}
        </span>
      </label>
      {error && (
        <p role="alert" className="max-w-48 text-right text-xs text-red-700 dark:text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
