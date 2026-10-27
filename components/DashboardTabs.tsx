"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createEvent } from "@/actions/eventActions";
import LocationUrlInput from "@/components/LocationUrlInput";

type DashboardEvent = {
  id: string;
  title: string;
  eventDate: Date | string;
  locationName: string;
};

type DashboardTabsProps = {
  events: DashboardEvent[];
};

type Tab = "events" | "create";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

const labelClassName = "block text-sm font-medium text-gray-900 mb-1.5";
const inputClassName =
  "block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base text-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors";

export default function DashboardTabs({ events }: DashboardTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("events");
  const [creationResult, setCreationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  async function handleCreateEvent(formData: FormData): Promise<void> {
    setCreationResult(null);
    const result = await createEvent(formData);

    if (result.success) {
      setCreationResult({
        success: true,
        message: "Event created successfully!",
      });
      setActiveTab("events");
      router.refresh();
    } else {
      setCreationResult({
        success: false,
        message: result.error ?? "Unable to create event. Please try again.",
      });
    }
  }

  return (
    <section>
      <div
        aria-label="Dashboard sections"
        className="mb-8 inline-flex rounded-full bg-gray-100 p-1"
        role="tablist"
      >
        <button
          id="dashboard-tab-events"
          type="button"
          role="tab"
          aria-selected={activeTab === "events"}
          aria-controls="dashboard-panel-events"
          onClick={() => setActiveTab("events")}
          className={`rounded-full px-6 py-2 font-medium transition-all ${
            activeTab === "events"
              ? "bg-white text-black shadow-sm"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Events
        </button>
        <button
          id="dashboard-tab-create"
          type="button"
          role="tab"
          aria-selected={activeTab === "create"}
          aria-controls="dashboard-panel-create"
          onClick={() => setActiveTab("create")}
          className={`rounded-full px-6 py-2 font-medium transition-all ${
            activeTab === "create"
              ? "bg-white text-black shadow-sm"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Create
        </button>
      </div>

      {activeTab === "events" ? (
        <div
          id="dashboard-panel-events"
          role="tabpanel"
          aria-labelledby="dashboard-tab-events"
          className="animate-in fade-in duration-500"
        >
          {events.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {events.map((event) => {
                const eventDate = new Date(event.eventDate);

                return (
                  <li key={event.id}>
                    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h2 className="text-lg font-semibold text-black">
                        {event.title}
                      </h2>
                      <dl className="mt-4 mb-6 space-y-3 text-sm">
                        <div>
                          <dt className="font-medium text-gray-500">Date</dt>
                          <dd className="mt-1">
                            <time dateTime={eventDate.toISOString()}>
                              {dateFormatter.format(eventDate)}
                            </time>
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-500">
                            Location
                          </dt>
                          <dd className="mt-1">{event.locationName}</dd>
                        </div>
                      </dl>
                      <Link
                        href={`/event/${event.id}`}
                        className="mt-auto w-full rounded-xl border border-gray-200 px-4 py-2 text-center font-medium transition-colors hover:bg-gray-50"
                      >
                        View Details
                      </Link>
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
              No events yet.
            </p>
          )}
          {creationResult?.success && (
            <p
              role="status"
              className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900"
            >
              {creationResult.message}
            </p>
          )}
        </div>
      ) : (
        <div
          id="dashboard-panel-create"
          role="tabpanel"
          aria-labelledby="dashboard-tab-create"
          className="animate-in fade-in duration-500"
        >
          <form
            action={handleCreateEvent}
            className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            {creationResult && !creationResult.success && (
              <p
                role="alert"
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900"
              >
                {creationResult.message}
              </p>
            )}
            <div>
              <label htmlFor="title" className={labelClassName}>
                Event title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="eventDate" className={labelClassName}>
                Date and time
              </label>
              <input
                id="eventDate"
                name="eventDate"
                type="datetime-local"
                required
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="locationName" className={labelClassName}>
                Location name
              </label>
              <input
                id="locationName"
                name="locationName"
                type="text"
                required
                className={inputClassName}
              />
            </div>

            <LocationUrlInput
              className={inputClassName}
              labelClassName={labelClassName}
            />

            <div>
              <label htmlFor="description" className={labelClassName}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className={inputClassName}
              />
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
                required
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
                className={inputClassName}
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-black px-4 py-3 text-base font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              Create Event
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
