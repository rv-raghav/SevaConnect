import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useBookingStore from "../../stores/useBookingStore";
import { bookingsApi } from "../../api/bookings";
import Badge from "../../components/ui/Badge";
import Pagination from "../../components/ui/Pagination";
import Spinner from "../../components/ui/Spinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import WorkUpdateModal from "../../components/modals/WorkUpdateModal";
import { formatDateTime, formatCurrency } from "../../utils/formatters";
import { BOOKING_STATUSES } from "../../utils/constants";

const TABS = [
  { label: "All", value: "" },
  { label: "Requested", value: "requested" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function ProviderBookingsPage() {
  const { bookings, pagination, fetchProviderBookings, isLoading } =
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
      else if (action === "start") await bookingsApi.startBooking(bookingId);
      else if (action === "complete")
        await bookingsApi.completeBooking(bookingId);
      else if (action === "cancel") await bookingsApi.cancelBooking(bookingId);
      toast.success(`Booking ${label} successfully`);
      const params = { page: pagination.page };
      if (activeTab) params.status = activeTab;
      fetchProviderBookings(params);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${label} booking`);
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    useBookingStore.getState().setPage(1);
  };

  const getActions = (booking) => {
    const actions = [];
    switch (booking.status) {
      case BOOKING_STATUSES.REQUESTED:
        actions.push({
          label: "Accept",
          action: "accept",
          style: "bg-emerald-600 hover:bg-emerald-700 text-white",
        });
        actions.push({
          label: "Decline",
          action: "cancel",
          style: "bg-red-50 hover:bg-red-100 text-red-600",
          confirm: true,
        });
        break;
      case BOOKING_STATUSES.CONFIRMED:
        actions.push({
          label: "Start Work",
          action: "start",
          style: "bg-primary hover:bg-primary/90 text-white",
        });
        break;
      case BOOKING_STATUSES.IN_PROGRESS:
        actions.push({
          label: "Upload Before",
          action: "upload-before",
          style: "bg-slate-100 hover:bg-slate-200 text-slate-700",
        });
        actions.push({
          label: "Complete",
          action: "complete",
          style: "bg-emerald-600 hover:bg-emerald-700 text-white",
          confirm: true,
        });
        break;
      case BOOKING_STATUSES.COMPLETED:
        actions.push({
          label: "Upload After",
          action: "upload-after",
          style: "bg-slate-100 hover:bg-slate-200 text-slate-700",
        });
        break;
    }
    return actions;
  };

  const handleActionClick = (booking, act) => {
    if (act.action === "upload-before") {
      setWorkModal({ bookingId: booking._id, type: "before" });
    } else if (act.action === "upload-after") {
      setWorkModal({ bookingId: booking._id, type: "after" });
    } else if (act.confirm) {
      setConfirmAction({
        bookingId: booking._id,
        action: act.action,
        label: act.label,
      });
    } else {
      handleStatusAction(booking._id, act.action, act.label.toLowerCase());
    }
  };

  return (
    <div className="px-4 py-6 md:px-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Bookings
        </h1>
        <p className="text-slate-500 mt-1">Manage your service bookings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? "bg-primary text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <Spinner />
      ) : bookings.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {booking.customerId?.name
                              ?.charAt(0)
                              ?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {booking.customerId?.name || "Customer"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {booking.city}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {booking.categoryId?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {formatDateTime(booking.scheduledDateTime)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        {formatCurrency(booking.priceSnapshot)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={booking.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getActions(booking).map((act) => (
                            <button
                              key={act.action}
                              onClick={() => handleActionClick(booking, act)}
                              disabled={actionLoading === booking._id}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${act.style}`}
                            >
                              {actionLoading === booking._id
                                ? "..."
                                : act.label}
                            </button>
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
            onPageChange={(p) => useBookingStore.getState().setPage(p)}
          />
        </>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">
            event_busy
          </span>
          <p className="text-lg font-semibold">No bookings found</p>
          <p className="text-sm mt-1">
            Bookings from customers will appear here
          </p>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() =>
          handleStatusAction(
            confirmAction.bookingId,
            confirmAction.action,
            confirmAction.label.toLowerCase(),
          )
        }
        title={`${confirmAction?.label} Booking?`}
        message={`Are you sure you want to ${confirmAction?.label?.toLowerCase()} this booking? This action cannot be undone.`}
      />

      {/* Work Update Modal */}
      {workModal && (
        <WorkUpdateModal
          isOpen={!!workModal}
          onClose={() => setWorkModal(null)}
          bookingId={workModal.bookingId}
          type={workModal.type}
          onSuccess={() => {
            setWorkModal(null);
            toast.success("Work update uploaded successfully");
            const params = { page: pagination.page };
            if (activeTab) params.status = activeTab;
            fetchProviderBookings(params);
          }}
        />
      )}
    </div>
  );
}
