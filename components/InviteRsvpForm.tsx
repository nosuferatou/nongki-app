"use client";

import { useState } from "react";
import { submitRsvp } from "@/actions/guestActions";

const inputClassName =
  "block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all";

const labelClassName = "mb-1.5 block text-sm font-medium text-gray-700";

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
      <h2 id="rsvp-heading" className="mb-4 text-lg font-bold text-gray-900">
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
            <label className="flex min-h-12 flex-1 cursor-pointer items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900">
              <input
                type="radio"
                name="status"
                value="ACCEPT"
                checked={status === "ACCEPT"}
                onChange={() => setStatus("ACCEPT")}
                required
                className="size-4 accent-black"
              />
              Accept
            </label>
            <label className="flex min-h-12 flex-1 cursor-pointer items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900">
              <input
                type="radio"
                name="status"
                value="DECLINE"
                checked={status === "DECLINE"}
                onChange={() => setStatus("DECLINE")}
                required
                className="size-4 accent-black"
              />
              Decline
            </label>
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="text-sm font-medium text-red-700">
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

        <button
          type="submit"
          className="w-full rounded-xl bg-black px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Submit
        </button>
      </form>
    </section>
  );
}
