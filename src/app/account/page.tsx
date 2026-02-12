
import { getCurrentUser } from "../lib/actions";
import Link from "next/link";


export default async function AccountPage() {
    const user = await getCurrentUser();
    if (user==null) return <p>User is not loaded.</p>
    const admin = (user.role==="Admin")? <Link href="/admin">Admin Control</Link> : <a></a>;
    const seller = (user.role === "Seller" || user.role == "Admin")? <Link href="/products/manage"> Manage Your Products </Link>: <a></a>;
    return (
    <main className="min-h-screen bg-white">
      <section className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-2">
            Account Dashboard
          </h1>
          <p className="text-primary/60 mb-8">Welcome, {user.name}</p>
          <Link href="./account/edit-account">Edit Account</Link>
          <br></br>
          {admin}
          <br></br>
          {seller}
          <div className="mb-8">
          </div>
        </div>
      </section>
    </main>
  );
}
