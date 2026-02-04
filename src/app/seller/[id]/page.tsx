import Link from "next/link";
import { getSellerById, getProductsBySeller } from "@/app/lib/data";
import { notFound } from "next/navigation";

function normalizeImg(path: string | null | undefined) {
  const cleaned = (path ?? "").replace("@/public", "").trim();
  if (!cleaned) return "/placeholder-product.jpg";
  if (cleaned.startsWith("http")) return cleaned;
  if (cleaned.startsWith("/")) return cleaned;
  return `/${cleaned}`;
}

export default async function SellerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seller = await getSellerById(id);

  if (!seller) {
    notFound();
  }

  const products = await getProductsBySeller(id);

  return (
    <main className="min-h-screen bg-white">
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-secondary rounded-lg min-h-80 flex items-center justify-center">
              <span className="text-white">Seller Photo</span>
            </div>

            <div className="text-primary">
              <h1 className="text-2xl font-bold mb-2">{seller.name}</h1>
              <p className="text-primary/60 mb-4">@{seller.username}</p>

              <div className="mb-6">
                <p className="font-medium mb-2">About:</p>
                <p className="text-primary/80">
                  {seller.bio || "No bio available"}
                </p>
              </div>

              {seller.role === "Seller" && seller.approved && (
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  Verified Seller
                </span>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-6">
              Products by {seller.name}
            </h2>

            {products.length === 0 ? (
              <p className="text-primary/60">No products listed yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
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
                        Seller: {seller.name}
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
        </div>
      </section>
    </main>
  );
}
