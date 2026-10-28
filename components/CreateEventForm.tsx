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
  "mt-2 block min-h-11 w-full rounded-xl border border-secondary-dark/20 bg-white px-4 py-3 text-base text-primary-dark placeholder:text-secondary-dark/60 transition focus:border-primary-light focus:outline-none focus:ring-4 focus:ring-primary-light/40";

const labelClassName = "block text-sm font-semibold text-secondary-dark";

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
        className="mb-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-secondary-light/30 px-4 py-2 text-sm font-medium text-secondary-dark transition-all duration-200 hover:bg-secondary-light/70 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark"
      >
        <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.5} />
        Back
      </Link>

      <header className="mb-7">
        <p className="mb-2 text-sm font-semibold text-secondary-dark">
          Workspace / Events
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-primary-dark">
          Create event
        </h1>
      </header>

      <form
        action={formAction}
        className="space-y-6 rounded-3xl bg-white p-4 shadow-[0_2px_16px_rgba(32,39,52,0.05)] sm:p-8"
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
          <p className="mt-2 text-xs text-slate-500">
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
            className="rounded-xl bg-red-50 px-4 py-3 font-medium text-red-700"
          >
            {state.error}
          </p>
        )}

        {state.success && (
          <p
            role="status"
            className="rounded-xl bg-secondary-light/70 px-4 py-3 font-medium text-primary-dark"
          >
            Event created.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-primary-light px-6 py-3 text-base font-semibold text-primary-dark transition duration-150 hover:bg-secondary-light active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Creating..." : "Create"}
        </button>
      </form>
    </section>
  );
}
