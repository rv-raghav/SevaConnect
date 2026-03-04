import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import useProviderStore from "../../stores/useProviderStore";
import useBookingStore from "../../stores/useBookingStore";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import StatCard from "../../components/shared/StatCard";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

export default function ProviderDashboardPage() {
  const { user } = useAuthStore();
  const { myProfile, fetchMyProfile } = useProviderStore();
  const { bookings, fetchProviderBookings, isLoading } = useBookingStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProfile();
    fetchProviderBookings({ limit: 50 });
  }, [fetchMyProfile, fetchProviderBookings]);

  const stats = useMemo(() => {
    const completed = bookings.filter((booking) => booking.status === "completed");
    const upcoming = bookings.filter((booking) =>
      ["requested", "confirmed", "in-progress"].includes(booking.status),
    );
    const earnings = completed.reduce(
      (sum, booking) => sum + (booking.priceSnapshot || 0),
      0,
    );
    return {
      earnings,
      completed: completed.length,
      upcoming: upcoming.length,
    };
  }, [bookings]);

  const upcomingBookings = bookings
    .filter((booking) => ["requested", "confirmed", "in-progress"].includes(booking.status))
    .sort(
      (a, b) => new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime),
    )
    .slice(0, 6);

  return (
    <div className="page-shell">
      <section className="surface-card-static p-5 md:p-6">
        <h1 className="page-title !text-3xl">
          Welcome back, {user?.name?.split(" ")[0] || "Provider"}
        </h1>
        <p className="caption-text mt-1">
          Track bookings, performance, and revenue from one dashboard.
        </p>
      </section>

      <section className="mt-6 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon="payments"
          iconColor="var(--success-500)"
          label="Total earnings"
          value={formatCurrency(stats.earnings)}
        />
        <StatCard
          icon="star"
          iconColor="#d97706"
          label="Average rating"
          value={myProfile?.ratingAverage?.toFixed(1) || "0.0"}
        />
        <StatCard
          icon="check_circle"
          iconColor="var(--primary-500)"
          label="Completed jobs"
          value={stats.completed}
        />
        <StatCard
          icon="schedule"
          iconColor="#d97706"
          label="Upcoming bookings"
          value={stats.upcoming}
        />
      </section>

      <section className="mt-6 surface-card-static p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="section-title">Upcoming bookings</h2>
          <Button variant="secondary" size="sm" onClick={() => navigate("/provider/bookings")}>
            Manage bookings
          </Button>
        </div>

        {isLoading ? (
          <Spinner />
        ) : upcomingBookings.length > 0 ? (
          <div className="mt-4 divide-y [divide-color:var(--border)]">
            {upcomingBookings.map((booking) => (
              <article key={booking._id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="card-title">{booking.customerId?.name || "Customer"}</p>
                  <p className="caption-text">
                    {booking.categoryId?.name || "Service"} •{" "}
                    {formatDateTime(booking.scheduledDateTime)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge status={booking.status} />
                  <span className="text-sm font-semibold [color:var(--text)]">
                    {formatCurrency(booking.priceSnapshot)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div>
              <span className="empty-state-icon">
                <span className="material-symbols-outlined text-3xl">calendar_today</span>
              </span>
              <p className="body-text">No upcoming bookings yet.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
