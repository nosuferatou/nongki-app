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
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 md:min-h-screen">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_2px_24px_rgba(15,23,42,0.06)] sm:p-10">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-blue-700">
          Nongki Admin
        </p>
        <h1 className="mt-3 text-center text-3xl font-bold tracking-tight text-slate-900">
          Sign in
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Enter your admin password to continue.
        </p>
        <AdminLoginForm />
        <div className="mt-6 border-t border-slate-100 pt-6 text-center">
          <p className="mb-3 text-sm text-slate-500">
            Just looking for an event?
          </p>
          <Link
            href="/events"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
          >
            Browse Events
          </Link>
        </div>
      </section>
    </main>
  );
}