import Link from "next/link";
import Image from "next/image";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Fix DB image paths
function normalizeImg(path: string | null) {
  const cleaned = (path ?? "").replace("@/public", "").trim();

  if (!cleaned) return "/placeholder.jpg";
  if (cleaned.startsWith("http")) return cleaned;
  if (cleaned.startsWith("/")) return cleaned;

  return `/${cleaned}`;
}

export default async function Home() {
  const rows = await sql`
    SELECT
      p.id,
      p.name,
      p.price,
      p.quantity,
      p.description,
      p.productimg,
      a.name as "sellerName"
    FROM products p
    JOIN account a ON a.id = p.userid
    ORDER BY p.name ASC
    LIMIT 6;
  `;

  const featured = rows.map((p: any) => ({
    ...p,
    productImg: normalizeImg(p.productimg),
  }));

  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}
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

                <Link
                  href="/products"
                  className="border border-white px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-secondary"
                >
                  View featured items
                </Link>
              </div>

              <p className="text-sm opacity-90">
                Handmade. Curated. Delivered with care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold text-primary text-center mb-6">
            Featured Items
          </h2>

          {featured.length === 0 ? (
            <p className="text-center">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {featured.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
                >
                {/* Image */}
                <div className="relative w-full h-56 bg-gray-100 overflow-hidden group">

                  <Image
                    src={p.productImg}
                    alt={p.name}
                    fill
                    className="
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-110
                    "
                  />

                  {/* subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-primary text-lg">
                      {p.name}
                    </h3>

                    <p className="text-secondary font-bold">
                      ${Number(p.price).toFixed(2)}
                    </p>

                    <p className="text-sm text-gray-600">
                      Seller: {p.sellerName}
                    </p>

                    <p className="text-sm text-gray-700 line-clamp-2">
                      {p.description}
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
