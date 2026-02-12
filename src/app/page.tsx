import Link from "next/link";
import { getProducts } from "@/app/lib/data";
import { getCurrentUser, requestSellerAccount } from "@/app/lib/actions";

function normalizeImg(path: string | null | undefined) {
  const cleaned = (path ?? "").replace("@/public", "").trim();
  if (!cleaned) return "/placeholder-product.jpg";
  if (cleaned.startsWith("http")) return cleaned;
  if (cleaned.startsWith("/")) return cleaned;
  return `/${cleaned}`;
}

export default async function Home() {
  const products = await getProducts();
  const featured = products.slice(0, 6);
  const user = await getCurrentUser();

  async function handleRequestSeller() {
    "use server";
    if (!user) return;
    await requestSellerAccount(user.id);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* hero section */}
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-primary text-center mb-6">
            Handcrafted Haven
          </h1>

          <div className="bg-secondary text-white p-8 rounded-lg min-h-64 flex items-center justify-center">
            <div className="max-w-2xl text-center flex flex-col gap-4">
              <p className="text-lg md:text-xl">
                Discover unique handmade products from talented artisans.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/products"
                  className="bg-white text-secondary px-4 py-2 rounded-md font-semibold hover:opacity-90"
                >
                  Browse products
                </Link>

                {!user && (
                  <Link
                    href="/register"
                    className="border border-white px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-secondary"
                  >
                    Join as Seller
                  </Link>
                )}

                {user?.role === "Buyer" && (
                  <form action={handleRequestSeller}>
                    <button
                      type="submit"
                      className="border border-white px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-secondary"
                    >
                      Request Seller Account
                    </button>
                  </form>
                )}
              </div>

              {user?.role === "Seller" && !user.approved && (
                <p className="text-sm bg-yellow-200 text-yellow-900 px-4 py-2 rounded-md">
                  Your seller account is pending admin approval.
                </p>
              )}

              <p className="text-sm opacity-90">
                Handmade. Curated. Delivered with care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* featured items */}
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold text-primary text-center mb-6">
            Featured Items
          </h2>

          {featured.length === 0 ? (
            <p className="text-center text-primary/60">
              No products found. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
                >
                  <div className="relative w-full h-56 bg-gray-100 overflow-hidden group">
                    <img
                      src={normalizeImg(product.productImg)}
                      alt={product.name ?? "Product"}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-primary text-lg">
                      {product.name}
                    </h3>
                    <p className="text-secondary font-bold">
                      ${Number(product.price).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Seller: {product.seller}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
