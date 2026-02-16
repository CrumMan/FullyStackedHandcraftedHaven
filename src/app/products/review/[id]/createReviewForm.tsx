"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createReview } from "@/app/lib/actions";

export default function CreateReviewForm(product:any){
     const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");
            const result = await createReview(formData,product.id);
            if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
        router.push(`/products/${product.id}`);
      }
    }
       
    
    return (<form action={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-primary mb-1">
                            Product rating, ( 1 - Poor : 5 - Excelent)
                        </label>
                        <select
                            id="rating"
                            name="rating"
                            required
                            className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>

                        </select>
                    </div>
                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-primary mb-1">
                            Comment
                        </label>
                        <textarea
                            id="comment"
                            name="comment"
                            required
                            rows={3}
                            className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:outline-none focus:border-secondary"
                            placeholder= "Enter Review Here..."
                        />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-secondary text-white py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                        {loading ? "Creating Review..." : "Review"}
                        </button>
                 </form>)
}