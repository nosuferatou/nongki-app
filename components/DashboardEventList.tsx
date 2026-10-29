import Link from "next/link";
import { CalendarDays, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import DeleteEventButton from "@/components/DeleteEventButton";

type DashboardEvent = {
  id: string;
  title: string;
  eventDate: Date | string;
  endDate: Date | string;
  locationName: string;
  isClosed: boolean;
};

type DashboardEventListProps = {
  events: DashboardEvent[];
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function DashboardEventList({ events }: DashboardEventListProps) {
  return (
    <section aria-label="Event management">
      {events.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const startDate = new Date(event.eventDate);
            const endDate = new Date(event.endDate);

            return (
              <li key={event.id}>
                <article className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_2px_16px_rgba(32,39,52,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(32,39,52,0.08)] dark:border-[#5C7057]/40 dark:bg-[#3b4a38] dark:shadow-none dark:hover:bg-[#3b4a38] sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold tracking-tight text-[#202734] dark:text-[#D1EDD3] sm:text-xl">
                      {event.title}
                    </h2>
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
                          <time dateTime={startDate.toISOString()}>
                            {dateFormatter.format(startDate)}
                          </time>
                          <span className="px-1.5 text-slate-400 dark:text-[#ACC5A6]/70">–</span>
                          <time dateTime={endDate.toISOString()}>
                            {dateFormatter.format(endDate)}
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
                      href={`/event/${event.id}`}
                      className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-secondary-light/40 px-4 py-2.5 text-sm font-semibold text-secondary-dark transition-all hover:bg-secondary-light active:scale-[0.98] dark:bg-[#5C7057]/40 dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/70"
                    >
                      View details
                    </Link>
                    <Link
                      href={`/event/${event.id}/edit`}
                      aria-label={`Edit ${event.title}`}
                      className="inline-flex size-11 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-secondary-light/70 hover:text-primary-dark active:scale-[0.98] dark:text-[#ACC5A6]/70 dark:hover:bg-[#5C7057]/40 dark:hover:text-[#D1EDD3]"
                    >
                      <Pencil aria-hidden="true" size={16} />
                    </Link>
                    <DeleteEventButton
                      eventId={event.id}
                      className="inline-flex size-11 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 active:scale-[0.98] dark:text-[#ACC5A6]/70 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
                      iconOnly
                      icon={<Trash2 aria-hidden="true" size={16} />}
                    />
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-3xl border border-slate-100 bg-white px-4 py-10 text-center shadow-[0_2px_16px_rgba(32,39,52,0.05)] dark:border-[#5C7057]/40 dark:bg-[#3b4a38] dark:shadow-none sm:px-6 sm:py-12">
          <h2 className="text-lg font-semibold tracking-tight text-[#202734] dark:text-[#D1EDD3] sm:text-xl">
            No events yet
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-[#D1EDD3]/90 sm:text-[15px]">
            Create an event to get your next gathering started.
          </p>
          <Link
            href="/create"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-secondary-light/40 px-5 py-2.5 text-sm font-semibold text-secondary-dark transition-all hover:bg-secondary-light active:scale-[0.98] dark:bg-[#5C7057]/40 dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/70"
          >
            <Plus aria-hidden="true" size={17} />
            Create event
          </Link>
        </div>
      )}
    </section>
  );
}
