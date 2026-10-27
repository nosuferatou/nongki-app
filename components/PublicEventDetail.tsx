import Link from "next/link";
import CopyInviteLink from "@/components/CopyInviteLink";
import DeleteEventButton from "@/components/DeleteEventButton";
import InviteRsvpForm from "@/components/InviteRsvpForm";
import type { getPublicInviteEvent } from "@/lib/eventQueries";

type EventData = NonNullable<Awaited<ReturnType<typeof getPublicInviteEvent>>>;

type PublicEventDetailProps = {
  event: EventData;
  isAdmin: boolean;
  submitted: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "full",
  timeStyle: "short",
});

export default function PublicEventDetail({
  event,
  isAdmin,
  submitted,
}: PublicEventDetailProps) {
  function getGoogleCalendarUrl() {
    const startDate = new Date(event.eventDate);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
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

      <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <dt className="mb-1 block text-sm font-medium text-gray-500">Date</dt>
          <dd className="text-lg font-semibold text-gray-900">
            <time dateTime={event.eventDate.toISOString()}>
              {dateFormatter.format(event.eventDate)}
            </time>
          </dd>
        </div>

        <div>
          <dt className="mb-1 block text-sm font-medium text-gray-500">
            Location
          </dt>
          <dd className="text-lg font-semibold text-gray-900">
            {event.locationName}
          </dd>
          <dd className="mt-1">
            <a
              href={event.locationUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-gray-500 underline underline-offset-4 transition-colors hover:text-black"
            >
              Open location
            </a>
          </dd>
        </div>
      </dl>

      {event.description && (
        <section className="border-t border-gray-100 pt-8">
          <h2 className="mb-2 text-sm font-medium text-gray-500">
            Description
          </h2>
          <p className="whitespace-pre-wrap text-base leading-7 text-gray-900">
            {event.description}
          </p>
        </section>
      )}

      {event.notes && (
        <section className="border-t border-gray-100 pt-8">
          <h2 className="mb-2 text-sm font-medium text-gray-500">Notes</h2>
          <p className="whitespace-pre-wrap text-base leading-7 text-gray-900">
            {event.notes}
          </p>
        </section>
      )}

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
          <div>
            <dt className="text-sm text-gray-500">Total guests</dt>
            <dd className="mt-1 text-2xl font-bold text-gray-900">
              {event.guests.length}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Accepted</dt>
            <dd className="mt-1 text-2xl font-bold text-gray-900">
              {acceptedCount}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Declined</dt>
            <dd className="mt-1 text-2xl font-bold text-gray-900">
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
                Thank you for your response. Your attendance status has been
                recorded.
              </p>
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
