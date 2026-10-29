import Link from "next/link";
import { connection } from "next/server";
import { CalendarDays, MapPin } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeProvider";
import { getUpcomingPublicEvents } from "@/lib/eventQueries";

export const instant = false;

const dateFormatter = new Intl.DateTimeFormat("en", {
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
          <p className="text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]">Public events</p>
          <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#202734] dark:text-[#D1EDD3] sm:text-xl">
            Upcoming events
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-secondary-dark/20 bg-white px-4 py-2.5 text-sm font-semibold text-secondary-dark transition-all hover:bg-secondary-light/40 active:scale-[0.98] dark:border-[#5C7057]/50 dark:bg-[#3b4a38] dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/40"
          >
            Login
          </Link>
        </div>
      </header>

      {events.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.id}>
              <article className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_2px_16px_rgba(32,39,52,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(32,39,52,0.08)] dark:border-[#5C7057]/40 dark:bg-[#3b4a38] dark:shadow-none dark:hover:bg-[#3b4a38] sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight text-[#202734] dark:text-[#D1EDD3]">
                    {event.title}
                  </h3>
                  <span
                    className={`inline-flex shrink-0 items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      event.isClosed
                        ? "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-500/30"
                        : "bg-[#B7D894]/25 text-[#202734] ring-1 ring-inset ring-[#B7D894]/40 dark:bg-[#5C7057]/30 dark:text-[#D1EDD3] dark:ring-[#5C7057]/50"
                    }`}
                  >
                    {event.isClosed ? "Closed" : "Open"}
                  </span>
                </div>
                <dl className="mt-5 flex-1 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <CalendarDays
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-slate-400 dark:text-[#ACC5A6]/70"
                    />
                    <div>
                      <dt className="text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]">Date &amp; time</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-slate-800 dark:text-[#D1EDD3]/90 sm:text-[15px]">
                        <time dateTime={event.eventDate.toISOString()}>
                          {dateFormatter.format(event.eventDate)}
                        </time>
                        <span className="px-1.5 text-slate-400 dark:text-[#ACC5A6]/70">–</span>
                        <time dateTime={event.endDate.toISOString()}>
                          {dateFormatter.format(event.endDate)}
                        </time>
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-slate-400 dark:text-[#ACC5A6]/70"
                    />
                    <div>
                      <dt className="text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]">Location</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-slate-800 dark:text-[#D1EDD3]/90 sm:text-[15px]">
                        {event.locationName}
                      </dd>
                    </div>
                  </div>
                </dl>
                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-200/60 pt-4 dark:border-[#5C7057]/50">
                  <Link
                    href={`/invite/${event.id}`}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-secondary-light/40 px-4 py-2.5 text-sm font-semibold text-secondary-dark transition-all hover:bg-secondary-light active:scale-[0.98] dark:bg-[#5C7057]/40 dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/70"
                  >
                    View event
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-3xl border border-slate-100 bg-white p-8 text-center text-sm leading-relaxed text-slate-800 shadow-[0_2px_16px_rgba(32,39,52,0.05)] dark:border-[#5C7057]/40 dark:bg-[#3b4a38] dark:text-[#D1EDD3]/90 dark:shadow-none sm:text-[15px]">
          There are no upcoming events yet.
        </p>
      )}
    </main>
  );
}
