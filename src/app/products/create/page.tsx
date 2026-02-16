import { getCurrentUser } from "@/app/lib/actions";
import CreateProductForm from "@/app/products/create/create-form";

export default async function ManageProductPage(){
    const user = await getCurrentUser();
 
  if (!user) {
    return <div>Loading...</div>;
  }
  if((user.role == "Seller" && user.approved) || user.role == "Admin") return(<CreateProductForm />)

    return <div className="m-auto">Please Apply to become a Seller to List an item</div>
}
