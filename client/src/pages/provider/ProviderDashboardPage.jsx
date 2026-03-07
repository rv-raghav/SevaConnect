import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import useAuthStore from "../../stores/useAuthStore";
import useProviderStore from "../../stores/useProviderStore";
import useBookingStore from "../../stores/useBookingStore";
import { providersApi } from "../../api/providers";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.07,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const STATUS_ICON_STYLE = {
  requested: {
    bg: "linear-gradient(135deg, #64748b, #94a3b8)",
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
};

export default function ProviderDashboardPage() {
  const { user } = useAuthStore();
  const { myProfile, fetchMyProfile } = useProviderStore();
  const { bookings, fetchProviderBookings, isLoading } = useBookingStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedBookings: 0,
    upcomingBookings: 0,
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    fetchMyProfile();
    fetchProviderBookings({ limit: 50 });
    providersApi
      .getProviderStats()
      .then(({ data }) => {
        if (data.data) setStats(data.data);
      })
      .catch(() => {});
  }, [fetchMyProfile, fetchProviderBookings]);

  const upcomingBookings = bookings
    .filter((b) => ["requested", "confirmed", "in-progress"].includes(b.status))
    .sort(
      (a, b) => new Date(a.scheduledDateTime) - new Date(b.scheduledDateTime),
    )
    .slice(0, 6);

  const KPI_CARDS = [
    {
      icon: "payments",
      label: "Total earnings",
      value: formatCurrency(stats.totalEarnings),
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      shadow: "color-mix(in srgb, #10b981 22%, transparent)",
    },
    {
      icon: "star",
      label: "Avg. rating",
      value: myProfile?.ratingAverage?.toFixed(1) || "0.0",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      shadow: "color-mix(in srgb, #f59e0b 22%, transparent)",
    },
    {
      icon: "check_circle",
      label: "Completed jobs",
      value: stats.completedBookings,
      gradient: "linear-gradient(135deg, var(--primary-500), #6366f1)",
      shadow: "color-mix(in srgb, var(--primary-500) 22%, transparent)",
    },
    {
      icon: "schedule",
      label: "Upcoming",
      value: stats.upcomingBookings,
      gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
      shadow: "color-mix(in srgb, #8b5cf6 22%, transparent)",
    },
  ];

  return (
    <div className="page-shell">
      {/* ─── Page Header ─── */}
      <Motion.section
        className="surface-card-static p-6 md:p-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="caption-text">{greeting} 👋</p>
            <h1 className="page-title mt-1">
              {user?.name?.split(" ")[0] || "Provider"}
            </h1>
            <p className="body-text mt-2">
              Track your bookings, earnings, and performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {myProfile?.ratingAverage > 0 && (
              <div
                className="px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center gap-1.5"
                style={{
                  background: "var(--surface-soft)",
                  color: "var(--text-soft)",
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  className="material-symbols-outlined text-[15px]"
                  style={{
                    color: "#d97706",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  star
                </span>
                {myProfile.ratingAverage.toFixed(1)} rating
              </div>
            )}
            <Button
              onClick={() => navigate("/provider/bookings")}
              variant="secondary"
              size="md"
            >
              <span className="material-symbols-outlined text-[17px]">
                calendar_month
              </span>
              All bookings
            </Button>
          </div>
        </div>
      </Motion.section>

      {/* ─── KPI Cards ─── */}
      <Motion.section
        className="mt-6 grid sm:grid-cols-2 xl:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {KPI_CARDS.map((card, i) => (
          <Motion.div
            key={card.label}
            className="surface-card p-5"
            variants={fadeUp}
            custom={i}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--primary-100)",
                color: "var(--primary-500)",
              }}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{
                  fontVariationSettings:
                    card.icon === "star" ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {card.icon}
              </span>
            </div>
            <p
              className="text-2xl font-bold mt-4"
              style={{ color: "var(--text)", letterSpacing: "-0.02em" }}
            >
              {card.value}
            </p>
            <p className="caption-text mt-0.5">{card.label}</p>
          </Motion.div>
        ))}
      </Motion.section>

      {/* ─── Upcoming Bookings ─── */}
      <Motion.section
        className="mt-6 glass-card p-5 md:p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.28 }}
        style={{ cursor: "default" }}
        whileHover={{}}
      >
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary-500), #6366f1)",
              }}
            >
              <span className="material-symbols-outlined text-[16px]">
                calendar_month
              </span>
            </div>
            <h2 className="section-title">Upcoming bookings</h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/provider/bookings")}
          >
            <span className="material-symbols-outlined text-[16px]">
              open_in_new
            </span>
            Manage all
          </Button>
        </div>

        {isLoading ? (
          <Spinner />
        ) : upcomingBookings.length > 0 ? (
          <div className="space-y-2">
            {upcomingBookings.map((booking, i) => {
              const iconStyle =
                STATUS_ICON_STYLE[booking.status] ||
                STATUS_ICON_STYLE.requested;
              return (
                <Motion.article
                  key={booking._id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 rounded-2xl transition-colors"
                  style={{
                    background:
                      "color-mix(in srgb, var(--surface-soft) 60%, transparent)",
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{
                    backgroundColor:
                      "color-mix(in srgb, var(--primary-500) 5%, transparent)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
                      style={{ background: iconStyle.bg }}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {iconStyle.icon}
                      </span>
                    </div>
                    <div>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: "var(--text)" }}
                      >
                        {booking.customerId?.name || "Customer"}
                      </p>
                      <p className="caption-text flex items-center gap-1.5 mt-0.5">
                        <span className="material-symbols-outlined text-[13px]">
                          home_repair_service
                        </span>
                        {booking.categoryId?.name || "Service"}
                        <span>·</span>
                        <span className="material-symbols-outlined text-[13px]">
                          schedule
                        </span>
                        {formatDateTime(booking.scheduledDateTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={booking.status} />
                    <span
                      className="text-sm font-bold"
                      style={{ color: "var(--text)" }}
                    >
                      {formatCurrency(booking.priceSnapshot)}
                    </span>
                  </div>
                </Motion.article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state py-10">
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "color-mix(in srgb, var(--primary-500) 10%, transparent)",
                  color: "var(--primary-500)",
                }}
              >
                <span className="material-symbols-outlined text-[28px]">
                  calendar_today
                </span>
              </div>
              <p className="body-text">No upcoming bookings yet.</p>
              <p className="caption-text">
                Customer requests will appear here.
              </p>
            </div>
          </div>
        )}
      </Motion.section>
    </div>
  );
}
