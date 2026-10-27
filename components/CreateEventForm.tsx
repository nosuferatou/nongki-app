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
  "mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10";

const labelClassName = "block text-sm font-semibold text-slate-700";

export default function CreateEventForm() {
  const [state, formAction, pending] = useActionState(
    submitEvent,
    initialState,
  );

  return (
    <section className="mx-auto max-w-3xl">
      <Link
        href="/"
        className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
      >
        <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.5} />
        Back
      </Link>

      <header className="mb-7">
        <p className="mb-2 text-sm font-semibold text-blue-700">
          Workspace / Events
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Create event
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Add the details for your next gathering.
        </p>
      </header>

      <form
        action={formAction}
        className="space-y-6 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] sm:p-8"
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
            className="rounded-xl bg-red-50 px-4 py-3 font-medium text-red-700"
          >
            {state.error}
          </p>
        )}

        {state.success && (
          <p
            role="status"
            className="rounded-xl bg-emerald-50 px-4 py-3 font-medium text-emerald-800"
          >
            Event created.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition duration-150 hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Creating event..." : "Create event"}
        </button>
      </form>
    </section>
  );
}
