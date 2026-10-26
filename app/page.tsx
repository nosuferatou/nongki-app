export const instant = false;
import Link from "next/link";
import { connection } from "next/server";
import DashboardTabs from "@/components/DashboardTabs";
import { logoutAction } from "@/actions/authActions";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getPublicEvents, getUpcomingPublicEvents } from "@/lib/eventQueries";

export default async function Home() {
  await connection();

  const isAdmin = await isAdminAuthenticated();
  const events = isAdmin
    ? await getPublicEvents()
    : await getUpcomingPublicEvents();
  const dateFormatter = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NONGKI.</h1>
          <p className="mt-1 text-sm text-gray-600">
            Find your next gathering.
          </p>
        </div>
        {isAdmin ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">Admin</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Log out
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-black"
          >
            Admin sign in
          </Link>
        )}
      </header>

      {isAdmin ? (
        <DashboardTabs events={events} />
      ) : (
        <section aria-labelledby="public-events-heading">
          <div className="mb-6">
            <h2
              id="public-events-heading"
              className="text-xl font-bold tracking-tight text-gray-900"
            >
              Upcoming events
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Browse events and open an invitation to respond.
            </p>
          </div>

          {events.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {events.map((event) => (
                <li key={event.id}>
                  <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {event.title}
                      </h3>
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
                            {dateFormatter.format(event.eventDate)}
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
              There are no public events yet.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
