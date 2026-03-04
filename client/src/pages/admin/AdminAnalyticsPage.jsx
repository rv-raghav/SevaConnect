import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminApi } from "../../api/admin";
import Spinner from "../../components/ui/Spinner";
import StatCard from "../../components/shared/StatCard";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const STATUS_COLORS = {
  completed: "#0e9f6e",
  "in-progress": "#d97706",
  confirmed: "#3448c5",
  requested: "#2563eb",
  cancelled: "#dc2626",
};

const STATUS_LABELS = {
  completed: "Completed",
  "in-progress": "In progress",
  confirmed: "Confirmed",
  requested: "Requested",
  cancelled: "Cancelled",
};

function buildMonthlyData(rawData, valueKey) {
  return (rawData || []).map((item) => ({
    name: MONTH_NAMES[item.month - 1],
    [valueKey]: item[valueKey] ?? item.count ?? 0,
  }));
}

function buildStatusData(distribution, totalBookings) {
  return (distribution || [])
    .filter((item) => item.status)
    .map((item) => ({
      name: STATUS_LABELS[item.status] || item.status,
      value: totalBookings > 0 ? Math.round((item.count / totalBookings) * 100) : 0,
      count: item.count,
      color: STATUS_COLORS[item.status] || "#64748b",
    }));
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await adminApi.getAnalytics();
        setAnalytics(data.data);
      } catch {
        // fallback empty state
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  const bookingsData = buildMonthlyData(analytics?.monthlyBookings, "count");
  const revenueData = buildMonthlyData(analytics?.monthlyRevenue, "revenue");
  const usersData = buildMonthlyData(analytics?.monthlyUsers, "count");
  const statusData = buildStatusData(
    analytics?.statusDistribution,
    analytics?.totalBookings || 0,
  );

  return (
    <div className="page-shell">
      <section className="surface-card-static p-5 md:p-6">
        <h1 className="page-title !text-3xl">Analytics</h1>
        <p className="caption-text mt-1">Detailed insights for platform performance.</p>
      </section>

      <section className="mt-6 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon="people"
          label="Total users"
          value={analytics?.totalUsers || 0}
          iconColor="var(--primary-500)"
        />
        <StatCard
          icon="groups"
          label="Providers"
          value={analytics?.totalProviders || 0}
          iconColor="#4f46e5"
        />
        <StatCard
          icon="calendar_month"
          label="Bookings"
          value={analytics?.totalBookings || 0}
          iconColor="var(--success-500)"
        />
        <StatCard
          icon="payments"
          label="Revenue"
          value={`₹${(analytics?.totalRevenue || 0).toLocaleString("en-IN")}`}
          iconColor="#d97706"
        />
      </section>

      <section className="mt-6 grid xl:grid-cols-2 gap-4">
        <article className="surface-card-static p-4 md:p-5">
          <h2 className="section-title">Monthly bookings</h2>
          {bookingsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--primary-500)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[270px] empty-state">
              <p className="caption-text">No booking data available.</p>
            </div>
          )}
        </article>

        <article className="surface-card-static p-4 md:p-5">
          <h2 className="section-title">Booking status distribution</h2>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    innerRadius={58}
                    outerRadius={92}
                    paddingAngle={4}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center">
                {statusData.map((entry) => (
                  <span key={entry.name} className="chip">
                    <span className="inline-block size-2 rounded-full" style={{ background: entry.color }} />
                    {entry.name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[270px] empty-state">
              <p className="caption-text">No status data available.</p>
            </div>
          )}
        </article>

        <article className="surface-card-static p-4 md:p-5">
          <h2 className="section-title">Revenue trend</h2>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={270}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary-500)"
                  fill="var(--primary-500)"
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[270px] empty-state">
              <p className="caption-text">No revenue data available.</p>
            </div>
          )}
        </article>

        <article className="surface-card-static p-4 md:p-5">
          <h2 className="section-title">User growth</h2>
          {usersData.length > 0 ? (
            <ResponsiveContainer width="100%" height={270}>
              <LineChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--success-500)"
                  strokeWidth={2}
                  dot={{ fill: "var(--success-500)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[270px] empty-state">
              <p className="caption-text">No user growth data available.</p>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
