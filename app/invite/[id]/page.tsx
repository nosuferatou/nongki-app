import PublicEventDetail from "@/components/PublicEventDetail";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getPublicInviteEvent } from "@/lib/eventQueries";

export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ submitted?: string; status?: string }>;
};

export default async function InvitePage({
  params,
  searchParams,
}: Props) {
  const [resolvedParams, resolvedSearchParams, isAdmin] = await Promise.all([
    params,
    searchParams,
    isAdminAuthenticated(),
  ]);
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
    <PublicEventDetail
      event={event}
      isAdmin={isAdmin}
      submitted={resolvedSearchParams.submitted === "1"}
      submittedStatus={
        resolvedSearchParams.status === "ACCEPT" ||
        resolvedSearchParams.status === "DECLINE"
          ? resolvedSearchParams.status
          : null
      }
    />
  );
}
