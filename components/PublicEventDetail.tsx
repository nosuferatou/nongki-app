import Link from "next/link";
import CopyInviteLink from "@/components/CopyInviteLink";
import DeleteEventButton from "@/components/DeleteEventButton";
import InviteRsvpForm from "@/components/InviteRsvpForm";
import type { getPublicInviteEvent } from "@/lib/eventQueries";
import { CalendarDays, Clock3, ExternalLink, MapPin } from "lucide-react";

type EventData = NonNullable<Awaited<ReturnType<typeof getPublicInviteEvent>>>;

type PublicEventDetailProps = {
  event: EventData;
  isAdmin: boolean;
  submitted: boolean;
  submittedStatus: "ACCEPT" | "DECLINE" | null;
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
      `${event.locationName} (${event.locationUrl})`,
    );

    return calendarUrl.toString();
  }

  const acceptedCount = event.guests.filter(
    (guest) => guest.status === "ACCEPT",
  ).length;
  const declinedCount = event.guests.filter(
    (guest) => guest.status === "DECLINE",
  ).length;
  const isSameDay =
    dateOnlyFormatter.format(event.eventDate) ===
    dateOnlyFormatter.format(event.endDate);
  const inviteUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/invite/${event.id}`;

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <Link
        href={isAdmin ? "/" : "/events"}
        className="inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-black"
      >
        {isAdmin ? "← Back to Dashboard" : "← Back to Browse Events"}
      </Link>

      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="mb-3 block text-sm font-semibold uppercase tracking-widest text-gray-500">
            Event details
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
            {event.title}
          </h1>
        </div>
        {isAdmin && <DeleteEventButton eventId={event.id} />}
      </header>

      <section aria-label="Event information" className="space-y-6">
        <div className="flex gap-4">
          <CalendarDays
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-gray-500"
            strokeWidth={1.75}
          />
          <div className="min-w-0">
            <h2 className="text-sm font-medium text-gray-500">Date &amp; Time</h2>
            {isSameDay ? (
              <div className="mt-2 flex items-start gap-2">
                <Clock3
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-gray-500"
                  strokeWidth={1.75}
                />
                <p className="font-semibold leading-6 text-gray-900">
                  <time dateTime={event.eventDate.toISOString()}>
                    {dateOnlyFormatter.format(event.eventDate)}
                  </time>
                  <span className="px-2 text-gray-400" aria-hidden="true">
                    ·
                  </span>
                  <time dateTime={event.eventDate.toISOString()}>
                    {timeFormatter.format(event.eventDate)}
                  </time>
                  <span className="px-2 text-gray-400" aria-hidden="true">
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
                  <dt className="w-14 shrink-0 pt-0.5 text-sm text-gray-500">
                    Starts
                  </dt>
                  <dd className="flex items-start gap-2 font-semibold leading-6 text-gray-900">
                    <Clock3
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-gray-500"
                      strokeWidth={1.75}
                    />
                    <time dateTime={event.eventDate.toISOString()}>
                      {dateFormatter.format(event.eventDate)}
                    </time>
                  </dd>
                </div>
                <div className="flex items-start gap-3">
                  <dt className="w-14 shrink-0 pt-0.5 text-sm text-gray-500">
                    Ends
                  </dt>
                  <dd className="flex items-start gap-2 font-semibold leading-6 text-gray-900">
                    <Clock3
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-gray-500"
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

        <div className="flex gap-4 border-t border-gray-100 pt-6">
          <MapPin
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-gray-500"
            strokeWidth={1.75}
          />
          <div>
            <h2 className="text-sm font-medium text-gray-500">Location</h2>
            <p className="mt-1 font-semibold text-gray-900">
              {event.locationName}
            </p>
            <a
              href={event.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
            >
              Open location
              <ExternalLink aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </div>

        {event.description && (
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-sm font-medium text-gray-500">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-gray-900">
              {event.description}
            </p>
          </div>
        )}

        {event.notes && (
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-sm font-medium text-gray-500">Notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-gray-900">
              {event.notes}
            </p>
          </div>
        )}
      </section>

      {isAdmin && (
        <section
          aria-labelledby="share-link-heading"
          className="border-t border-gray-100 pt-8"
        >
          <h2
            id="share-link-heading"
            className="mb-3 text-sm font-medium text-gray-500"
          >
            Shareable Invite Link
          </h2>
          <CopyInviteLink inviteUrl={inviteUrl} />
        </section>
      )}

      <section
        aria-labelledby="attendance-heading"
        className="border-t border-gray-100 pt-8"
      >
        <h2 id="attendance-heading" className="mb-5 text-xl font-bold text-black">
          Attendance summary
        </h2>
        <dl className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <dt className="order-2 mt-1 text-sm text-gray-500">Total guests</dt>
            <dd className="order-1 text-2xl font-bold tracking-tight text-gray-900">
              {event.guests.length}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="order-2 mt-1 text-sm text-gray-500">Accepted</dt>
            <dd className="order-1 text-2xl font-bold tracking-tight text-gray-900">
              {acceptedCount}
            </dd>
          </div>
          <div className="flex flex-col">
            <dt className="order-2 mt-1 text-sm text-gray-500">Declined</dt>
            <dd className="order-1 text-2xl font-bold tracking-tight text-gray-900">
              {declinedCount}
            </dd>
          </div>
        </dl>
      </section>

      {!isAdmin && (
        <section className="border-t border-gray-100 pt-8">
          {submitted ? (
            <div
              aria-labelledby="rsvp-success-heading"
              className="rounded-2xl bg-gray-50 px-6 py-8 text-center"
              role="status"
            >
              <h2
                id="rsvp-success-heading"
                className="text-lg font-bold tracking-wide text-gray-900"
              >
                RSVP submitted
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {submittedStatus === "DECLINE"
                  ? "Terima kasih atas konfirmasinya. Mungkin di lain waktu!"
                  : "Thank you for your response. Your attendance status has been recorded."}
              </p>
              {submittedStatus === "ACCEPT" && (
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
            <div className="rounded-2xl bg-gray-50 px-6 py-8 text-center">
              <h2 className="text-lg font-bold tracking-wide text-gray-900">
                RSVP is closed
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                This event is no longer accepting responses.
              </p>
            </div>
          ) : (
            <InviteRsvpForm eventId={event.id} />
          )}
        </section>
      )}

      <section
        aria-labelledby="guests-heading"
        className="border-t border-gray-100 pt-8"
      >
        <h2 id="guests-heading" className="mb-5 text-xl font-bold text-black">
          Guest responses
        </h2>
        {event.guests.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {event.guests.map((guest) => (
              <li
                key={guest.id}
                className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
              >
                <div>
                  <p className="font-semibold text-gray-900">{guest.name}</p>
                  {guest.status === "DECLINE" && guest.reason && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-gray-500">
                      {guest.reason}
                    </p>
                  )}
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    guest.status === "ACCEPT"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {guest.status === "ACCEPT" ? "Accepted" : "Declined"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            No guests have responded yet.
          </p>
        )}
      </section>
    </main>
  );
}
