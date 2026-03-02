import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import useProviderStore from "../../stores/useProviderStore";
import useBookingStore from "../../stores/useBookingStore";
import StatCard from "../../components/shared/StatCard";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { formatDateTime, formatCurrency } from "../../utils/formatters";

export default function ProviderDashboardPage() {
  const { user } = useAuthStore();
  const { myProfile, fetchMyProfile } = useProviderStore();
  const { bookings, fetchProviderBookings, isLoading } = useBookingStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    earnings: 0,
    totalJobs: 0,
    upcoming: 0,
  });

  useEffect(() => {
    fetchMyProfile();
    fetchProviderBookings({ limit: 50 });
  }, [fetchMyProfile, fetchProviderBookings]);

  useEffect(() => {
    if (bookings.length > 0) {
      const completed = bookings.filter((b) => b.status === "completed");
      const earnings = completed.reduce(
        (sum, b) => sum + (b.priceSnapshot || 0),
        0,
      );
      const upcoming = bookings.filter((b) =>
        ["requested", "confirmed", "in-progress"].includes(b.status),
      );
      setStats({
        earnings,
        totalJobs: completed.length,
        upcoming: upcoming.length,
      });
    }
  }, [bookings]);

  const upcomingBookings = bookings
    .filter((b) => ["requested", "confirmed", "in-progress"].includes(b.status))
    .sort(
      (a, b) => new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime),
    )
    .slice(0, 5);

  return (
    <div className="px-4 py-6 md:px-8 lg:px-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-slate-500 mt-1">Here's your business overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="payments"
          label="Total Earnings"
          value={formatCurrency(stats.earnings)}
          iconColor="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          icon="star"
          label="Rating"
          value={myProfile?.ratingAverage?.toFixed(1) || "0.0"}
          iconColor="text-amber-600 bg-amber-50"
        />
        <StatCard
          icon="check_circle"
          label="Completed Jobs"
          value={stats.totalJobs}
          iconColor="text-primary bg-primary/10"
        />
        <StatCard
          icon="schedule"
          label="Upcoming"
          value={stats.upcoming}
          iconColor="text-orange-600 bg-orange-50"
        />
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Upcoming Bookings
          </h2>
          <button
            onClick={() => navigate("/provider/bookings")}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all
          </button>
        </div>
        {isLoading ? (
          <div className="p-8">
            <Spinner />
          </div>
        ) : upcomingBookings.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {upcomingBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {booking.customerId?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {booking.customerId?.name || "Customer"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {booking.categoryId?.name} •{" "}
                      {formatDateTime(booking.scheduledDateTime)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={booking.status} />
                  {booking.priceSnapshot && (
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(booking.priceSnapshot)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">
              calendar_today
            </span>
            No upcoming bookings
          </div>
        )}
      </div>
    </div>
  );
}
