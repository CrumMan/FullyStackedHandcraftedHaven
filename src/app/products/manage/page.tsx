import { getProductsByUserId, getCurrentUser } from "@/app/lib/actions";
import Link from "next/link";
import ProductCard from "./product-card";

export default async function GetSellerProducts() {
  const products = await getProductsByUserId();
  const user = await getCurrentUser();

  if (user == null || !user.approved) {
    return (
      <main className="min-h-screen bg-white p-8">
        <p className="text-center text-primary/60">
          User is not loaded or approved to manage products
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <Link
              className="inline-block bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              href="/products/create"
            >
              List a Product
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-primary text-center mb-6">
            Manage Your Products
          </h1>

          {products.length === 0 ? (
            <p className="text-center text-primary/60">
              No listings to display. Create your first product above!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}