import { createReview } from "@/app/lib/actions";
import { getProductById } from "@/app/lib/data";
import Link from "next/navigation";
import CreateReviewForm from "./createReviewForm";

export default async function CreateReview({
  params,
}: {
  params: Promise<{ id: string }>;
}){
    const { id }= await params
    const product = await getProductById(id);
    if (!product){return <p>product Not Fetched</p>}
  
    async function handleSubmit(formData: FormData) {
    try{
        const result = await createReview(formData,id);
    }
    catch(error){
        console.log(error)
    }
    }
    return <main className="min-h-screen bg-white">
        <section className="p-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-bold text-primary text-center mb-8">
                    Create Review for {product.name}
                </h1>
                <CreateReviewForm {...product}/>
            </div>
        </section>
    </main>
}