"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateEvent } from "@/actions/eventActions";
import EventDateRangePicker from "@/components/EventDateRangePicker";
import LocationUrlInput from "@/components/LocationUrlInput";

type EditableEvent = {
  id: string;
  title: string;
  eventDate: string;
  endDate: string;
  locationName: string;
  locationUrl: string;
  description: string | null;
  maxGuests: number;
  notes: string | null;
};

type EditState = {
  success: boolean;
  error?: string;
};

const initialState: EditState = { success: false };
const labelClassName = "block text-sm font-semibold text-slate-700";
const inputClassName =
  "mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10";

async function submitUpdate(
  _previousState: EditState,
  formData: FormData,
): Promise<EditState> {
  return updateEvent(formData);
}

export default function EditEventForm({ event }: { event: EditableEvent }) {
  const [state, formAction, pending] = useActionState(
    submitUpdate,
    initialState,
  );

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
      <Link
        href={`/event/${event.id}`}
        className="text-sm font-semibold text-slate-500 transition-colors hover:text-blue-700"
      >
        Back to event
      </Link>
      <header className="mb-7 mt-6">
        <p className="mb-2 text-sm font-semibold text-blue-700">Workspace / Events</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Edit event
        </h1>
      </header>

      <form
        action={formAction}
        className="space-y-6 rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] sm:p-8"
      >
        <input type="hidden" name="eventId" value={event.id} />

        <div>
          <label htmlFor="title" className={labelClassName}>
            Event title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={event.title}
            required
            className={inputClassName}
          />
        </div>

        <EventDateRangePicker
          inputClassName={inputClassName}
          labelClassName={labelClassName}
          initialStartDate={event.eventDate}
          initialEndDate={event.endDate}
        />

        <div>
          <label htmlFor="locationName" className={labelClassName}>
            Location name
          </label>
          <input
            id="locationName"
            name="locationName"
            type="text"
            defaultValue={event.locationName}
            required
            className={inputClassName}
          />
        </div>

        <LocationUrlInput
          className={inputClassName}
          labelClassName={labelClassName}
          initialValue={event.locationUrl}
        />

        <div>
          <label htmlFor="maxGuests" className={labelClassName}>
            Maximum guests
          </label>
          <input
            id="maxGuests"
            name="maxGuests"
            type="number"
            min="1"
            step="1"
            defaultValue={event.maxGuests}
            required
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="description" className={labelClassName}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={event.description ?? ""}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="notes" className={labelClassName}>
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={event.notes ?? ""}
            className={inputClassName}
          />
        </div>

        {state.error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}
        {state.success && (
          <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            Event updated.{" "}
            <Link href={`/event/${event.id}`} className="underline underline-offset-2">
              View event
            </Link>
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition duration-150 hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  );
}
