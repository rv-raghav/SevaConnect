import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useBookingStore from "../../stores/useBookingStore";
import { bookingsApi } from "../../api/bookings";
import Badge from "../../components/ui/Badge";
import BookingTimeline from "../../components/ui/BookingTimeline";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import ReviewModal from "../../components/modals/ReviewModal";
import RescheduleModal from "../../components/modals/RescheduleModal";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const TABS = [
  { label: "All", value: "" },
  { label: "Upcoming", value: "requested,confirmed" },
  { label: "In progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function CustomerBookingsPage() {
  const { bookings, pagination, fetchMyBookings, isLoading } = useBookingStore();
  const [activeTab, setActiveTab] = useState("");
  const [cancelId, setCancelId] = useState(null);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  const loadBookings = (tab = activeTab, page = 1) => {
    const params = { page, limit: 10 };
    if (tab) params.status = tab.split(",")[0];
    fetchMyBookings(params);
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleCancel = async () => {
    try {
      await bookingsApi.cancelBooking(cancelId);
      toast.success("Booking cancelled");
      setCancelId(null);
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="page-shell">
      <section className="surface-card-static p-5 md:p-6">
        <h1 className="page-title !text-3xl">My bookings</h1>
        <p className="caption-text mt-1">
          Track each booking from request to completion.
        </p>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        {isLoading ? (
          <Spinner />
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <article key={booking._id} className="surface-card-static p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="card-title">
                      {booking.categoryId?.name || "Service booking"}
                    </h2>
                    <p className="caption-text mt-1">
                      {formatDateTime(booking.scheduledDateTime)}
                    </p>
                    <p className="caption-text mt-1">
                      {booking.address}, {booking.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge status={booking.status} />
                    <p className="text-lg font-semibold mt-2 text-[color:var(--primary-500)]">
                      {formatCurrency(booking.priceSnapshot)}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <BookingTimeline status={booking.status} />
                </div>

                <div className="mt-4 pt-4 border-t [border-color:var(--border)] flex flex-wrap gap-2">
                  {(booking.status === "requested" ||
                    booking.status === "confirmed") && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setRescheduleId(booking._id)}
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCancelId(booking._id)}
                      >
                        Cancel booking
                      </Button>
                    </>
                  )}
                  {booking.status === "completed" ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setReviewBooking(booking)}
                    >
                      Leave review
                    </Button>
                  ) : null}
                </div>
              </article>
            ))}

            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              onPageChange={(page) => loadBookings(activeTab, page)}
            />
          </div>
        ) : (
          <EmptyState
            icon="calendar_month"
            title="No bookings yet"
            description="Book a provider to get started."
          />
        )}
      </section>

      <ConfirmDialog
        isOpen={Boolean(cancelId)}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="Cancel booking?"
        message="This will cancel the booking request."
        confirmText="Cancel booking"
        confirmVariant="danger"
      />

      <RescheduleModal
        isOpen={Boolean(rescheduleId)}
        onClose={() => setRescheduleId(null)}
        bookingId={rescheduleId}
        onSuccess={() => loadBookings()}
      />

      <ReviewModal
        isOpen={Boolean(reviewBooking)}
        onClose={() => {
          setReviewBooking(null);
          loadBookings();
        }}
        bookingId={reviewBooking?._id}
        providerName={reviewBooking?.providerId?.name}
      />
    </div>
  );
}
