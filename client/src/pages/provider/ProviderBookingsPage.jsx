import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useBookingStore from "../../stores/useBookingStore";
import { bookingsApi } from "../../api/bookings";
import { BOOKING_STATUSES } from "../../utils/constants";
import Badge from "../../components/ui/Badge";
import BookingTimeline from "../../components/ui/BookingTimeline";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import Spinner from "../../components/ui/Spinner";
import WorkUpdateModal from "../../components/modals/WorkUpdateModal";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const TABS = [
  { label: "All", value: "", icon: "list" },
  { label: "Requested", value: "requested", icon: "pending_actions" },
  { label: "Confirmed", value: "confirmed", icon: "event_available" },
  { label: "In progress", value: "in-progress", icon: "construction" },
  { label: "Completed", value: "completed", icon: "check_circle" },
  { label: "Cancelled", value: "cancelled", icon: "cancel" },
];

const STATUS_ICON_STYLE = {
  requested: { bg: "linear-gradient(135deg, #64748b, #94a3b8)", icon: "pending_actions" },
  confirmed: { bg: "linear-gradient(135deg, #3b82f6, #6366f1)", icon: "event_available" },
  "in-progress": { bg: "linear-gradient(135deg, #f59e0b, #d97706)", icon: "construction" },
  completed: { bg: "linear-gradient(135deg, #10b981, #059669)", icon: "check_circle" },
  cancelled: { bg: "linear-gradient(135deg, #ef4444, #dc2626)", icon: "cancel" },
};

