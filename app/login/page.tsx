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
      <section className="w-full max-w-md rounded-3xl bg-white p-5 shadow-[0_2px_24px_rgba(32,39,52,0.07)] sm:p-10">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-secondary-dark">
          Nongki Admin
        </p>
        <h1 className="mt-3 text-center text-3xl font-bold tracking-tight text-primary-dark">
          Sign in
        </h1>
        <p className="mt-2 text-center text-sm text-secondary-dark">
          Enter your admin password to continue.
        </p>
        <AdminLoginForm />
        <div className="mt-6 border-t border-secondary-dark/10 pt-6 text-center">
          <p className="mb-3 text-sm text-secondary-dark">
            Just looking for an event?
          </p>
          <Link
            href="/events"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-secondary-dark/20 px-5 py-2 text-sm font-semibold text-secondary-dark transition-colors hover:bg-secondary-light/40 active:scale-[0.98]"
          >
            Browse Events
          </Link>
        </div>
      </section>
    </main>
  );
}