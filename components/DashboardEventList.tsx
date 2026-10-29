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
                <article className="flex h-full flex-col rounded-3xl bg-white p-4 shadow-[0_2px_16px_rgba(32,39,52,0.05)] transition-shadow hover:shadow-[0_8px_24px_rgba(32,39,52,0.08)] sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold tracking-tight text-primary-dark">
                      {event.title}
                    </h2>
                    <span
                      className={`inline-flex shrink-0 items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        event.isClosed
                          ? "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20"
                          : "bg-[#B7D894]/25 text-[#202734] ring-1 ring-inset ring-[#B7D894]/40"
                      }`}
                    >
                      {event.isClosed ? "Closed" : "Open"}
                    </span>
                  </div>

                  <dl className="mt-5 flex-1 space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <CalendarDays
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-secondary-dark/70"
                      />
                      <div>
                        <dt className="text-secondary-dark">Date &amp; time</dt>
                        <dd className="mt-1 font-medium text-primary-dark">
                          <time dateTime={startDate.toISOString()}>
                            {dateFormatter.format(startDate)}
                          </time>
                          <span className="px-1.5 text-secondary-dark/60">–</span>
                          <time dateTime={endDate.toISOString()}>
                            {dateFormatter.format(endDate)}
                          </time>
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-secondary-dark/70"
                      />
                      <div>
                        <dt className="text-secondary-dark">Location</dt>
                        <dd className="mt-1 font-medium text-primary-dark">
                          {event.locationName}
                        </dd>
                      </div>
                    </div>
                  </dl>

                  <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-secondary-dark/10 pt-4">
                    <Link
                      href={`/event/${event.id}`}
                      className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-secondary-light/40 px-4 py-2 text-sm font-semibold text-secondary-dark transition-colors hover:bg-secondary-light active:scale-[0.98]"
                    >
                      View details
                    </Link>
                    <Link
                      href={`/event/${event.id}/edit`}
                      aria-label={`Edit ${event.title}`}
                      className="inline-flex size-11 items-center justify-center rounded-xl text-secondary-dark transition-colors hover:bg-secondary-light/70 hover:text-primary-dark active:scale-[0.98]"
                    >
                      <Pencil aria-hidden="true" size={17} />
                    </Link>
                    <DeleteEventButton
                      eventId={event.id}
                      className="inline-flex size-11 items-center justify-center rounded-xl text-secondary-dark transition-colors hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
                      iconOnly
                      icon={<Trash2 aria-hidden="true" size={17} />}
                    />
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-3xl bg-white px-4 py-10 text-center shadow-[0_2px_16px_rgba(32,39,52,0.05)] sm:px-6 sm:py-12">
          <h2 className="text-lg font-semibold tracking-tight text-primary-dark">
            No events yet
          </h2>
          <p className="mt-2 text-sm text-secondary-dark">
            Create an event to get your next gathering started.
          </p>
          <Link
            href="/create"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-light px-5 py-2.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-secondary-light active:scale-[0.98]"
          >
            <Plus aria-hidden="true" size={17} />
            Create event
          </Link>
        </div>
      )}
    </section>
  );
}