const ACTION_ICONS = {
  accept: "check", "start work": "play_arrow", complete: "done_all",
  decline: "close", "upload before": "upload", "upload after": "upload",
  "re-approve": "refresh",
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.38, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function ProviderBookingsPage() {
  const { bookings, pagination, fetchProviderBookings, isLoading, setPage } = useBookingStore();
  const [activeTab, setActiveTab] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [workModal, setWorkModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const params = { page: pagination.page };
    if (activeTab) params.status = activeTab;
    fetchProviderBookings(params);
  }, [activeTab, pagination.page, fetchProviderBookings]);

  const handleStatusAction = async (bookingId, action, label) => {
    setActionLoading(bookingId);
    try {
      if (action === "accept") await bookingsApi.acceptBooking(bookingId);
      if (action === "start") await bookingsApi.startBooking(bookingId);
      if (action === "complete") await bookingsApi.completeBooking(bookingId);
      if (action === "cancel") await bookingsApi.cancelBooking(bookingId);
      toast.success(`Booking ${label} successfully`);
      const params = { page: pagination.page };
      if (activeTab) params.status = activeTab;
      fetchProviderBookings(params);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${label} booking`);
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  const handleTabChange = (status) => { setActiveTab(status); setPage(1); };

  const getActions = (booking) => {
    const actions = [];
    switch (booking.status) {
      case BOOKING_STATUSES.REQUESTED:
        actions.push({ label: "Accept", action: "accept", tone: "primary" });
        actions.push({ label: "Decline", action: "cancel", tone: "danger", confirm: true });
        break;
      case BOOKING_STATUSES.CONFIRMED:
        actions.push({ label: "Start work", action: "start", tone: "primary" });
        break;
      case BOOKING_STATUSES.IN_PROGRESS:
        actions.push({ label: "Upload before", action: "upload-before", tone: "secondary" });
        actions.push({ label: "Complete", action: "complete", tone: "primary", confirm: true });
        break;
      case BOOKING_STATUSES.COMPLETED:
        actions.push({ label: "Upload after", action: "upload-after", tone: "secondary" });
        break;
      default: break;
    }
    return actions;
  };

  const handleActionClick = (booking, action) => {
    if (action.action === "upload-before") { setWorkModal({ bookingId: booking._id, type: "before" }); return; }
    if (action.action === "upload-after") { setWorkModal({ bookingId: booking._id, type: "after" }); return; }
    if (action.confirm) { setConfirmAction({ bookingId: booking._id, action: action.action, label: action.label.toLowerCase() }); return; }
    handleStatusAction(booking._id, action.action, action.label.toLowerCase());
  };

  const VARIANT_MAP = { primary: "primary", secondary: "secondary", outline: "outline", danger: "outline" };

  const renderActions = (booking) =>
    getActions(booking).map((action) => (
      <Button
        key={action.action}
        size="sm"
        variant={VARIANT_MAP[action.tone] || "secondary"}
        loading={actionLoading === booking._id}
        onClick={() => handleActionClick(booking, action)}
        style={action.tone === "danger" ? { color: "var(--error-500)", borderColor: "color-mix(in srgb, var(--error-500) 40%, var(--border))" } : {}}
      >
        <span className="material-symbols-outlined text-[15px]">
          {ACTION_ICONS[action.label.toLowerCase()] || "arrow_forward"}
        </span>
        {action.label}
      </Button>
    ));

  return (
    <div className="page-shell">
      {/* ─── Header + Tabs ─── */}
      <Motion.section
        className="glass-card p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ cursor: "default" }}
        whileHover={{}}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, var(--primary-500) , #6366f1)" }}
            >
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div>
              <h1 className="font-bold" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", color: "var(--text)", letterSpacing: "-0.02em" }}>
                Booking management
              </h1>
              <p className="caption-text">Manage customer requests and update service progress.</p>
            </div>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full shrink-0"
            style={{ background: "color-mix(in srgb, var(--primary-500) 10%, transparent)", color: "var(--primary-500)", border: "1px solid color-mix(in srgb, var(--primary-500) 20%, var(--border))" }}
          >
            {bookings.length} bookings
          </span>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 -mb-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleTabChange(tab.value)}
              className="btn btn-sm shrink-0 flex items-center gap-1.5"
              style={{
                background: activeTab === tab.value ? "var(--primary-500)" : "color-mix(in srgb, var(--surface-soft) 90%, transparent)",
                color: activeTab === tab.value ? "white" : "var(--text-soft)",
                borderColor: activeTab === tab.value ? "color-mix(in srgb, var(--primary-500) 70%, black 30%)" : "var(--border)",
                fontWeight: 600,
                boxShadow: activeTab === tab.value ? "0 4px 16px color-mix(in srgb, var(--primary-500) 25%, transparent)" : "none",
              }}
            >
              <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </Motion.section>

      {/* ─── Bookings ─── */}
      <section className="mt-6">
        {isLoading ? (
          <Spinner />
        ) : bookings.length > 0 ? (
          <>
            {/* Mobile cards */}
            <Motion.div
              className="space-y-4 md:hidden"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            >
              <AnimatePresence mode="popLayout">
                {bookings.map((booking, i) => {
                  const iconStyle = STATUS_ICON_STYLE[booking.status] || STATUS_ICON_STYLE.requested;
                  return (
                    <Motion.article
                      key={booking._id}
                      className="glass-card p-4"
                      variants={fadeUp}
                      custom={i}
                      layout
                      style={{ cursor: "default" }}
                      whileHover={{}}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: iconStyle.bg }}>
                            <span className="material-symbols-outlined text-[18px]">{iconStyle.icon}</span>
                          </div>
                          <div>
                            <p className="card-title">{booking.customerId?.name || "Customer"}</p>
                            <p className="caption-text">{booking.categoryId?.name || "—"}</p>
                            <p className="caption-text flex items-center gap-1 mt-0.5">
                              <span className="material-symbols-outlined text-[13px]">schedule</span>
                              {formatDateTime(booking.scheduledDateTime)}
                            </p>
                          </div>
                        </div>
                        <Badge status={booking.status} />
                      </div>
                      <div className="mt-3">
                        <BookingTimeline status={booking.status} />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
                          {formatCurrency(booking.priceSnapshot)}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {renderActions(booking)}
                      </div>
                    </Motion.article>
                  );
                })}
              </AnimatePresence>
            </Motion.div>

            {/* Desktop table */}
            <Motion.div
              className="hidden md:block glass-card overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ cursor: "default" }}
              whileHover={{}}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)", background: "color-mix(in srgb, var(--surface-soft) 60%, transparent)" }}>
                      {["Customer", "Service", "Date & time", "Price", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, i) => {
                      const iconStyle = STATUS_ICON_STYLE[booking.status] || STATUS_ICON_STYLE.requested;
                      return (
                        <tr key={booking._id} style={{ borderBottom: i < bookings.length - 1 ? "1px solid var(--border)" : "none" }}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: iconStyle.bg }}>
                                <span className="material-symbols-outlined text-[16px]">{iconStyle.icon}</span>
                              </div>
                              <div>
                                <p className="font-semibold" style={{ color: "var(--text)" }}>{booking.customerId?.name || "Customer"}</p>
                                {booking.city && <p className="caption-text">{booking.city}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 caption-text">{booking.categoryId?.name || "—"}</td>
                          <td className="px-5 py-4 caption-text whitespace-nowrap">{formatDateTime(booking.scheduledDateTime)}</td>
                          <td className="px-5 py-4"><span className="font-bold" style={{ color: "var(--text)" }}>{formatCurrency(booking.priceSnapshot)}</span></td>
                          <td className="px-5 py-4"><Badge status={booking.status} /></td>
                          <td className="px-5 py-4"><div className="flex flex-wrap gap-2">{renderActions(booking)}</div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Motion.div>

            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              onPageChange={setPage}
            />
          </>
        ) : (
          <EmptyState
            icon="event_busy"
            title="No bookings yet"
            description="Customer bookings will appear here once requests come in."
          />
        )}
      </section>

      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => handleStatusAction(confirmAction.bookingId, confirmAction.action, confirmAction.label)}
        title="Confirm action?"
        message={`Are you sure you want to ${confirmAction?.label || "continue"} this booking?`}
        confirmText="Continue"
      />

      {workModal && (
        <WorkUpdateModal
          isOpen={Boolean(workModal)}
          onClose={() => setWorkModal(null)}
          bookingId={workModal.bookingId}
          type={workModal.type}
          onSuccess={() => {
            setWorkModal(null);
            toast.success("Work update uploaded");
            const params = { page: pagination.page };
            if (activeTab) params.status = activeTab;
            fetchProviderBookings(params);
          }}
        />
      )}
    </div>
  );
}
