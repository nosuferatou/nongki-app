export const instant = false;
import { redirect } from "next/navigation";
import { connection } from "next/server";
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
            <p className="text-sm font-semibold text-secondary-dark">Workspace</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-primary-dark">
              Event management
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm font-medium text-secondary-dark">Admin</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="min-h-11 rounded-xl border border-secondary-dark/20 bg-white px-4 py-2 text-sm font-semibold text-secondary-dark transition-colors hover:bg-secondary-light/40 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark"
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
