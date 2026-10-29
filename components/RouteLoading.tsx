type RouteLoadingProps = {
  label: string;
};

export default function RouteLoading({ label }: RouteLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center"
    >
      <svg
        aria-hidden="true"
        className="size-8 animate-spin text-primary-dark dark:text-[#D1EDD3]"
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
      <p className="text-sm font-medium text-slate-500 dark:text-[#ACC5A6]">{label}</p>
    </div>
  );
}
