"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    productImg?: string | null;
  };
}

function normalizeImg(path: string | null | undefined) {
  const cleaned = (path ?? "").replace("@/public", "").trim();
  if (!cleaned) return "/placeholder-product.jpg";
  if (cleaned.startsWith("http")) return cleaned;
  if (cleaned.startsWith("/")) return cleaned;
  return `/${cleaned}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This cannot be undone.`
    );
    if (confirmed) {
      router.push(`/products/delete/${product.id}`);
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white">
      <Link href={`/products/manage/edit/${product.id}`}>
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
          <h3 className="font-semibold text-primary text-lg">{product.name}</h3>
          <p className="text-secondary font-bold">
            ${Number(product.price).toFixed(2)}
          </p>
          <p className="text-sm text-gray-700 line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4 flex gap-2">
        <Link
          href={`/products/manage/edit/${product.id}`}
          className="flex-1 text-center bg-secondary text-white px-3 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="flex-1 text-center bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
