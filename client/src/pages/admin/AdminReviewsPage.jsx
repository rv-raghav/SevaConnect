import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "../../api/admin";
import { reviewsApi } from "../../api/reviews";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import StarRating from "../../components/ui/StarRating";
import Button from "../../components/ui/Button";
import { formatDate } from "../../utils/formatters";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getReviews();
      const reviewList = (data.data || []).map((review) => ({
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        customerName: review.customerId?.name || "Customer",
        providerName: review.providerId?.name || "Provider",
        categoryName: review.bookingId?.categoryId?.name || "Service",
      }));
      setReviews(reviewList);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await reviewsApi.deleteReview(deleteTarget);
      toast.success("Review deleted");
      setDeleteTarget(null);
      loadReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="surface-card-static p-5 md:p-6">
        <h1 className="page-title !text-3xl">Review moderation</h1>
        <p className="caption-text mt-1">
          Monitor customer reviews and remove inappropriate content.
        </p>
      </section>

      <section className="mt-6">
        {loading ? (
          <Spinner />
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article key={review._id} className="surface-card-static p-4 md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="card-title">
                      {review.customerName} → {review.providerName}
                    </p>
                    <p className="caption-text mt-1">
                      {review.categoryName} • {review.createdAt ? formatDate(review.createdAt) : "-"}
                    </p>
                    <div className="mt-2">
                      <StarRating value={review.rating} readOnly size="text-lg" />
                    </div>
                    {review.comment ? (
                      <p className="body-text mt-3">{review.comment}</p>
                    ) : (
                      <p className="caption-text mt-3">No written comment.</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(review._id)}
                  >
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="reviews"
            title="No reviews to moderate"
            description="Reviews from completed bookings will appear here."
          />
        )}
      </section>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete review?"
        message="This action permanently removes the review."
        confirmText={deleting ? "Deleting..." : "Delete review"}
        confirmVariant="danger"
      />
    </div>
  );
}
