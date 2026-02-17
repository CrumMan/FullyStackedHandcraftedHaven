"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { changePassword } from "@/app/lib/actions";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await changePassword(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/account?message=password-changed");
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-primary text-center mb-8">
            Change Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-primary mb-1"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-primary mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
              <p className="text-xs text-primary/60 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-primary mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>

          <p className="text-center text-primary/60 mt-6">
            <Link href="/account" className="text-secondary hover:underline">
              Back to Account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
