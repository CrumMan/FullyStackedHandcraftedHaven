import { deleteProduct, getCurrentUser } from "@/app/lib/actions";
import { redirect } from "next/navigation";
import { getProductById } from "@/app/lib/data";


export default async function({params,}: {params: Promise<{ id: string }>;}){
    const {id} = await params;
    let product = await getProductById(id)
    const user = await getCurrentUser();
    if(user == null) {return(<p>Failed to load the current user</p>)}
    if(product == null){return(<p>Failed to load product that is being worked on</p>)}
    if ((user.id !== product.sellerId) && user.role != "Admin"){return (<p>You are not the authorized to delete the product.</p>)}
    await deleteProduct(id)
    product = await getProductById(id)
                

if (product !== null) {return <a href="/">Not Deleted</a>};
if (product == null) {
    redirect("/products/manage")
};
    
}