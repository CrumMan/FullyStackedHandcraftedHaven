import { redirect } from "next/navigation";
import { getCurrentUser, approveSeller } from "../lib/actions";
import { getPendingSellers, getAllAccounts } from "../lib/data";
import { DeleteAccountButton } from "./delete-account-button";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "Admin") {
    redirect("/login");
  }

  const pendingSellers = await getPendingSellers();
  const allAccounts = await getAllAccounts();

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

          {/* Pending Seller Approvals */}
          <div className="mb-12">
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

          {/* All Accounts Management */}
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4">
              Manage Accounts
            </h2>

            {allAccounts.length === 0 ? (
              <p className="text-primary/60 bg-primary/5 p-4 rounded-lg">
                No accounts found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-primary/10 rounded-lg">
                  <thead className="bg-primary/5">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-primary">
                        Name
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-primary">
                        Email
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-primary">
                        Role
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-primary">
                        Status
                      </th>
                      <th className="text-right p-3 text-sm font-medium text-primary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAccounts.map((account) => (
                      <tr
                        key={account.id}
                        className="border-t border-primary/10"
                      >
                        <td className="p-3">
                          <p className="font-medium text-primary">
                            {account.name}
                          </p>
                          <p className="text-xs text-primary/60">
                            @{account.username}
                          </p>
                        </td>
                        <td className="p-3 text-sm text-primary/80">
                          {account.email}
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              account.role === "Admin"
                                ? "bg-purple-100 text-purple-800"
                                : account.role === "Seller"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {account.role}
                          </span>
                        </td>
                        <td className="p-3">
                          {account.role === "Seller" ? (
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                account.approved
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {account.approved ? "Approved" : "Pending"}
                            </span>
                          ) : (
                            <span className="text-xs text-primary/40">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {account.id !== user.id ? (
                            <DeleteAccountButton
                              accountId={account.id}
                              accountName={account.name}
                            />
                          ) : (
                            <span className="text-xs text-primary/40">
                              (You)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
