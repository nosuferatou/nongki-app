"use client";

import { useState } from "react";
import { submitRsvp } from "@/actions/guestActions";
import SubmitRsvpButton from "@/components/SubmitRsvpButton";

const inputClassName =
  "block min-h-11 w-full rounded-xl border border-secondary-dark/20 bg-white px-4 py-3 text-sm text-primary-dark placeholder:text-secondary-dark/60 transition focus:border-primary-light focus:outline-none focus:ring-4 focus:ring-primary-light/40";

const labelClassName = "mb-1.5 block text-sm font-semibold text-secondary-dark";

type InviteRsvpFormProps = {
  eventId: string;
};

export default function InviteRsvpForm({ eventId }: InviteRsvpFormProps) {
  const [status, setStatus] = useState<"ACCEPT" | "DECLINE">("ACCEPT");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData): Promise<void> {
    setError(null);
    const result = await submitRsvp(formData);

    if (!result.success) {
      setError(result.error ?? "Unable to submit your RSVP. Please try again.");
    }
  }

  return (
    <section aria-labelledby="rsvp-heading">
      <h2 id="rsvp-heading" className="mb-4 text-lg font-bold tracking-tight text-primary-dark">
        RSVP
      </h2>
      <form action={handleSubmit} className="space-y-5">
        <input type="hidden" name="eventId" value={eventId} />

        <div>
          <label htmlFor="name" className={labelClassName}>
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={inputClassName}
          />
        </div>

        <fieldset>
          <legend className={labelClassName}>Will you attend?</legend>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3 rounded-xl border border-secondary-dark/20 px-4 py-3 text-sm font-medium text-secondary-dark transition-colors hover:bg-secondary-light/40">
              <input
                type="radio"
                name="status"
                value="ACCEPT"
                checked={status === "ACCEPT"}
                onChange={() => setStatus("ACCEPT")}
                required
                className="size-4 accent-[var(--color-primary-dark)]"
              />
              Accept
            </label>
            <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3 rounded-xl border border-secondary-dark/20 px-4 py-3 text-sm font-medium text-secondary-dark transition-colors hover:bg-secondary-light/40">
              <input
                type="radio"
                name="status"
                value="DECLINE"
                checked={status === "DECLINE"}
                onChange={() => setStatus("DECLINE")}
                required
                className="size-4 accent-[var(--color-primary-dark)]"
              />
              Decline
            </label>
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        {status === "DECLINE" && (
          <div>
            <label htmlFor="reason" className={labelClassName}>
              Message
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={4}
              required
              className={inputClassName}
            />
          </div>
        )}

        <SubmitRsvpButton />
      </form>
    </section>
  );
}
