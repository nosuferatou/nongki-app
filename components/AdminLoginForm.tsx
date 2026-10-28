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
          className="mb-1.5 block text-sm font-semibold text-secondary-dark"
        >
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="block min-h-11 w-full rounded-xl border border-secondary-dark/20 bg-white px-4 py-3 text-base text-primary-dark placeholder:text-secondary-dark/60 transition focus:border-primary-light focus:outline-none focus:ring-4 focus:ring-primary-light/40"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="min-h-11 w-full rounded-xl bg-primary-light px-4 py-3 text-sm font-semibold text-primary-dark transition duration-150 hover:bg-secondary-light active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
