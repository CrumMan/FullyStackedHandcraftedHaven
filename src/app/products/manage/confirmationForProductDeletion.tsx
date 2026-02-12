"use client"
import { products } from "@/app/lib/placeholder-data";
import { Condiment } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation"

interface DeleteProductCardProps {
    product: any;
}

function normalizeImg(path: string | null | undefined) {
  const cleaned = (path ?? "").replace("@/public", "").trim();
  if (!cleaned) return "/placeholder-product.jpg";
  if (cleaned.startsWith("http")) return cleaned;
  if (cleaned.startsWith("/")) return cleaned;
  return `/${cleaned}`;
}

export default function ConfirmToDeleteProduct({product}:DeleteProductCardProps ){
    const router = useRouter();
    const handleClick = (e:React.MouseEvent) => {
        e.preventDefault();
        const confirmed = window.confirm(`Are you sure you want to delete "${product.name}`)
        if(confirmed){router.push(`/products/delete/${product.id}`)}
    }
    return(
        <a onClick={handleClick}  className="border-2 border-red-500 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition bg-white cursor-pointer"
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

        </a>

    )
}