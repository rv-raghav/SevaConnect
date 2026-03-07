import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
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
  { label: "All", value: "", icon: "list" },
  { label: "Upcoming", value: "requested,confirmed", icon: "upcoming" },
  { label: "In progress", value: "in-progress", icon: "pending" },
  { label: "Completed", value: "completed", icon: "check_circle" },
  { label: "Cancelled", value: "cancelled", icon: "cancel" },
];

const STATUS_ICON_STYLES = {
  requested: {
    bg: "linear-gradient(135deg, var(--text-muted), var(--text-soft))",
    icon: "pending_actions",
  },
  confirmed: {
    bg: "linear-gradient(135deg, #3b82f6, #6366f1)",
    icon: "event_available",
  },
  "in-progress": {
    bg: "linear-gradient(135deg, #f59e0b, #d97706)",
    icon: "construction",
  },
  completed: {
    bg: "linear-gradient(135deg, #10b981, #059669)",
    icon: "check_circle",
  },
  cancelled: {
    bg: "linear-gradient(135deg, #ef4444, #dc2626)",
    icon: "cancel",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.06,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function CustomerBookingsPage() {
  const { bookings, pagination, fetchMyBookings, isLoading } =
    useBookingStore();
  const [activeTab, setActiveTab] = useState("");
  const [cancelId, setCancelId] = useState(null);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  const loadBookings = (tab = activeTab, page = 1) => {
    const params = { page, limit: 10 };
    if (tab) params.status = tab;
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
      {/* ─── Header ─── */}
      <Motion.section
        className="glass-card p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ cursor: "default" }}
        whileHover={{}}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="icon-badge"
                style={{ width: 44, height: 44, borderRadius: 14 }}
              >
                <span className="material-symbols-outlined text-[22px]">
                  calendar_month
                </span>
              </div>
              <div>
                <h1
                  className="font-bold"
                  style={{
                    fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                    color: "var(--text)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  My bookings
                </h1>
                <p className="caption-text">
                  Track each booking from request to completion.
                </p>
              </div>
            </div>
          </div>
          {pagination.total > 0 && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background:
                  "color-mix(in srgb, var(--primary-500) 10%, transparent)",
                color: "var(--primary-500)",
                border:
                  "1px solid color-mix(in srgb, var(--primary-500) 20%, var(--border))",
              }}
            >
              {pagination.total} total
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 -mb-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className="btn btn-sm shrink-0"
              style={{
                background:
                  activeTab === tab.value
                    ? "var(--primary-500)"
                    : "color-mix(in srgb, var(--surface-soft) 90%, transparent)",
                color: activeTab === tab.value ? "white" : "var(--text-soft)",
                borderColor:
                  activeTab === tab.value
                    ? "color-mix(in srgb, var(--primary-500) 70%, black 30%)"
                    : "var(--border)",
                fontWeight: 600,
                boxShadow:
                  activeTab === tab.value
                    ? "0 4px 16px color-mix(in srgb, var(--primary-500) 25%, transparent)"
                    : "none",
              }}
            >
              <span className="material-symbols-outlined text-[16px]">
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </Motion.section>

      {/* ─── Bookings List ─── */}
      <section className="mt-6">
        {isLoading ? (
          <Spinner />
        ) : bookings.length > 0 ? (
          <Motion.div
            className="space-y-4"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {bookings.map((booking, i) => {
                const iconStyle =
                  STATUS_ICON_STYLES[booking.status] ||
                  STATUS_ICON_STYLES.requested;
                return (
                  <Motion.article
                    key={booking._id}
                    className="glass-card p-5 md:p-6"
                    variants={fadeUp}
                    custom={i}
                    layout
                    style={{ cursor: "default" }}
                    whileHover={{}}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                          style={{
                            background: iconStyle.bg,
                            color: "white",
                          }}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {iconStyle.icon}
                          </span>
                        </div>
                        <div>
                          <h2 className="card-title">
                            {booking.categoryId?.name || "Service booking"}
                          </h2>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <span className="caption-text flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">
                                schedule
                              </span>
                              {formatDateTime(booking.scheduledDateTime)}
                            </span>
                            <span className="caption-text flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">
                                location_on
                              </span>
                              {booking.address}, {booking.city}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <Badge status={booking.status} />
                        <p
                          className="text-lg font-bold"
                          style={{ color: "var(--primary-500)" }}
                        >
                          {formatCurrency(booking.priceSnapshot)}
                        </p>
                      </div>
                    </div>

                    <div
                      className="mt-4 pt-4"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <BookingTimeline status={booking.status} />
                    </div>

                    <div
                      className="mt-4 pt-4 flex flex-wrap gap-2"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      {booking.status === "requested" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setRescheduleId(booking._id)}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            edit_calendar
                          </span>
                          Reschedule
                        </Button>
                      )}
                      {(booking.status === "requested" ||
                        booking.status === "confirmed") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCancelId(booking._id)}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            close
                          </span>
                          Cancel
                        </Button>
                      )}
                      {booking.status === "completed" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setReviewBooking(booking)}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            rate_review
                          </span>
                          Leave review
                        </Button>
                      )}
                    </div>
                  </Motion.article>
                );
              })}
            </AnimatePresence>

            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              onPageChange={(page) => loadBookings(activeTab, page)}
            />
          </Motion.div>
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
