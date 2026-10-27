export const instant = false;
import { redirect } from "next/navigation";
import { connection } from "next/server";
import DashboardTabs from "@/components/DashboardTabs";
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
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NONGKI.          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Find your next gathering.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">Admin</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      <DashboardTabs events={events} />
    </div>
  );
}
