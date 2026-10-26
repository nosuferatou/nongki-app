import Link from "next/link";
import { connection } from "next/server";
import { getUpcomingPublicEvents } from "@/lib/eventQueries";

export const instant = false;

const eventDateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function EventsPage() {
  await connection();
  const events = await getUpcomingPublicEvents();

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Nongki
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Upcoming events
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Browse events and open an invitation to respond.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-black"
        >
          Home
        </Link>
      </header>

      {events.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.id}>
              <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {event.title}
                  </h2>
                  {event.isClosed && (
                    <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      RSVP closed
                    </span>
                  )}
                </div>
                <dl className="mt-4 flex-1 space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500">Date</dt>
                    <dd className="mt-1 font-medium text-gray-900">
                      <time dateTime={event.eventDate.toISOString()}>
                        {eventDateFormatter.format(event.eventDate)}
                      </time>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Location</dt>
                    <dd className="mt-1 font-medium text-gray-900">
                      {event.locationName}
                    </dd>
                  </div>
                </dl>
                <Link
                  href={`/event/${event.id}`}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                >
                  View event
                </Link>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-gray-200 p-6 text-center text-sm text-gray-600">
          There are no upcoming events yet.
        </p>
      )}
    </main>
  );
}
