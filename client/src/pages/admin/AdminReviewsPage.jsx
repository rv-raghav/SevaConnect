import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "../../api/admin";
import { reviewsApi } from "../../api/reviews";
import Spinner from "../../components/ui/Spinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import StarRating from "../../components/ui/StarRating";
import { formatDate } from "../../utils/formatters";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getReviews();
      const reviewList = (data.data || []).map((r) => ({
        _id: r._id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        customerName: r.customerId?.name || "Customer",
        providerName: r.providerId?.name || "Provider",
        categoryName: r.bookingId?.categoryId?.name || "Service",
      }));
      setReviews(reviewList);
    } catch {
      setReviews([]);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await reviewsApi.deleteReview(deleteTarget);
      toast.success("Review deleted successfully");
      setDeleteTarget(null);
      loadReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="px-4 py-6 md:px-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Review Moderation
        </h1>
        <p className="text-slate-500 mt-1">Monitor and moderate user reviews</p>
      </div>

      {loading ? (
        <Spinner />
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review, idx) => (
            <div
              key={review._id || idx}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {review.customerName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-900">
                        {review.customerName}
                      </p>
                      <span className="text-xs text-slate-400">reviewed</span>
                      <p className="text-sm font-semibold text-slate-700">
                        {review.providerName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating
                        value={review.rating}
                        readOnly
                        size="text-base"
                      />
                      <span className="text-xs text-slate-500">
                        {review.categoryName}
                      </span>
                      {review.createdAt && (
                        <span className="text-xs text-slate-400">
                          • {formatDate(review.createdAt)}
                        </span>
                      )}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-slate-600">{review.comment}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setDeleteTarget(review._id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 transition-colors shrink-0"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">
            reviews
          </span>
          <p className="text-lg font-semibold">No reviews to moderate</p>
          <p className="text-sm mt-1">
            Reviews from completed bookings will appear here
          </p>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Review?"
        message="Are you sure you want to delete this review? This action cannot be undone."
      />
    </div>
  );
}
