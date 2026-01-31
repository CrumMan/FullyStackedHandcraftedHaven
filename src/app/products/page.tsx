import Link from "next/link";
import { getProducts } from "../lib/data";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white">
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-primary text-center mb-8">
            Products
          </h1>

          {products.length === 0 ? (
            <p className="text-center text-primary/60">
              No products found. Run /seed to populate the database.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <div className="bg-secondary text-white rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
                    {/* product image placeholder */}
                    <div className="h-48 bg-secondary flex items-center justify-center">
                      <span className="text-white/50">Product Image</span>
                    </div>

                    {/* product info */}
                    <div className="p-4 text-center">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-white/80">
                        ${Number(product.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-white/60">{product.seller}</p>
                    </div>
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
