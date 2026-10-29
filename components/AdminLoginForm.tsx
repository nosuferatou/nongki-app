"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/actions/authActions";

const initialState: LoginState = {};

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-[13px] font-medium text-slate-500 dark:text-[#ACC5A6]"
        >
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="block min-h-11 w-full rounded-xl border border-slate-200/60 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-primary-light focus:outline-none focus:ring-4 focus:ring-primary-light/40 dark:border-[#5C7057]/50 dark:bg-[#2b3629] dark:text-[#D1EDD3] dark:placeholder:text-[#ACC5A6] sm:text-[15px]"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-secondary-light/40 px-4 py-2.5 text-sm font-semibold text-secondary-dark transition-all hover:bg-secondary-light active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#5C7057]/40 dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/70"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
