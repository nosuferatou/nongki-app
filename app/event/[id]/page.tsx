export const instant = false;
import CopyInviteLink from "@/components/CopyInviteLink";
import DeleteEventButton from "@/components/DeleteEventButton";
import { getEventById } from "@/lib/eventQueries";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { redirect } from "next/navigation";


type Props = { params: Promise<{ id: string }> };

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "full",
  timeStyle: "short",
});

export default async function EventDetailPage({ params }: Props) {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const event = await getEventById(resolvedParams.id);

  if (!event) {
    return (
      <main className="mx-auto max-w-3xl space-y-8 px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-black"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-black">Event not found</h1>
      </main>
    );
  }

  const acceptedCount = event.guests.filter(
    (guest) => guest.status === "ACCEPT",
  ).length;
  const declinedCount = event.guests.filter(
    (guest) => guest.status === "DECLINE",
  ).length;

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-black"
      >
        ← Back to Dashboard
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
        <DeleteEventButton eventId={event.id} />
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
        <CopyInviteLink
          inviteUrl={`http://localhost:3000/invite/${event.id}`}
        />
      </section>

      <section
        aria-labelledby="attendance-heading"
        className="border-t border-gray-100 pt-8"
      >
        <h2 id="attendance-heading" className="mb-5 text-xl font-bold text-black">
          Attendance summary
        </h2>
        <dl className="grid grid-cols-3 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Total Guests</dt>
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
                  {guest.reason && (
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
                  {guest.status === "ACCEPT"
                    ? "Accepted"
                    : guest.status === "DECLINE"
                      ? "Declined"
                      : guest.status}
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
