"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { updateEvent } from "@/actions/eventActions";
import EventMap from "@/components/EventMap";
import EventDateRangePicker from "@/components/EventDateRangePicker";

type EditableEvent = {
  id: string;
  title: string;
  eventDate: string;
  endDate: string;
  locationName: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  maxGuests: number;
  notes: string | null;
};

type EditState = {
  success: boolean;
  error?: string;
};

const initialState: EditState = { success: false };
const labelClassName = "block text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]";
const inputClassName =
  "mt-2 block min-h-11 w-full rounded-xl border border-slate-200/60 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-primary-light focus:outline-none focus:ring-4 focus:ring-primary-light/40 dark:border-[#5C7057]/50 dark:bg-[#2b3629] dark:text-[#D1EDD3] dark:placeholder:text-[#ACC5A6] sm:text-[15px]";

async function submitUpdate(
  _previousState: EditState,
  formData: FormData,
): Promise<EditState> {
  return updateEvent(formData);
}

export default function EditEventForm({ event }: { event: EditableEvent }) {
  const [latitude, setLatitude] = useState<number | null>(event.latitude);
  const [longitude, setLongitude] = useState<number | null>(event.longitude);
  const [state, formAction, pending] = useActionState(
    submitUpdate,
    initialState,
  );

  return (
    <section className="mx-auto max-w-3xl px-4 pt-8 pb-10 sm:px-8 sm:pt-10">
      <Link
        href={`/event/${event.id}`}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-secondary-light/40 px-4 py-2 text-sm font-semibold text-secondary-dark transition-all hover:bg-secondary-light active:scale-[0.98] dark:bg-[#5C7057]/40 dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/70"
      >
        <span aria-hidden="true">←</span>
        Back to event
      </Link>
      <header className="mb-7 mt-6">
        <p className="mb-2 text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]">Workspace / Events</p>
        <h1 className="text-lg font-semibold tracking-tight text-[#202734] dark:text-[#D1EDD3] sm:text-xl">
          Edit event
        </h1>
      </header>

      <form
        action={formAction}
        className="space-y-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_2px_16px_rgba(32,39,52,0.05)] transition-shadow dark:border-[#5C7057]/40 dark:bg-[#3b4a38] dark:shadow-none sm:p-6"
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
            Host Notes
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
          <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {state.error}
          </p>
        )}
        {state.success && (
          <p role="status" className="rounded-xl bg-secondary-light/70 px-4 py-3 text-sm font-medium text-primary-dark dark:bg-[#5C7057]/40 dark:text-[#D1EDD3]">
            Event updated.{" "}
            <Link href={`/event/${event.id}`} className="underline underline-offset-2">
              View event
            </Link>
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-secondary-light/40 px-6 py-2.5 text-sm font-semibold text-secondary-dark transition-all hover:bg-secondary-light active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#5C7057]/40 dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/70"
        >
          {pending ? "Saving..." : "Save"}
        </button>
      </form>
    </section>
  );
}
