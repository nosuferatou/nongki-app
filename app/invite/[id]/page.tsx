import InviteRsvpForm from "@/components/InviteRsvpForm";
import { getPublicInviteEvent } from "@/lib/eventQueries";

export const instant = false;

type Props = { params: Promise<{ id: string }> };

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "full",
  timeStyle: "short",
});

export default async function InvitePage({ params }: Props) {
  const resolvedParams = await params;
  const event = await getPublicInviteEvent(resolvedParams.id);

  if (!event) {
    return (
      <main className="flex min-h-[85vh] items-center justify-center px-4 py-12">
        <section className="w-full max-w-xl rounded-3xl border border-gray-200/80 bg-white p-8 text-center shadow-sm sm:p-10">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Invitation not found
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            This invitation may have expired or the link may be incorrect.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <article className="w-full max-w-xl rounded-3xl border border-gray-200/80 bg-white p-8 shadow-sm sm:p-10">
        <header className="mb-8">
          <span className="mb-2 block text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
            You&apos;re invited
          </span>
          <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {event.title}
          </h1>

          <dl className="mb-8 flex flex-col justify-around gap-4 rounded-2xl bg-gray-50 p-5 text-center sm:flex-row">
            <div>
              <dt className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                Date and time
              </dt>
              <dd className="text-sm font-semibold text-gray-900">
                <time dateTime={event.eventDate.toISOString()}>
                  {dateFormatter.format(event.eventDate)}
                </time>
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                Location
              </dt>
              <dd className="text-sm font-semibold text-gray-900">
                {event.locationName}
              </dd>
              <dd className="mt-1">
                <a
                  href={event.locationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-gray-600 underline underline-offset-4 transition-colors hover:text-black"
                >
                  View location
                </a>
              </dd>
            </div>
          </dl>

          {event.description && (
            <p className="whitespace-pre-wrap text-center text-sm leading-6 text-gray-600">
              {event.description}
            </p>
          )}
        </header>

        {event.isClosed ? (
          <section
            aria-labelledby="rsvp-closed-heading"
            className="rounded-2xl bg-gray-50 px-6 py-8 text-center"
          >
            <h2
              id="rsvp-closed-heading"
              className="text-lg font-bold tracking-wide text-gray-900"
            >
              RSVP IS CLOSED
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              This event is no longer accepting responses.
            </p>
          </section>
        ) : (
          <InviteRsvpForm eventId={event.id} />
        )}
      </article>
    </main>
  );
}
