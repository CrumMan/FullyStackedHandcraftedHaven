import { getCurrentUser } from "@/app/lib/actions";
import { getProductById } from "@/app/lib/data";
import EditForm from "@/app/products/manage/edit/[id]/EditForm";

export default async function ManageProductPage({params}:any){
    const parameters = await params
    const id = parameters.id
    if(!id){return<p>No Product ID provided</p>}
    const [product, user] = await Promise.all([getProductById(id), getCurrentUser()])
 
  if (!product) {
    return <div>Loading...</div>;
  }
  if(!user)return<div>No User Logged in</div>

  if(user.id !== product.sellerId && user.Role!="Admin"){
    return <p>Please Login as the seller to manage the product</p>
  }

  return(<EditForm product={product}/>)
}
