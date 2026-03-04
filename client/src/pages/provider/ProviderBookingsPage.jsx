import { useEffect, useState } from "react";
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
  { label: "All", value: "" },
  { label: "Requested", value: "requested" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const ACTION_STYLES = {
  primary: { variant: "primary" },
  secondary: { variant: "secondary" },
  outline: { variant: "outline" },
  danger: { variant: "danger" },
};

export default function ProviderBookingsPage() {
  const { bookings, pagination, fetchProviderBookings, isLoading, setPage } =
    useBookingStore();
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

  const handleTabChange = (status) => {
    setActiveTab(status);
    setPage(1);
  };

  const getActions = (booking) => {
    const actions = [];
    switch (booking.status) {
      case BOOKING_STATUSES.REQUESTED:
        actions.push({ label: "Accept", action: "accept", tone: "primary" });
        actions.push({
          label: "Decline",
          action: "cancel",
          tone: "danger",
          confirm: true,
        });
        break;
      case BOOKING_STATUSES.CONFIRMED:
        actions.push({ label: "Start work", action: "start", tone: "primary" });
        break;
      case BOOKING_STATUSES.IN_PROGRESS:
        actions.push({
          label: "Upload before",
          action: "upload-before",
          tone: "secondary",
        });
        actions.push({
          label: "Complete",
          action: "complete",
          tone: "primary",
          confirm: true,
        });
        break;
      case BOOKING_STATUSES.COMPLETED:
        actions.push({
          label: "Upload after",
          action: "upload-after",
          tone: "secondary",
        });
        break;
      default:
        break;
    }
    return actions;
  };

  const handleActionClick = (booking, action) => {
    if (action.action === "upload-before") {
      setWorkModal({ bookingId: booking._id, type: "before" });
      return;
    }
    if (action.action === "upload-after") {
      setWorkModal({ bookingId: booking._id, type: "after" });
      return;
    }
    if (action.confirm) {
      setConfirmAction({
        bookingId: booking._id,
        action: action.action,
        label: action.label.toLowerCase(),
      });
      return;
    }
    handleStatusAction(booking._id, action.action, action.label.toLowerCase());
  };

  return (
    <div className="page-shell">
      <section className="surface-card-static p-5 md:p-6">
        <h1 className="page-title !text-3xl">Booking management</h1>
        <p className="caption-text mt-1">
          Manage customer requests and update service progress.
        </p>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? "primary" : "secondary"}
              size="sm"
              onClick={() => handleTabChange(tab.value)}
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
          <>
            <div className="space-y-4 md:hidden">
              {bookings.map((booking) => (
                <article key={booking._id} className="surface-card-static p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="card-title">{booking.customerId?.name || "Customer"}</p>
                      <p className="caption-text">{booking.categoryId?.name || "-"}</p>
                      <p className="caption-text mt-1">
                        {formatDateTime(booking.scheduledDateTime)}
                      </p>
                    </div>
                    <Badge status={booking.status} />
                  </div>
                  <div className="mt-3">
                    <BookingTimeline status={booking.status} />
                  </div>
                  <p className="mt-3 text-sm font-semibold [color:var(--text)]">
                    {formatCurrency(booking.priceSnapshot)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {getActions(booking).map((action) => (
                      <Button
                        key={action.action}
                        size="sm"
                        {...ACTION_STYLES[action.tone]}
                        loading={actionLoading === booking._id}
                        onClick={() => handleActionClick(booking, action)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden md:block surface-card-static overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-shell">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Date & time</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>
                          <p className="font-medium [color:var(--text)]">
                            {booking.customerId?.name || "Customer"}
                          </p>
                          <p className="caption-text">{booking.city}</p>
                        </td>
                        <td>{booking.categoryId?.name || "-"}</td>
                        <td>{formatDateTime(booking.scheduledDateTime)}</td>
                        <td className="font-semibold [color:var(--text)]">
                          {formatCurrency(booking.priceSnapshot)}
                        </td>
                        <td>
                          <Badge status={booking.status} />
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            {getActions(booking).map((action) => (
                              <Button
                                key={action.action}
                                size="sm"
                                {...ACTION_STYLES[action.tone]}
                                loading={actionLoading === booking._id}
                                onClick={() => handleActionClick(booking, action)}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

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
            description="Customer bookings will appear here once requests start coming in."
          />
        )}
      </section>

      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={() =>
          handleStatusAction(
            confirmAction.bookingId,
            confirmAction.action,
            confirmAction.label,
          )
        }
        title="Confirm action?"
        message={`Are you sure you want to ${confirmAction?.label || "continue"} this booking?`}
        confirmText="Continue"
      />

      {workModal ? (
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
      ) : null}
    </div>
  );
}
