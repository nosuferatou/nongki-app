import CreateEventForm from "@/components/CreateEventForm";
import AdminLayoutShell from "@/components/AdminLayoutShell";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export const instant = false;

export default async function CreateEventPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  return (
    <AdminLayoutShell>
      <CreateEventForm />
    </AdminLayoutShell>
  );
}
