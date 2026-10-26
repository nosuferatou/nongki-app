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
          className="min-w-0 flex-1 rounded-xl bg-gray-100 p-4 font-mono text-sm text-gray-900"
          readOnly
          value={inviteUrl}
        />
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {copyError && (
        <p role="alert" className="mt-2 text-sm text-gray-700">
          {copyError}
        </p>
      )}
    </div>
  );
}
