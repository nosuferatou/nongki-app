export const instant = false;
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import DashboardEventList from "@/components/DashboardEventList";
import AdminLayoutShell from "@/components/AdminLayoutShell";
import { logoutAction } from "@/actions/authActions";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getPublicEvents } from "@/lib/eventQueries";

export default async function Home() {
  await connection();

  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    redirect("/login");
  }

  const events = await getPublicEvents();
  return (
    <AdminLayoutShell>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-blue-700">Workspace</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Event management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              All your gatherings, in one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:scale-[0.98]"
            >
              <span aria-hidden="true">+</span>
              Create event
            </Link>
            <span className="text-sm font-medium text-slate-500">Admin</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="min-h-10 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Log out
              </button>
            </form>
          </div>
        </header>

        <DashboardEventList events={events} />
      </main>
    </AdminLayoutShell>
  );
}
