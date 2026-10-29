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
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 md:min-h-screen">
      <section className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_2px_16px_rgba(32,39,52,0.05)] transition-shadow dark:border-[#5C7057]/40 dark:bg-[#3b4a38] dark:shadow-none sm:p-6">
        <p className="text-center text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]">
          Nongki Admin
        </p>
        <h1 className="mt-3 text-center text-lg font-semibold tracking-tight text-[#202734] dark:text-[#D1EDD3] sm:text-xl">
          Sign in
        </h1>
        <p className="mt-2 text-center text-sm leading-relaxed text-slate-800 dark:text-[#D1EDD3]/90 sm:text-[15px]">
          Enter your admin password to continue.
        </p>
        <AdminLoginForm />
        <div className="mt-4 border-t border-slate-200/60 pt-4 text-center dark:border-[#5C7057]/50">
          <p className="mb-3 text-sm leading-relaxed text-slate-800 dark:text-[#D1EDD3]/90 sm:text-[15px]">
            Just looking for an event?
          </p>
          <Link
            href="/events"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-secondary-light/40 px-5 py-2.5 text-sm font-semibold text-secondary-dark transition-all hover:bg-secondary-light active:scale-[0.98] dark:bg-[#5C7057]/40 dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/70"
          >
            Browse Events
          </Link>
        </div>
      </section>
    </main>
  );
}