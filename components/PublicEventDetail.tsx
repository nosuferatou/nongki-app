import Link from "next/link";
import CopyInviteLink from "@/components/CopyInviteLink";
import DeleteEventButton from "@/components/DeleteEventButton";
import AdminGuestActions from "@/components/AdminGuestActions";
import EventMap from "@/components/EventMap";
import InviteRsvpForm from "@/components/InviteRsvpForm";
import type { getPublicInviteEvent } from "@/lib/eventQueries";
import { CalendarDays, Clock3, ExternalLink, MapPin } from "lucide-react";

type EventData = NonNullable<Awaited<ReturnType<typeof getPublicInviteEvent>>>;

type PublicEventDetailProps = {
  event: EventData;
  isAdmin: boolean;
  submitted: boolean;
  submittedStatus: "ATTENDING" | "DECLINED" | "WAITLISTED" | null;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "full",
  timeStyle: "short",
});
const dateOnlyFormatter = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "short",
  day: "numeric",
  year: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
});

export default function PublicEventDetail({
  event,
  isAdmin,
  submitted,
  submittedStatus,
}: PublicEventDetailProps) {
  function getGoogleCalendarUrl() {
    const startDate = new Date(event.eventDate);
    const endDate = new Date(event.endDate);
    const formatCalendarDate = (date: Date) =>
      date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const calendarUrl = new URL(
      "https://calendar.google.com/calendar/render?action=TEMPLATE",
    );

    calendarUrl.searchParams.set("text", event.title);
    calendarUrl.searchParams.set(
      "dates",
      `${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}`,
    );
    calendarUrl.searchParams.set("details", event.description ?? "");
    calendarUrl.searchParams.set(
      "location",
      event.locationName,
    );

    return calendarUrl.toString();
  }

  const acceptedCount = event.guests.filter(
    (guest) => guest.status === "ATTENDING",
  ).length;
  const declinedCount = event.guests.filter(
    (guest) => guest.status === "DECLINED",
  ).length;
  const waitlistedCount = event.guests.filter(
    (guest) => guest.status === "WAITLISTED",
  ).length;
  const remainingQuota = Math.max(event.maxGuests - acceptedCount, 0);
  const isSameDay =
    dateOnlyFormatter.format(event.eventDate) ===
    dateOnlyFormatter.format(event.endDate);
  const inviteUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/invite/${event.id}`;

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-8 sm:py-10">
      <Link
        href={isAdmin ? "/" : "/events"}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-secondary-light/30 px-4 py-2 text-sm font-medium text-secondary-dark transition-all duration-200 hover:bg-secondary-light/70 active:scale-[0.98]"
      >
        {isAdmin ? "← Back to Dashboard" : "← Back to Browse Events"}
      </Link>

      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="mb-3 block text-sm font-semibold text-secondary-dark">
            Event details
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-primary-dark sm:text-5xl">
            {event.title}
          </h1>
        </div>
        {isAdmin && <DeleteEventButton eventId={event.id} />}
      </header>

      <section aria-label="Event information" className="space-y-6">
        <div className="flex gap-4">
          <CalendarDays
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-secondary-dark"
            strokeWidth={1.75}
          />
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-secondary-dark">Date &amp; Time</h2>
            {isSameDay ? (
              <div className="mt-2 flex items-start gap-2">
                <Clock3
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-secondary-dark"
                  strokeWidth={1.75}
                />
                <p className="font-semibold leading-6 text-primary-dark">
                  <time dateTime={event.eventDate.toISOString()}>
                    {dateOnlyFormatter.format(event.eventDate)}
                  </time>
                  <span className="px-2 text-secondary-dark/60" aria-hidden="true">
                    ·
                  </span>
                  <time dateTime={event.eventDate.toISOString()}>
                    {timeFormatter.format(event.eventDate)}
                  </time>
                  <span className="px-2 text-secondary-dark/60" aria-hidden="true">
                    –
                  </span>
                  <time dateTime={event.endDate.toISOString()}>
                    {timeFormatter.format(event.endDate)}
                  </time>
                </p>
              </div>
            ) : (
              <dl className="mt-2 space-y-3">
                <div className="flex items-start gap-3">
                  <dt className="w-14 shrink-0 pt-0.5 text-sm text-secondary-dark">
                    Starts
                  </dt>
                  <dd className="flex items-start gap-2 font-semibold leading-6 text-primary-dark">
                    <Clock3
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-secondary-dark"
                      strokeWidth={1.75}
                    />
                    <time dateTime={event.eventDate.toISOString()}>
                      {dateFormatter.format(event.eventDate)}
                    </time>
                  </dd>
                </div>
                <div className="flex items-start gap-3">
                  <dt className="w-14 shrink-0 pt-0.5 text-sm text-secondary-dark">
                    Ends
                  </dt>
                  <dd className="flex items-start gap-2 font-semibold leading-6 text-primary-dark">
                    <Clock3
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-secondary-dark"
                      strokeWidth={1.75}
                    />
                    <time dateTime={event.endDate.toISOString()}>
                      {dateFormatter.format(event.endDate)}
                    </time>
                  </dd>
                </div>
              </dl>
            )}
          </div>
        </div>

        <div className="flex gap-4 border-t border-secondary-dark/15 pt-6">
          <MapPin
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-secondary-dark"
            strokeWidth={1.75}
          />
          <div>
            <h2 className="text-sm font-semibold text-secondary-dark">Location</h2>
            <p className="mt-1 font-semibold text-primary-dark">
              {event.locationName}
            </p>
            {!isAdmin &&
              event.latitude !== null &&
              event.longitude !== null &&
              Number.isFinite(event.latitude) &&
              Number.isFinite(event.longitude) && (
                <a
                  href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-secondary-dark/20 bg-white px-4 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-secondary-light/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark"
                >
                  Open in Google Maps
                  <ExternalLink aria-hidden="true" className="size-3.5" />
                </a>
              )}
          </div>
        </div>

        {event.latitude !== null &&
          event.longitude !== null &&
          Number.isFinite(event.latitude) &&
          Number.isFinite(event.longitude) && (
            <div className="overflow-hidden rounded-xl border border-secondary-dark/20">
              <EventMap
                latitude={event.latitude}
                longitude={event.longitude}
                isInteractive={false}
                className="h-48 w-full"
              />
            </div>
          )}

        {event.description && (
          <div className="border-t border-secondary-dark/15 pt-6">
            <h2 className="text-sm font-semibold text-secondary-dark">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-primary-dark">
              {event.description}
            </p>
          </div>
        )}

        {event.notes && (
          <div className="border-t border-secondary-dark/15 pt-6">
            <h2 className="text-sm font-semibold text-secondary-dark">Notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-primary-dark">
              {event.notes}
            </p>
          </div>
        )}
      </section>

      {isAdmin && (
        <section
          aria-labelledby="share-link-heading"
          className="border-t border-secondary-dark/15 pt-8"
        >
          <h2
            id="share-link-heading"
            className="mb-3 text-sm font-semibold text-secondary-dark"
          >
            Shareable Invite Link
          </h2>
          <CopyInviteLink inviteUrl={inviteUrl} />
        </section>
      )}

      <section
        aria-labelledby="attendance-heading"
        className="border-t border-secondary-dark/15 pt-8"
      >
        <h2 id="attendance-heading" className="mb-5 text-xl font-bold tracking-tight text-primary-dark">
          Attendance summary
        </h2>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="flex flex-col">
            <dt className="order-2 mt-1 text-sm text-secondary-dark">Total guests</dt>
            <dd className="order-1 text-2xl font-bold tracking-tight text-primary-dark">
              {event.guests.length}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="order-2 mt-1 text-sm text-secondary-dark">Attending</dt>
            <dd className="order-1 text-2xl font-bold tracking-tight text-primary-dark">
              {acceptedCount}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="order-2 mt-1 text-sm text-secondary-dark">Spots left</dt>
            <dd className="order-1 text-2xl font-bold tracking-tight text-primary-dark">
              {remainingQuota}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="order-2 mt-1 text-sm text-secondary-dark">Waitlisted</dt>
            <dd className="order-1 text-2xl font-bold tracking-tight text-primary-dark">
              {waitlistedCount}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="order-2 mt-1 text-sm text-secondary-dark">Declined</dt>
            <dd className="order-1 text-2xl font-bold tracking-tight text-primary-dark">
              {declinedCount}
            </dd>
          </div>
        </dl>
      </section>

      {!isAdmin && (
        <section className="border-t border-secondary-dark/15 pt-8">
          {submitted ? (
            <div
              aria-labelledby="rsvp-success-heading"
              className="rounded-3xl bg-white px-4 py-8 text-center shadow-[0_2px_16px_rgba(32,39,52,0.05)] sm:px-6"
              role="status"
            >
              <h2
                id="rsvp-success-heading"
                className="text-lg font-bold tracking-tight text-primary-dark"
              >
                RSVP submitted
              </h2>
              <p className="mt-3 text-sm leading-6 text-secondary-dark">
                {submittedStatus === "DECLINED"
                  ? "Terima kasih atas konfirmasinya. Mungkin di lain waktu!"
                  : submittedStatus === "WAITLISTED"
                    ? "This event is full. You have been added to the waitlist and will get a spot if one opens."
                    : "Thank you for your response. Your attendance status has been recorded."}
              </p>
              {submittedStatus === "ATTENDING" && (
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-secondary-dark/20 bg-white px-4 py-2.5 text-sm font-semibold text-secondary-dark transition-colors hover:bg-secondary-light/40 focus:outline-none focus:ring-4 focus:ring-primary-light/40"
                >
                  <svg
                    aria-hidden="true"
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M16 3v4M8 3v4M3 10h18" />
                  </svg>
                  Add to Google Calendar
                </a>
              )}
            </div>
          ) : event.isClosed ? (
            <div className="rounded-3xl bg-white px-4 py-8 text-center shadow-[0_2px_16px_rgba(32,39,52,0.05)] sm:px-6">
              <h2 className="text-lg font-bold tracking-tight text-primary-dark">
                RSVP is closed
              </h2>
              <p className="mt-3 text-sm leading-6 text-secondary-dark">
                This event is no longer accepting responses.
              </p>
            </div>
          ) : (
            <InviteRsvpForm
              eventId={event.id}
              isFull={remainingQuota <= 0}
            />
          )}
        </section>
      )}

      <section
        aria-labelledby="guests-heading"
        className="border-t border-secondary-dark/15 pt-8"
      >
        <h2 id="guests-heading" className="mb-5 text-xl font-bold tracking-tight text-primary-dark">
          Guest responses
        </h2>
        {event.guests.length > 0 ? (
          <ul className="divide-y divide-secondary-dark/10">
            {event.guests.map((guest) => (
              <li
                key={guest.id}
                className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
              >
                <div className="flex-1">
                  <p className="font-semibold text-primary-dark">{guest.name}</p>
                  {guest.status === "DECLINED" && guest.reason && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-secondary-dark">
                      {guest.reason}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      guest.status === "ATTENDING"
                        ? "bg-secondary-light text-primary-dark"
                        : guest.status === "WAITLISTED"
                          ? "bg-secondary-dark text-white"
                          : "bg-secondary-light/40 text-secondary-dark"
                    }`}
                  >
                    {guest.status === "ATTENDING"
                      ? "Attending"
                      : guest.status === "WAITLISTED"
                        ? "Waitlisted"
                        : "Declined"}
                  </span>
                  {isAdmin && (
                    <AdminGuestActions
                      guestId={guest.id}
                      status={guest.status}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-secondary-dark">
            No guests have responded yet.
          </p>
        )}
      </section>
    </main>
  );
}
