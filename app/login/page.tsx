import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import AdminLoginForm from "@/components/AdminLoginForm";

export default async function LoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/");
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-gray-200/80 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
          Nongki Admin
        </p>
        <h1 className="mt-3 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Enter your admin password to continue.
        </p>
        <AdminLoginForm />
      </section>
    </main>
  );
}