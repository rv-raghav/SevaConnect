import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
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
          <label className="input-label">New date</label>
          <input
            type="date"
            className="input-field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label className="input-label">New time</label>
          <input
            type="time"
            className="input-field"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button onClick={onClose} variant="secondary" size="md">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            variant="primary"
            size="md"
          >
            Reschedule
          </Button>
        </div>
      </div>
    </Modal>
  );
}
