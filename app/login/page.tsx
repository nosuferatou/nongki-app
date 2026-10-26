export const instant = false;
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import AdminLoginForm from "@/components/AdminLoginForm";
import Link from "next/link";

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
        <div className="mt-6 border-t border-gray-100 pt-6 text-center">
          <p className="mb-3 text-sm text-gray-600">
            Just looking for an event?
          </p>
          <Link
            href="/events"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 px-5 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
          >
            Browse Events
          </Link>
        </div>
      </section>
    </main>
  );
}