"use client"
import { updateProduct } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditForm({product}: {product:any}){
        const router = useRouter();
        const [error, setError] = useState("");
        const [loading, setLoading] = useState(false);
        const [formData,setFormData] = useState({
        name: product.name || "",
        price: product.price || "",
        quantity: product.quantity|| "",
        description: product.description|| "",
        imgUrl: product.productImg||""
        })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
        }));
    };
    async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formDataObj = new FormData(e.currentTarget)
        const result = await updateProduct(formDataObj, product) 
        if (result && result.error) {
        setError(result.error);
        setLoading(false);
        } else if(!result){
            setError("No Result");
            setLoading(false)
        }
            else{
        router.push("/products/manage?message=updated")
        }
    } 
    

    return(
    <div className="w-1/2 mx-auto">
    <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-primary mb-1">
                Price
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label htmlFor="Q" className="block text-sm font-medium text-primary mb-1">
                Quantity
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label htmlFor="imgUrl" className="block text-sm font-medium text-primary mb-1">
                Image URL
                <input
                type="text"
                id="imgUrl"
                name="imgUrl"
                value={formData.imgUrl}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
              />
              </label>
              
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-primary mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
                value={formData.description}
                onChange={handleChange}

              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Editing..." : "Edit Account"}
            </button>
          </form>
          </div>
    );
}