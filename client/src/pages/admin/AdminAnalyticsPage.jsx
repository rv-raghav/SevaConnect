import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { adminApi } from "../../api/admin";
import StatCard from "../../components/shared/StatCard";
import Spinner from "../../components/ui/Spinner";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const STATUS_COLORS = {
  completed: "#10b981",
  "in-progress": "#f59e0b",
  confirmed: "#6366f1",
  requested: "#3b82f6",
  cancelled: "#ef4444",
};

const STATUS_LABELS = {
  completed: "Completed",
  "in-progress": "In Progress",
  confirmed: "Confirmed",
  requested: "Requested",
  cancelled: "Cancelled",
};

function buildMonthlyData(rawData, valueKey) {
  return (rawData || []).map((m) => ({
    name: MONTH_NAMES[m.month - 1],
    [valueKey]: m[valueKey] ?? m.count ?? 0,
  }));
}

function buildStatusData(statusDistribution, totalBookings) {
  return (statusDistribution || [])
    .filter((s) => s.status)
    .map((s) => ({
      name: STATUS_LABELS[s.status] || s.status,
      value: totalBookings > 0 ? Math.round((s.count / totalBookings) * 100) : 0,
      count: s.count,
      color: STATUS_COLORS[s.status] || "#94a3b8",
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
        /* ignore */
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  const bookingsChartData = buildMonthlyData(analytics?.monthlyBookings, "count");
  const revenueChartData = buildMonthlyData(analytics?.monthlyRevenue, "revenue");
  const statusData = buildStatusData(
    analytics?.statusDistribution,
    analytics?.totalBookings || 0
  );
  const usersChartData = buildMonthlyData(analytics?.monthlyUsers, "count");

  return (
    <div className="px-4 py-6 md:px-8 lg:px-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Analytics
        </h1>
        <p className="text-slate-500 mt-1">
          Detailed platform metrics and trends
        </p>
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
          label="Active Providers"
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
          label="Total Revenue"
          value={`₹${(analytics?.totalRevenue || 0).toLocaleString("en-IN")}`}
          iconColor="text-amber-600 bg-amber-50"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Monthly Bookings
          </h3>
          {bookingsChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={bookingsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Bar dataKey="count" name="Bookings" fill="#1121d4" radius={[6, 6, 0, 0]} />
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
            Booking Status Distribution
          </h3>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                    formatter={(v, name) => [
                      `${v}% (${statusData.find((s) => s.name === name)?.count || 0})`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {statusData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-slate-600">{entry.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
              No status data available yet
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Revenue Trend
          </h3>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                  formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1121d4"
                  fill="#1121d4"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
              No revenue data available yet
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">User Growth</h3>
          {usersChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={usersChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Users"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
              No user data available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
