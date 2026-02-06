import { getCurrentUser } from "../lib/actions";
import Link from "next/link";

export default async function AccountPage() {
    const user = await getCurrentUser();
    if (user==null) return <p>User is not loaded.</p>
    return (
    <main className="min-h-screen bg-white">
      <section className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-2">
            Account Dashboard
          </h1>
          <p className="text-primary/60 mb-8">Welcome, {user.name}</p>
          <Link href="./account/edit-account">Edit Account</Link>
          <div className="mb-8">
          </div>
        </div>
      </section>
    </main>
  );
}
