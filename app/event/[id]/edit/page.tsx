import { notFound, redirect } from "next/navigation";
import AdminLayoutShell from "@/components/AdminLayoutShell";
import EditEventForm from "@/components/EditEventForm";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getEventForEdit } from "@/lib/eventQueries";

export const instant = false;

export default async function EditEventPage({
  params,
}: PageProps<"/event/[id]/edit">) {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const { id } = await params;
  const event = await getEventForEdit(id);
  if (!event) notFound();

  return (
    <AdminLayoutShell>
      <EditEventForm
        event={{
          ...event,
          eventDate: event.eventDate.toISOString(),
          endDate: event.endDate.toISOString(),
        }}
      />
    </AdminLayoutShell>
  );
}
