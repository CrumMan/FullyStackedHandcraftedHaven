import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, deleteReview } from "@/app/lib/actions";
import { getReviewById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function DeleteReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  // Must be logged in
  if (!user) {
    redirect("/login");
  }

  const review = await getReviewById(id);

  if (!review) {
    notFound();
  }

  // Check permission: user owns review or is admin
  const canDelete = review.userid === user.id || user.role === "Admin";
  const productId = review.productid;

  if (!canDelete) {
    return (
      <main className="min-h-screen bg-white">
        <section className="p-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">
              Access Denied
            </h1>
            <p className="text-primary/60 mb-6">
              You can only delete your own reviews.
            </p>
            <Link
              href={`/products/${productId}`}
              className="text-secondary hover:underline"
            >
              Back to product
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Server action to handle deletion
  async function handleDelete() {
    "use server";
    const result = await deleteReview(id);
    if (result.success) {
      redirect(`/products/${productId}`);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-primary text-center mb-6">
            Delete Review
          </h1>

          <div className="border border-primary/10 rounded-lg p-6 mb-6">
            <p className="text-sm text-primary/60 mb-2">Review by:</p>
            <p className="font-medium text-primary mb-4">{review.author}</p>

            <p className="text-sm text-primary/60 mb-2">Comment:</p>
            <p className="text-primary/80 mb-4">{review.comment}</p>

            <p className="text-sm text-primary/60">
              Rating: {review.rating}/5 stars
            </p>
          </div>

          <p className="text-center text-primary/80 mb-6">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href={`/products/${productId}`}
              className="px-6 py-2 border border-primary/20 rounded-lg text-primary hover:bg-primary/5"
            >
              Cancel
            </Link>

            <form action={handleDelete}>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Review
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
