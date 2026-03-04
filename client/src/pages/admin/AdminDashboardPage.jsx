import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminApi } from "../../api/admin";
import Button from "../../components/ui/Button";
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

function buildChartData(monthlyBookings, monthlyRevenue) {
  const map = {};
  (monthlyBookings || []).forEach((item) => {
    const key = `${item.year}-${item.month}`;
    map[key] = {
      month: MONTH_NAMES[item.month - 1],
      bookings: item.count,
      revenue: 0,
    };
  });
  (monthlyRevenue || []).forEach((item) => {
    const key = `${item.year}-${item.month}`;
    if (!map[key]) {
      map[key] = { month: MONTH_NAMES[item.month - 1], bookings: 0, revenue: 0 };
    }
    map[key].revenue = item.revenue;
  });
  return Object.values(map);
}

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await adminApi.getAnalytics();
        setAnalytics(data.data);
      } catch {
        // show fallback empty state
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  const chartData = buildChartData(
    analytics?.monthlyBookings,
    analytics?.monthlyRevenue,
  );

  return (
    <div className="page-shell">
      <section className="surface-card-static p-5 md:p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, var(--primary-500), transparent 70%)" }} />
        </div>
        <div className="relative">
          <h1 className="page-title !text-3xl">Admin <span className="gradient-text">dashboard</span></h1>
          <p className="caption-text mt-1">
            Monitor platform health, growth, and operational metrics.
          </p>
        </div>
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
          <h2 className="section-title">Booking trend</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="bookings" fill="var(--primary-500)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] empty-state">
              <p className="caption-text">No booking trend data yet.</p>
            </div>
          )}
        </article>

        <article className="surface-card-static p-4 md:p-5">
          <h2 className="section-title">Revenue trend</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--success-500)"
                  strokeWidth={2}
                  dot={{ fill: "var(--success-500)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] empty-state">
              <p className="caption-text">No revenue trend data yet.</p>
            </div>
          )}
        </article>
      </section>

      <section className="mt-6 grid sm:grid-cols-3 gap-4">
        <article className="surface-card p-4">
          <h3 className="card-title">Provider approvals</h3>
          <p className="caption-text mt-1">Review pending provider requests.</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => navigate("/admin/providers")}
          >
            Open providers
          </Button>
        </article>
        <article className="surface-card p-4">
          <h3 className="card-title">Category management</h3>
          <p className="caption-text mt-1">Add or update service categories.</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => navigate("/admin/categories")}
          >
            Open categories
          </Button>
        </article>
        <article className="surface-card p-4">
          <h3 className="card-title">Moderation</h3>
          <p className="caption-text mt-1">Review and remove flagged feedback.</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => navigate("/admin/reviews")}
          >
            Open reviews
          </Button>
        </article>
      </section>
    </div>
  );
}
