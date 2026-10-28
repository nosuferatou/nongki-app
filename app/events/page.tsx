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
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-8 sm:py-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-secondary-dark">Public events</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-primary-dark">
            Upcoming events
          </h1>
        </div>
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-secondary-dark/20 bg-white px-4 py-2 text-sm font-semibold text-secondary-dark transition-colors hover:bg-secondary-light/40 active:scale-[0.98]"
        >
          Login
        </Link>
      </header>

      {events.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.id}>
              <article className="flex h-full flex-col rounded-3xl bg-white p-4 shadow-[0_2px_16px_rgba(32,39,52,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(32,39,52,0.08)] sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold tracking-tight text-primary-dark">
                    {event.title}
                  </h2>
                  {event.isClosed && (
                    <span className="shrink-0 rounded-full bg-secondary-light/40 px-3 py-1 text-xs font-medium text-secondary-dark">
                      RSVP closed
                    </span>
                  )}
                </div>
                <dl className="mt-5 flex-1 space-y-4 text-sm">
                  <div>
                    <dt className="text-secondary-dark">Date</dt>
                    <dd className="mt-1 font-medium text-primary-dark">
                      <time dateTime={event.eventDate.toISOString()}>
                        {eventDateFormatter.format(event.eventDate)}
                      </time>
                    </dd>
                   </div>
                  <div>
                    <dt className="text-secondary-dark">Location</dt>
                    <dd className="mt-1 font-medium text-primary-dark">
                      {event.locationName}
                    </dd>
                  </div>
                </dl>
                <Link
                  href={`/event/${event.id}`}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-secondary-light/40 px-4 py-2 text-sm font-semibold text-secondary-dark transition-colors hover:bg-secondary-light active:scale-[0.98]"
                >
                  View event
                </Link>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-3xl bg-white p-8 text-center text-sm text-secondary-dark shadow-[0_2px_16px_rgba(32,39,52,0.05)]">
          There are no upcoming events yet.
        </p>
      )}
    </main>
  );
}
