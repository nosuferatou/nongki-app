import CreateEventForm from "@/components/CreateEventForm";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export const instant = false;

export default async function CreateEventPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  return <CreateEventForm />;
}
