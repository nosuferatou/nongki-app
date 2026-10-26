import { getRecentEvents } from "@/actions/eventActions";
import DashboardTabs from "@/components/DashboardTabs";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export const instant = false;

export default async function Home() {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const events = await getRecentEvents();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">NONGKI.</h1>
        <p className="text-sm font-medium text-gray-600">Admin</p>
      </header>
      <DashboardTabs events={events} />
    </div>
  );
}
