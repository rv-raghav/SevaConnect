import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { adminApi } from "../../api/admin";
import { reviewsApi } from "../../api/reviews";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import StarRating from "../../components/ui/StarRating";
import Button from "../../components/ui/Button";
import { formatDate } from "../../utils/formatters";

const REVIEWER_COLORS = [
  "linear-gradient(135deg, var(--primary-500), #6366f1)",
  "linear-gradient(135deg, #8b5cf6, #a855f7)",
  "linear-gradient(135deg, #10b981, #059669)",
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #ec4899, #f43f5e)",
  "linear-gradient(135deg, #3b82f6, #06b6d4)",
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.38, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

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
    } catch { setReviews([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadReviews(); }, []);

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
    } finally { setDeleting(false); }
  };

  return (
    <div className="page-shell">
      {/* Header */}
      <Motion.section
        className="glass-card p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ cursor: "default" }}
        whileHover={{}}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
            >
              <span className="material-symbols-outlined text-[22px]">rate_review</span>
            </div>
            <div>
              <h1 className="font-bold" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", color: "var(--text)", letterSpacing: "-0.02em" }}>
                Review moderation
              </h1>
              <p className="caption-text">Monitor and remove inappropriate review content.</p>
            </div>
          </div>
          {reviews.length > 0 && (
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: "color-mix(in srgb, #f59e0b 10%, transparent)",
                color: "#d97706",
                border: "1px solid color-mix(in srgb, #f59e0b 24%, var(--border))",
              }}
            >
              {reviews.length} reviews
            </span>
          )}
        </div>
      </Motion.section>

      {/* Reviews */}
      <section className="mt-6">
        {loading ? (
          <Spinner />
        ) : reviews.length > 0 ? (
          <Motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            <AnimatePresence mode="popLayout">
              {reviews.map((review, i) => (
                <Motion.article
                  key={review._id}
                  className="glass-card p-5 md:p-6"
                  variants={fadeUp}
                  custom={i}
                  layout
                  style={{ cursor: "default" }}
                  whileHover={{}}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Reviewer avatar */}
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-semibold text-base shrink-0"
                        style={{ background: REVIEWER_COLORS[i % REVIEWER_COLORS.length] }}
                      >
                        {review.customerName?.[0]?.toUpperCase() || "C"}
                      </div>
                      <div className="min-w-0">
                        {/* Who reviewed who */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="font-semibold" style={{ color: "var(--text)" }}>
                            {review.customerName}
                          </p>
                          <span className="material-symbols-outlined text-[14px]" style={{ color: "var(--text-muted)" }}>arrow_forward</span>
                          <p className="font-semibold" style={{ color: "var(--text)" }}>
                            {review.providerName}
                          </p>
                        </div>
                        {/* Metadata row */}
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                          <span className="caption-text flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">home_repair_service</span>
                            {review.categoryName}
                          </span>
                          <span className="caption-text flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                            {review.createdAt ? formatDate(review.createdAt) : "—"}
                          </span>
                        </div>
                        {/* Star rating */}
                        <div className="mt-2">
                          <StarRating value={review.rating} readOnly size="text-base" />
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(review._id)}
                      className="shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>

                  {/* Comment */}
                  <div
                    className="mt-4 pt-4"
                    style={{ borderTop: "1px solid var(--border)" }}
                  >
                    {review.comment ? (
                      <p className="body-text leading-relaxed">
                        <span className="material-symbols-outlined text-[18px] mr-1 align-middle" style={{ color: "var(--text-muted)", fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                        {review.comment}
                      </p>
                    ) : (
                      <p className="caption-text italic">No written comment.</p>
                    )}
                  </div>

                  {/* Rating badge */}
                  <div className="mt-3 flex items-center justify-end">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: review.rating >= 4
                          ? "color-mix(in srgb, var(--success-500) 10%, transparent)"
                          : review.rating >= 3
                          ? "color-mix(in srgb, #f59e0b 10%, transparent)"
                          : "color-mix(in srgb, var(--error-500) 10%, transparent)",
                        color: review.rating >= 4 ? "var(--success-500)" : review.rating >= 3 ? "#d97706" : "var(--error-500)",
                      }}
                    >
                      <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      {review.rating}/5
                    </span>
                  </div>
                </Motion.article>
              ))}
            </AnimatePresence>
          </Motion.div>
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
        message="This action permanently removes the review and cannot be undone."
        confirmText={deleting ? "Deleting..." : "Delete review"}
        confirmVariant="danger"
      />
    </div>
  );
}
