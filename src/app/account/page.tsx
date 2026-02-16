import { getCurrentUser, requestSellerAccount } from "../lib/actions";
import Link from "next/link";
import DeleteAccountLink from "./DeleteAccountLink";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <p>User is not loaded.</p>;
  }

  const admin =
    user.role === "Admin" ? (
      <Link className="bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center" href="/admin">Admin Control</Link>
    ) : null;

  const seller =
    (user.role === "Seller" && user.approved)|| user.role === "Admin" ? (
      <Link className="bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center" href="/products/manage">Manage Your Products</Link>
    ) : null;

  return (
    <main  className="min-h-screen bg-white">
      <section className="flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-2">
            Account Dashboard
          </h1>

          <p className="text-primary/60 mb-8">Welcome, {user.name}</p>
          <div className="flex flex-col gap-4">
            <Link className="bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center" href="./account/edit-account">Edit Account</Link>
            {admin}
            {seller}
            {/* Buyer Request Button */}
            {user.role === "Buyer" && (
              <form
              action={async (formData: FormData) => {
                "use server";
                const userId = formData.get("userId") as string;
                await requestSellerAccount(userId);
              }}
              className="bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center"
              >
                <input type="hidden" name="userId" value={user.id} />
                <button
                  type="submit"
                  className="bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center "
                >
                  Request Seller Account
                </button>
              </form>
            )}
            <DeleteAccountLink />

            {/* Pending Message */}
            {user.role === "Seller" && !user.approved && (
              <p className="mt-4 text-yellow-600">
                Your seller account is pending admin approval.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}