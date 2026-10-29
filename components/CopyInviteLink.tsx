"use client";

import { useEffect, useState } from "react";

type CopyInviteLinkProps = {
  inviteUrl: string;
};

export default function CopyInviteLink({ inviteUrl }: CopyInviteLinkProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  async function handleCopy() {
    setCopyError(null);

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy invite link.", error);
      setCopied(false);
      setCopyError("Could not copy the link. Please copy it manually.");
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="Shareable invite link"
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-200/60 bg-slate-50 p-4 font-mono text-sm text-slate-800 dark:border-[#5C7057]/50 dark:bg-[#2b3629] dark:text-[#D1EDD3]"
          readOnly
          value={inviteUrl}
        />
        <button
          type="button"
          onClick={handleCopy}
          className="min-h-11 rounded-xl border border-slate-200/60 px-5 py-2.5 text-sm font-semibold text-secondary-dark transition-all hover:bg-secondary-light/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark active:scale-[0.98] dark:border-[#5C7057]/50 dark:text-[#D1EDD3] dark:hover:bg-[#5C7057]/30"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {copyError && (
        <p role="alert" className="mt-2 text-sm text-rose-700 dark:text-rose-300">
          {copyError}
        </p>
      )}
    </div>
  );
}
