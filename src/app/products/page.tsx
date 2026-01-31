import Link from "next/link";

// placeholder data - will be replaced with database fetch
const products = [
  {
    id: "1",
    name: "Handmade Vase",
    price: 45.99,
    seller: "Jane Artisan",
    image: "/placeholder.jpg",
  },
  {
    id: "2",
    name: "Wooden Bowl",
    price: 32.5,
    seller: "John Craftsman",
    image: "/placeholder.jpg",
  },
  {
    id: "3",
    name: "Ceramic Mug",
    price: 18.0,
    seller: "Jane Artisan",
    image: "/placeholder.jpg",
  },
  {
    id: "4",
    name: "Knit Scarf",
    price: 55.0,
    seller: "Mary Knitter",
    image: "/placeholder.jpg",
  },
  {
    id: "5",
    name: "Leather Wallet",
    price: 75.0,
    seller: "John Craftsman",
    image: "/placeholder.jpg",
  },
  {
    id: "6",
    name: "Glass Ornament",
    price: 22.99,
    seller: "Mary Knitter",
    image: "/placeholder.jpg",
  },
  {
    id: "7",
    name: "Woven Basket",
    price: 38.0,
    seller: "Jane Artisan",
    image: "/placeholder.jpg",
  },
  {
    id: "8",
    name: "Clay Pot",
    price: 29.99,
    seller: "John Craftsman",
    image: "/placeholder.jpg",
  },
  {
    id: "9",
    name: "Beaded Necklace",
    price: 42.0,
    seller: "Mary Knitter",
    image: "/placeholder.jpg",
  },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-primary text-center mb-8">
            Products
          </h1>

          {/* product grid */}
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
                    <p className="text-white/80">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-white/60">{product.seller}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
