import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import StarRating from "../ui/StarRating";
import { reviewsApi } from "../../api/reviews";

export default function ReviewModal({
  isOpen,
  onClose,
  bookingId,
  providerName,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setLoading(true);
    try {
      await reviewsApi.createReview({
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate your experience">
      <div className="space-y-5">
        <div className="text-center">
          <p className="text-sm text-slate-500 mb-3">
            How was your experience with{" "}
            <span className="font-semibold text-slate-900">{providerName}</span>
            ?
          </p>
          <div className="flex justify-center">
            <StarRating value={rating} onChange={setRating} size="text-3xl" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Comments (optional)
          </label>
          <textarea
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all"
            rows={4}
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
