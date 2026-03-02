import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useBookingStore from "../../stores/useBookingStore";
import { bookingsApi } from "../../api/bookings";
import Badge from "../../components/ui/Badge";
import Pagination from "../../components/ui/Pagination";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ReviewModal from "../../components/modals/ReviewModal";
import RescheduleModal from "../../components/modals/RescheduleModal";
import { formatDateTime, formatCurrency } from "../../utils/formatters";

const TABS = [
  { label: "All", value: "" },
  { label: "Upcoming", value: "requested,confirmed" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function CustomerBookingsPage() {
  const { bookings, pagination, fetchMyBookings, isLoading } =
    useBookingStore();
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
  }, [activeTab]);

  const handleCancel = async () => {
    try {
      await bookingsApi.cancelBooking(cancelId);
      toast.success("Booking cancelled");
      setCancelId(null);
      loadBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  return (
    <div className="px-4 py-6 md:px-10 lg:px-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          My Bookings
        </h1>
        <p className="text-slate-500 mt-1">
          Track and manage your service bookings
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? "bg-primary text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <Spinner />
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      home_repair_service
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {booking.categoryId?.name || "Service"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Provider: {booking.providerId?.name || "N/A"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatDateTime(booking.scheduledDateTime)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {booking.address}, {booking.city}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge status={booking.status} />
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(booking.priceSnapshot)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                {(booking.status === "requested" ||
                  booking.status === "confirmed") && (
                  <>
                    <button
                      onClick={() => setRescheduleId(booking._id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => setCancelId(booking._id)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {booking.status === "completed" && (
                  <button
                    onClick={() => setReviewBooking(booking)}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    Leave Review
                  </button>
                )}
              </div>
            </div>
          ))}

          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            onPageChange={(p) => {
              loadBookings(activeTab, p);
            }}
          />
        </div>
      ) : (
        <EmptyState
          icon="calendar_month"
          title="No bookings found"
          description="You haven't made any bookings yet. Browse services to get started!"
        />
      )}

      {/* Cancel Dialog */}
      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={!!rescheduleId}
        onClose={() => setRescheduleId(null)}
        bookingId={rescheduleId}
        onSuccess={() => loadBookings()}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={!!reviewBooking}
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
