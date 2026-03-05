import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { adminApi } from "../../api/admin";
import Spinner from "../../components/ui/Spinner";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const STATUS_COLORS = {
  completed: "#10b981", "in-progress": "#f59e0b",
  confirmed: "#6366f1", requested: "#3b82f6", cancelled: "#ef4444",
};
const STATUS_LABELS = {
  completed: "Completed", "in-progress": "In progress",
  confirmed: "Confirmed", requested: "Requested", cancelled: "Cancelled",
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

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl text-sm"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        color: "var(--text)",
      }}
    >
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color || p.stroke }}>
          {p.name || p.dataKey}:{" "}
          <strong>{formatter ? formatter(p.value, p.name) : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const STAT_CARDS = (analytics) => [
  { icon: "people", label: "Total users", value: (analytics?.totalUsers || 0).toLocaleString("en-IN"), gradient: "linear-gradient(135deg, var(--primary-500), #6366f1)" },
  { icon: "groups", label: "Providers", value: (analytics?.totalProviders || 0).toLocaleString("en-IN"), gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)" },
  { icon: "calendar_month", label: "Bookings", value: (analytics?.totalBookings || 0).toLocaleString("en-IN"), gradient: "linear-gradient(135deg, #10b981, #059669)" },
  { icon: "payments", label: "Revenue", value: `₹${(analytics?.totalRevenue || 0).toLocaleString("en-IN")}`, gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
];

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await adminApi.getAnalytics();
        setAnalytics(data.data);
      } catch { /* fallback */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  const bookingsData = buildMonthlyData(analytics?.monthlyBookings, "count");
  const revenueData = buildMonthlyData(analytics?.monthlyRevenue, "revenue");
  const usersData = buildMonthlyData(analytics?.monthlyUsers, "count");
  const statusData = buildStatusData(analytics?.statusDistribution, analytics?.totalBookings || 0);
  const statCards = STAT_CARDS(analytics);

  return (
    <div className="page-shell">
      {/* Header */}
      <Motion.section
        className="glass-card p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ cursor: "default" }}
        whileHover={{}}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg, var(--primary-500), #6366f1)" }}
          >
            <span className="material-symbols-outlined text-[22px]">analytics</span>
          </div>
          <div>
            <h1 className="font-bold" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", color: "var(--text)", letterSpacing: "-0.02em" }}>
              Analytics
            </h1>
            <p className="caption-text">Detailed insights for platform performance.</p>
          </div>
        </div>
      </Motion.section>

      {/* KPI mini cards */}
      <Motion.section
        className="mt-6 grid sm:grid-cols-2 xl:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {statCards.map((card, i) => (
          <Motion.div
            key={card.label}
            className="glass-card p-5 flex items-center gap-4"
            variants={fadeUp}
            custom={i}
            style={{ cursor: "default" }}
            whileHover={{}}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0"
              style={{ background: card.gradient }}
            >
              <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>{card.value}</p>
              <p className="caption-text">{card.label}</p>
            </div>
          </Motion.div>
        ))}
      </Motion.section>

      {/* Charts grid */}
      <section className="mt-6 grid xl:grid-cols-2 gap-4">
        {/* Monthly Bookings Bar */}
        <Motion.article
          className="glass-card p-5 md:p-6"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4 }}
          style={{ cursor: "default" }} whileHover={{}}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, var(--primary-500), #6366f1)" }}>
              <span className="material-symbols-outlined text-[16px]">bar_chart</span>
            </div>
            <h2 className="section-title">Monthly bookings</h2>
          </div>
          {bookingsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={bookingsData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "color-mix(in srgb, var(--primary-500) 6%, transparent)" }} />
                <Bar dataKey="count" name="Bookings" fill="var(--primary-500)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[270px] empty-state"><p className="caption-text">No booking data available.</p></div>
          )}
        </Motion.article>

        {/* Status Distribution Donut */}
        <Motion.article
          className="glass-card p-5 md:p-6"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
          style={{ cursor: "default" }} whileHover={{}}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}>
              <span className="material-symbols-outlined text-[16px]">donut_large</span>
            </div>
            <h2 className="section-title">Booking status distribution</h2>
          </div>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" innerRadius={58} outerRadius={92} paddingAngle={4}>
                    {statusData.map((entry) => (<Cell key={entry.name} fill={entry.color} />))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} content={<CustomTooltip formatter={(v, n) => `${v}%`} />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {statusData.map((entry) => (
                  <span key={entry.name} className="chip flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: entry.color }} />
                    {entry.name} ({entry.count})
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[270px] empty-state"><p className="caption-text">No status data available.</p></div>
          )}
        </Motion.article>

        {/* Revenue Area Chart */}
        <Motion.article
          className="glass-card p-5 md:p-6"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.15 }}
          style={{ cursor: "default" }} whileHover={{}}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
              <span className="material-symbols-outlined text-[16px]">area_chart</span>
            </div>
            <h2 className="section-title">Revenue trend</h2>
          </div>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={270}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary-500)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--primary-500)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} content={<CustomTooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`} />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--primary-500)" fill="url(#revenueGrad)" strokeWidth={2.5} dot={{ fill: "var(--primary-500)", r: 4, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[270px] empty-state"><p className="caption-text">No revenue data available.</p></div>
          )}
        </Motion.article>

        {/* User growth Line */}
        <Motion.article
          className="glass-card p-5 md:p-6"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}
          style={{ cursor: "default" }} whileHover={{}}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
              <span className="material-symbols-outlined text-[16px]">person_add</span>
            </div>
            <h2 className="section-title">User growth</h2>
          </div>
          {usersData.length > 0 ? (
            <ResponsiveContainer width="100%" height={270}>
              <LineChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" name="Users" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[270px] empty-state"><p className="caption-text">No user growth data available.</p></div>
          )}
        </Motion.article>
      </section>
    </div>
  );
}
