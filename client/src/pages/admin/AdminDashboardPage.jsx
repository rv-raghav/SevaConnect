import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { adminApi } from "../../api/admin";
import StatCard from "../../components/shared/StatCard";
import Spinner from "../../components/ui/Spinner";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function buildMonthlyChartData(monthlyBookings, monthlyRevenue) {
  const map = {};
  (monthlyBookings || []).forEach((m) => {
    const key = `${m.year}-${m.month}`;
    map[key] = {
      name: `${MONTH_NAMES[m.month - 1]}`,
      bookings: m.count,
      revenue: 0,
    };
  });
  (monthlyRevenue || []).forEach((m) => {
    const key = `${m.year}-${m.month}`;
    if (!map[key]) {
      map[key] = { name: `${MONTH_NAMES[m.month - 1]}`, bookings: 0, revenue: 0 };
    }
    map[key].revenue = m.revenue;
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
        /* ignore */
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  const chartData = buildMonthlyChartData(
    analytics?.monthlyBookings,
    analytics?.monthlyRevenue
  );

  return (
    <div className="px-4 py-6 md:px-8 lg:px-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Platform overview and key metrics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="people"
          label="Total Users"
          value={analytics?.totalUsers || 0}
          iconColor="text-primary bg-primary/10"
        />
        <StatCard
          icon="groups"
          label="Providers"
          value={analytics?.totalProviders || 0}
          iconColor="text-indigo-600 bg-indigo-50"
        />
        <StatCard
          icon="calendar_month"
          label="Total Bookings"
          value={analytics?.totalBookings || 0}
          iconColor="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          icon="payments"
          label="Revenue"
          value={`₹${(analytics?.totalRevenue || 0).toLocaleString("en-IN")}`}
          iconColor="text-amber-600 bg-amber-50"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Booking Trends
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Bar dataKey="bookings" fill="#1121d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
              No booking data available yet
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Revenue Trends
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                  formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1121d4"
                  strokeWidth={2}
                  dot={{ fill: "#1121d4", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
              No revenue data available yet
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/admin/providers")}
          className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:shadow-md transition-shadow group"
        >
          <span className="material-symbols-outlined text-primary text-2xl mb-3 block">
            groups
          </span>
          <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
            Manage Providers
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Approve or reject provider applications
          </p>
        </button>
        <button
          onClick={() => navigate("/admin/categories")}
          className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:shadow-md transition-shadow group"
        >
          <span className="material-symbols-outlined text-primary text-2xl mb-3 block">
            category
          </span>
          <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
            Manage Categories
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Add or edit service categories
          </p>
        </button>
        <button
          onClick={() => navigate("/admin/analytics")}
          className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:shadow-md transition-shadow group"
        >
          <span className="material-symbols-outlined text-primary text-2xl mb-3 block">
            analytics
          </span>
          <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
            View Analytics
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Detailed platform analytics and trends
          </p>
        </button>
      </div>
    </div>
  );
}
