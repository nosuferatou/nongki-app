"use client";

import { useState, useTransition } from "react";
import {
  adminRemoveGuest,
  adminUpdateGuestStatus,
} from "@/actions/guestActions";

type AdminGuestActionsProps = {
  guestId: string;
  status: "ATTENDING" | "DECLINED" | "WAITLISTED";
};

export default function AdminGuestActions({
  guestId,
  status,
}: AdminGuestActionsProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function declineGuest() {
    setError(null);
    startTransition(async () => {
      const result = await adminUpdateGuestStatus(guestId, "DECLINED");
      if (!result.success) {
        setError(result.error ?? "Unable to update guest status.");
      }
    });
  }

  function removeGuest() {
    if (!window.confirm("Remove this guest from the event?")) return;
    setError(null);
    startTransition(async () => {
      const result = await adminRemoveGuest(guestId);
      if (!result.success) {
        setError(result.error ?? "Unable to remove guest.");
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div className="flex items-center gap-2">
        {status === "ATTENDING" && (
          <button
            type="button"
            disabled={isPending}
            onClick={declineGuest}
            className="min-h-11 rounded-lg px-3 text-xs font-semibold text-secondary-dark transition-colors hover:bg-secondary-light/60 disabled:opacity-60"
          >
            Mark declined
          </button>
        )}
        <button
          type="button"
          disabled={isPending}
          onClick={removeGuest}
          className="min-h-11 rounded-lg px-3 text-xs font-semibold text-secondary-dark transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
        >
          Remove
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
