"use client";

import { useState } from "react";
import { submitRsvp } from "@/actions/guestActions";
import SubmitRsvpButton from "@/components/SubmitRsvpButton";

const inputClassName =
  "block min-h-11 w-full rounded-xl border border-slate-200/60 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-primary-light focus:outline-none focus:ring-4 focus:ring-primary-light/40 dark:border-[#5C7057]/50 dark:bg-[#2b3629] dark:text-[#D1EDD3] dark:placeholder:text-[#ACC5A6] sm:text-[15px]";

const labelClassName = "mb-1.5 block text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]";

type InviteRsvpFormProps = {
  eventId: string;
  isFull: boolean;
};

export default function InviteRsvpForm({
  eventId,
  isFull,
}: InviteRsvpFormProps) {
  const [status, setStatus] = useState<"ATTENDING" | "DECLINED">("ATTENDING");
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
      <h2 id="rsvp-heading" className="mb-4 text-lg font-semibold tracking-tight text-[#202734] dark:text-[#D1EDD3] sm:text-xl">
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
            <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3 rounded-xl border border-slate-200/60 px-4 py-3 text-sm font-medium text-slate-800 transition-all hover:bg-secondary-light/40 active:scale-[0.98] dark:border-[#5C7057]/50 dark:text-[#D1EDD3]/90 dark:hover:bg-[#5C7057]/30">
              <input
                type="radio"
                name="status"
                value="ATTENDING"
                checked={status === "ATTENDING"}
                onChange={() => setStatus("ATTENDING")}
                required
                className="size-4 accent-[var(--color-primary-dark)]"
              />
              Attending
            </label>
            <label className="flex min-h-11 flex-1 cursor-pointer items-center gap-3 rounded-xl border border-slate-200/60 px-4 py-3 text-sm font-medium text-slate-800 transition-all hover:bg-secondary-light/40 active:scale-[0.98] dark:border-[#5C7057]/50 dark:text-[#D1EDD3]/90 dark:hover:bg-[#5C7057]/30">
              <input
                type="radio"
                name="status"
                value="DECLINED"
                checked={status === "DECLINED"}
                onChange={() => setStatus("DECLINED")}
                required
                className="size-4 accent-[var(--color-primary-dark)]"
              />
              Declined
            </label>
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </p>
        )}

        {status === "DECLINED" && (
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

        <SubmitRsvpButton
          label={isFull && status === "ATTENDING" ? "Join Waitlist" : "RSVP"}
          waitlist={isFull && status === "ATTENDING"}
        />
        {isFull && status === "ATTENDING" && (
          <p className="text-sm leading-relaxed text-slate-500 dark:text-[#ACC5A6]">
            This event is currently full. You will automatically get a spot if
            someone cancels.
          </p>
        )}
      </form>
    </section>
  );
}
