import Link from "next/link";
import { getProductById } from "@/app/lib/data";
import { notFound } from "next/navigation";

function normalizeImg(path: string | null | undefined) {
  const cleaned = (path ?? "").replace("@/public", "").trim();
  if (!cleaned) return "/placeholder-product.jpg";
  if (cleaned.startsWith("http")) return cleaned;
  if (cleaned.startsWith("/")) return cleaned;
  return `/${cleaned}`;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // placeholder reviews for now
  const reviews = [
    {
      id: "1",
      author: "Customer A",
      rating: 5,
      comment: "Beautiful craftsmanship! Exactly as described.",
    },
    {
      id: "2",
      author: "Customer B",
      rating: 4,
      comment: "Great quality, shipping was fast.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* product details section */}
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* product image */}
            <div className="border rounded-lg overflow-hidden bg-gray-100">
              <div className="relative w-full h-80">
                <img
                  src={normalizeImg(product.productImg)}
                  alt={product.name ?? "Product"}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

            {/* product info */}
            <div className="text-primary">
              <p className="text-sm text-primary/60 mb-1">
                <Link
                  href={`/seller/${product.sellerId}`}
                  className="hover:underline"
                >
                  {product.seller}
                </Link>
              </p>
              <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
              <p className="text-sm text-primary/60 mb-4">
                {product.quantity} in stock
              </p>

              <p className="text-xl font-semibold mb-4">
                ${Number(product.price).toFixed(2)}
              </p>

              <div className="mb-6">
                <p className="font-medium mb-2">Description:</p>
                <p className="text-primary/80">{product.description}</p>
              </div>

              <button className="bg-secondary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* reviews section */}
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-lg p-6 border border-primary/10">
            <h2 className="text-xl font-bold text-primary mb-4">Reviews</h2>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-primary/10 pb-4 last:border-0"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-primary">
                        {review.author}
                      </span>
                      <span className="text-primary/60">
                        {review.rating}/5 stars
                      </span>
                    </div>
                    <p className="text-primary/80">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-primary/60">No reviews yet.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
