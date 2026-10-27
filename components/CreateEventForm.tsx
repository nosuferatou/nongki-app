"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useActionState } from "react";
import { createEvent } from "@/actions/eventActions";
import LocationUrlInput from "@/components/LocationUrlInput";
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
  "mt-2 block w-full border-2 border-black bg-white px-4 py-3 text-base text-black placeholder:text-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

const labelClassName = "block text-sm font-bold uppercase tracking-wide";

export default function CreateEventForm() {
  const [state, formAction, pending] = useActionState(
    submitEvent,
    initialState,
  );

  return (
    <section className="mx-auto max-w-xl">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide underline decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.5} />
        Back
      </Link>

      <header className="mb-8 border-b-4 border-black pb-5">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em]">
          Nongki / Events
        </p>
        <h1 className="text-4xl font-bold uppercase tracking-tight">
          Create event
        </h1>
      </header>

      <form action={formAction} className="space-y-7">
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

        <div className="grid gap-7 sm:grid-cols-2">
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

          <LocationUrlInput
            className={fieldClassName}
            labelClassName={labelClassName}
          />
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
            placeholder="Private notes for the host"
            className={fieldClassName}
          />
        </div>

        {state.error && (
          <p
            role="alert"
            className="border-2 border-black bg-white px-4 py-3 font-semibold"
          >
            {state.error}
          </p>
        )}

        {state.success && (
          <p
            role="status"
            className="border-2 border-black bg-black px-4 py-3 font-semibold text-white"
          >
            Event created.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-14 w-full items-center justify-center border-2 border-black bg-black px-6 py-4 text-base font-bold uppercase tracking-wide text-white hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:border-neutral-400 disabled:bg-neutral-200 disabled:text-neutral-500 sm:w-auto"
        >
          {pending ? "Creating event..." : "Create event"}
        </button>
      </form>
    </section>
  );
}
