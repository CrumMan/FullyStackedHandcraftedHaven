"use client"
import { getProductsByUserId } from "@/app/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function normalizeImg(path: string | null | undefined) {
  const cleaned = (path ?? "").replace("@/public", "").trim();
  if (!cleaned) return "/placeholder-product.jpg";
  if (cleaned.startsWith("http")) return cleaned;
  if (cleaned.startsWith("/")) return cleaned;
  return `/${cleaned}`;
}

export default function GetSellerProducts(){
    const router = useRouter()
    const [products,setProducts] = useState<any[]>([]);

    useEffect(()=> {
        const fetchProducts = async () => {
            const data= await getProductsByUserId();
            setProducts(data);
        }
        fetchProducts();
    }, [])



    return(
        <main className="min-h-screen bg-white">
        <section className="p-8">
        <div className="max-w-6xl mx-auto">
        <Link href={`/products/create`}>List A Product (Click here)<br></br><br></br></Link>
        <h1>Choose a Product to manage</h1>
        {products.length === 0? (<p>Loading or No Listings to display</p>) : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{products.map((product:any)=>(
            // <Link key={product.id} href={`products/manage?id=${product.id}`}>{product.name} <br></br></Link>
            <Link
                    key={product.id}
                    href={`/products/manage/edit/${product.id}`}
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
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </Link>
        ))}
        </div>
        }
        </div>
        </section>
        </main>
    )

}