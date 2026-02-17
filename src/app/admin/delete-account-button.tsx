"use client";

import { adminDeleteAccount } from "../lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteAccountButton({
  accountId,
  accountName,
}: {
  accountId: string;
  accountName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = confirm(
      `Delete account "${accountName}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setLoading(true);
    await adminDeleteAccount(accountId);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
