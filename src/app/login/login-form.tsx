"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "../lib/actions";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const result = await login(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.user) {
      window.location.href = '/account';
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-primary text-center mb-8">
            Login
          </h1>

          {message === "success" && (
            <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4">
              Account created successfully! Please login.
            </div>
          )}

          {message === "pending" && (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-4">
              Seller account created! Please wait for admin approval before
              logging in.
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary mb-1"
              >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-primary/60 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-secondary hover:underline">
              Register
            </Link>
          </p>

          <div className="mt-8 p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-primary/60 mb-2">Demo accounts:</p>
            <p className="text-xs text-primary/50">
              Admin: admin@handcraftedhaven.com / admin123
            </p>
            <p className="text-xs text-primary/50">
              Seller: jane@example.com / seller123
            </p>
            <p className="text-xs text-primary/50">
              Buyer: john@example.com / buyer123
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

