import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import { bookingsApi } from "../../api/bookings";

export default function RescheduleModal({
  isOpen,
  onClose,
  bookingId,
  onSuccess,
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!date || !time) {
      toast.error("Please select both date and time");
      return;
    }
    const scheduledDateTime = new Date(`${date}T${time}`).toISOString();
    if (new Date(scheduledDateTime) <= new Date()) {
      toast.error("Please select a future date and time");
      return;
    }
    setLoading(true);
    try {
      await bookingsApi.rescheduleBooking(bookingId, { scheduledDateTime });
      toast.success("Booking rescheduled successfully!");
      setDate("");
      setTime("");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reschedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reschedule Booking">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            New Date
          </label>
          <input
            type="date"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            New Time
          </label>
          <input
            type="time"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            value={time}
            onChange={(e) => setTime(e.target.value)}
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
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors disabled:opacity-60"
          >
            {loading ? "Rescheduling..." : "Reschedule"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
