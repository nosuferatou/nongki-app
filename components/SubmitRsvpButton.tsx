"use client";

import { useFormStatus } from "react-dom";

type SubmitRsvpButtonProps = {
  label: string;
  waitlist?: boolean;
};

export default function SubmitRsvpButton({
  label,
  waitlist = false,
}: SubmitRsvpButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark disabled:cursor-not-allowed disabled:opacity-70 ${
        waitlist
          ? "bg-secondary-dark text-white hover:bg-primary-dark dark:bg-[#2b3629] dark:text-[#D1EDD3] dark:hover:bg-[#2b3629]/80"
          : "bg-secondary-light/40 text-secondary-dark hover:bg-secondary-light dark:bg-[#5C7057]/40 dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/70"
      }`}
    >
      {pending && (
        <svg
          aria-hidden="true"
          className="size-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647Z"
          />
        </svg>
      )}
      <span aria-live="polite">
        {pending ? "Submitting..." : label}
      </span>
    </button>
  );
}
