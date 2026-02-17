import { getProductsByUserId, getCurrentUser } from "@/app/lib/actions";
import Link from "next/link";
import ConfirmToDeleteProduct from "./confirmationForProductDeletion";

function normalizeImg(path: string | null | undefined) {
  const cleaned = (path ?? "").replace("@/public", "").trim();
  if (!cleaned) return "/placeholder-product.jpg";
  if (cleaned.startsWith("http")) return cleaned;
  if (cleaned.startsWith("/")) return cleaned;
  return `/${cleaned}`;
}

export default async function GetSellerProducts(){
    const products= await getProductsByUserId();  
    const user = await getCurrentUser(); 

    if(user == null || !user.approved){return <p>User is not loaded or approved to manage products</p>}
    const manageProduct = (products.length === 0? (<p className="text-center text-primary/60"> No Listings to display</p>) : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{products.map((product:any)=>(
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
    )
    const deleteProduct = (products.length == 0 ? (
            <p className="text-center text-primary/60">
              No products found.
            </p>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ConfirmToDeleteProduct key={product.id} product={product}/>
                ))}
            </div>
          ))


    
    return(
        <main className="min-h-screen bg-white">
        <section className="p-8">
        <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
        <Link className="inline-block bg-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" href={`/products/create`}>List a Product</Link>
        </div>
        <h1 className="text-center">Choose a Product to manage</h1>
        {manageProduct}
        <h1 className="text-center">Choose a Product to Delete</h1>
        {deleteProduct}
        </div>
        </section>
        </main>
    )
}