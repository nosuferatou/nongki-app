import PublicEventDetail from "@/components/PublicEventDetail";
import AdminLayoutShell from "@/components/AdminLayoutShell";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getPublicInviteEvent } from "@/lib/eventQueries";

export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ submitted?: string; status?: string }>;
};

export default async function EventDetailPage({
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
    const notFoundContent = (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-black">Event not found</h1>
      </main>
    );
    return isAdmin ? (
      <AdminLayoutShell>{notFoundContent}</AdminLayoutShell>
    ) : (
      notFoundContent
    );
  }

  const content = (
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
  return isAdmin ? <AdminLayoutShell>{content}</AdminLayoutShell> : content;
}
