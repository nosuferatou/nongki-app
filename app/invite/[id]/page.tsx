import PublicEventDetail from "@/components/PublicEventDetail";
import AdminLayoutShell from "@/components/AdminLayoutShell";
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
    const notFoundContent = (
      <main className="flex min-h-[85vh] items-center justify-center px-4 py-12">
        <section className="w-full max-w-xl rounded-3xl bg-white p-5 text-center shadow-[0_2px_24px_rgba(32,39,52,0.07)] sm:p-10">
          <h1 className="text-2xl font-bold tracking-tight text-primary-dark">
            Invitation not found
          </h1>
          <p className="mt-3 text-sm text-secondary-dark">
            This invitation may have expired or the link may be incorrect.
          </p>
        </section>
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
        resolvedSearchParams.status === "ATTENDING" ||
        resolvedSearchParams.status === "DECLINED" ||
        resolvedSearchParams.status === "WAITLISTED"
          ? resolvedSearchParams.status
          : null
      }
    />
  );
  return isAdmin ? <AdminLayoutShell>{content}</AdminLayoutShell> : content;
}
