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
        <section className="w-full max-w-xl rounded-3xl border border-slate-100 bg-white p-5 text-center shadow-[0_2px_16px_rgba(32,39,52,0.05)] transition-shadow dark:border-[#5C7057]/40 dark:bg-[#3b4a38] dark:shadow-none sm:p-6">
          <h1 className="text-lg font-semibold tracking-tight text-[#202734] dark:text-[#D1EDD3] sm:text-xl">
            Invitation not found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-800 dark:text-[#D1EDD3]/90 sm:text-[15px]">
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
