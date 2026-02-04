import { redirect } from "next/navigation";
import { getCurrentUser, approveSeller } from "../lib/actions";
import { getPendingSellers } from "../lib/data";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "Admin") {
    redirect("/login");
  }

  const pendingSellers = await getPendingSellers();

  async function handleApprove(formData: FormData) {
    "use server";
    const sellerId = formData.get("sellerId") as string;
    await approveSeller(sellerId);
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-primary/60 mb-8">Welcome, {user.name}</p>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Pending Seller Approvals
            </h2>

            {pendingSellers.length === 0 ? (
              <p className="text-primary/60 bg-primary/5 p-4 rounded-lg">
                No pending seller requests.
              </p>
            ) : (
              <div className="space-y-4">
                {pendingSellers.map((seller) => (
                  <div
                    key={seller.id}
                    className="border border-primary/20 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-primary">{seller.name}</p>
                      <p className="text-sm text-primary/60">@{seller.username}</p>
                      <p className="text-sm text-primary/60">{seller.email}</p>
                      {seller.bio && (
                        <p className="text-sm text-primary/80 mt-2">{seller.bio}</p>
                      )}
                    </div>

                    <form action={handleApprove}>
                      <input type="hidden" name="sellerId" value={seller.id} />
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
