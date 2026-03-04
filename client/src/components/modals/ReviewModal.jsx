import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import StarRating from "../ui/StarRating";
import Button from "../ui/Button";
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
          <p className="body-text mb-3">
            How was your experience with{" "}
            <span className="font-semibold [color:var(--text)]">{providerName}</span>
            ?
          </p>
          <div className="flex justify-center">
            <StarRating value={rating} onChange={setRating} size="text-3xl" />
          </div>
        </div>
        <div>
          <label className="input-label">Comments (optional)</label>
          <textarea
            className="input-field !h-auto py-3"
            rows={4}
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button onClick={onClose} variant="secondary" size="md">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={rating === 0}
            variant="primary"
            size="md"
          >
            Submit review
          </Button>
        </div>
      </div>
    </Modal>
  );
}
