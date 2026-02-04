"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "../lib/actions";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const result = await register(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      const role = formData.get("role");
      if (role === "Seller") {
        router.push("/login?message=pending");
      } else {
        router.push("/login?message=success");
      }
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-primary text-center mb-8">
            Create Account
          </h1>

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-primary mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-primary mb-1">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              >
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller (requires approval)</option>
              </select>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-primary mb-1">
                Bio (optional)
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
                placeholder="Tell us about yourself..."
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-primary/60 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-secondary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
