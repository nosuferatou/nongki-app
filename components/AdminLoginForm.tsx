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
          className="mb-1.5 block text-sm font-medium text-gray-900"
        >
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="block w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-base text-black transition-colors focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="min-h-12 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
