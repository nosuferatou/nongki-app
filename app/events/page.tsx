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
          <p className="text-sm font-semibold text-blue-700">Public events</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Upcoming events
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Browse events and open an invitation to respond.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
        >
          Login
        </Link>
      </header>

      {events.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.id}>
              <article className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)]">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                    {event.title}
                  </h2>
                  {event.isClosed && (
                    <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      RSVP closed
                    </span>
                  )}
                </div>
                <dl className="mt-5 flex-1 space-y-4 text-sm">
                  <div>
                    <dt className="text-slate-500">Date</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      <time dateTime={event.eventDate.toISOString()}>
                        {eventDateFormatter.format(event.eventDate)}
                      </time>
                    </dd>
                   </div>
                  <div>
                    <dt className="text-slate-500">Location</dt>
                    <dd className="mt-1 font-medium text-slate-900">
                      {event.locationName}
                    </dd>
                  </div>
                </dl>
                <Link
                  href={`/event/${event.id}`}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 active:scale-[0.98]"
                >
                  View event
                </Link>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-3xl bg-white p-8 text-center text-sm text-slate-500 shadow-[0_2px_16px_rgba(15,23,42,0.04)]">
          There are no upcoming events yet.
        </p>
      )}
    </main>
  );
}
