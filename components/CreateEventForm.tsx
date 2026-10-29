"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useActionState, useState } from "react";
import { createEvent } from "@/actions/eventActions";
import EventMap from "@/components/EventMap";
import EventDateRangePicker from "@/components/EventDateRangePicker";

type EventActionState = Awaited<ReturnType<typeof createEvent>>;

const initialState: EventActionState = { success: false };

async function submitEvent(
  _previousState: EventActionState,
  formData: FormData,
): Promise<EventActionState> {
  const startValue = formData.get("eventDate");
  const endValue = formData.get("endDate");
  if (typeof startValue !== "string" || typeof endValue !== "string") {
    return { success: false, error: "Please provide start and end dates." };
  }

  const start = new Date(startValue);
  const end = new Date(endValue);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return {
      success: false,
      error: "End date and time must be after the start.",
    };
  }

  return createEvent(formData);
}

const fieldClassName =
  "mt-2 block min-h-11 w-full rounded-xl border border-slate-200/60 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-primary-light focus:outline-none focus:ring-4 focus:ring-primary-light/40 dark:border-[#5C7057]/50 dark:bg-[#2b3629] dark:text-[#D1EDD3] dark:placeholder:text-[#ACC5A6] sm:text-[15px]";

const labelClassName = "block text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]";

export default function CreateEventForm() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [state, formAction, pending] = useActionState(
    submitEvent,
    initialState,
  );

  return (
    <section className="mx-auto max-w-3xl px-4 pt-8 pb-10 sm:px-8 sm:pt-10">
      <Link
        href="/"
        className="mb-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-secondary-light/40 px-4 py-2 text-sm font-semibold text-secondary-dark transition-all hover:bg-secondary-light active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark dark:bg-[#5C7057]/40 dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/70"
      >
        <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.5} />
        Back
      </Link>

      <header className="mb-7">
        <p className="mb-2 text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]">
          Workspace / Events
        </p>
        <h1 className="text-lg font-semibold tracking-tight text-[#202734] dark:text-[#D1EDD3] sm:text-xl">
          Create event
        </h1>
      </header>

      <form
        action={formAction}
        className="space-y-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_2px_16px_rgba(32,39,52,0.05)] transition-shadow dark:border-[#5C7057]/40 dark:bg-[#3b4a38] dark:shadow-none sm:p-6"
      >
        <div>
          <label htmlFor="title" className={labelClassName}>
            Event title <span aria-hidden="true">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            autoComplete="off"
            placeholder="Friday night dinner"
            required
            className={fieldClassName}
          />
        </div>

        <EventDateRangePicker
          inputClassName={fieldClassName}
          labelClassName={labelClassName}
        />

        <div>
          <label htmlFor="locationName" className={labelClassName}>
            Location <span aria-hidden="true">*</span>
          </label>
          <input
            id="locationName"
            name="locationName"
            type="text"
            placeholder="Venue or address"
            required
            className={fieldClassName}
          />
        </div>

        <div>
          <EventMap
            latitude={latitude}
            longitude={longitude}
            isInteractive
            onChange={(nextLatitude, nextLongitude) => {
              setLatitude(nextLatitude);
              setLongitude(nextLongitude);
            }}
            className="w-full"
          />
          <input
            type="hidden"
            name="latitude"
            value={latitude === null ? "" : String(latitude)}
          />
          <input
            type="hidden"
            name="longitude"
            value={longitude === null ? "" : String(longitude)}
          />
          <p className="mt-2 text-[13px] text-slate-500 dark:text-[#ACC5A6]">
            Click on the map to pin the exact location.
          </p>
        </div>

        <div>
          <label htmlFor="maxGuests" className={labelClassName}>
            Maximum guests <span aria-hidden="true">*</span>
          </label>
          <input
            id="maxGuests"
            name="maxGuests"
            type="number"
            min="1"
            step="1"
            placeholder="12"
            required
            className={fieldClassName}
          />
        </div>

        <div>
          <label htmlFor="description" className={labelClassName}>
            Description <span className="font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="What should guests know?"
            className={fieldClassName}
          />
        </div>

        <div>
          <label htmlFor="notes" className={labelClassName}>
            Notes <span className="font-normal">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Host Notes"
            className={fieldClassName}
          />
        </div>

        {state.error && (
          <p
            role="alert"
            className="rounded-xl bg-rose-50 px-4 py-3 font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
          >
            {state.error}
          </p>
        )}

        {state.success && (
          <p
            role="status"
            className="rounded-xl bg-secondary-light/70 px-4 py-3 font-medium text-primary-dark dark:bg-[#5C7057]/40 dark:text-[#D1EDD3]"
          >
            Event created.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-secondary-light/40 px-6 py-2.5 text-sm font-semibold text-secondary-dark transition-all hover:bg-secondary-light active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#5C7057]/40 dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/70 sm:w-auto"
        >
          {pending ? "Creating..." : "Create"}
        </button>
      </form>
    </section>
  );
}
