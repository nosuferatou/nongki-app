export const instant = false;
import { redirect } from "next/navigation";
import { connection } from "next/server";
import DashboardEventList from "@/components/DashboardEventList";
import AdminLayoutShell from "@/components/AdminLayoutShell";
import { logoutAction } from "@/actions/authActions";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getPublicEvents } from "@/lib/eventQueries";
import { ThemeToggle } from "@/components/ThemeProvider";

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
            <p className="text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]">Workspace</p>
            <h1 className="mt-1 text-lg font-semibold tracking-tight text-[#202734] dark:text-[#D1EDD3] sm:text-xl">
              Event management
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm font-medium text-secondary-dark dark:text-[#ACC5A6]">Admin</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-secondary-dark/20 bg-white px-4 py-2.5 text-sm font-semibold text-secondary-dark transition-all hover:bg-secondary-light/40 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark dark:border-[#5C7057]/50 dark:bg-[#3b4a38] dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/40"
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
