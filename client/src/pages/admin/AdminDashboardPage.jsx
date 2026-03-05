import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
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

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildChartData(monthlyBookings, monthlyRevenue) {
  const map = {};
  (monthlyBookings || []).forEach((item) => {
    const key = `${item.year}-${item.month}`;
    map[key] = { month: MONTH_NAMES[item.month - 1], bookings: item.count, revenue: 0 };
  });
  (monthlyRevenue || []).forEach((item) => {
    const key = `${item.year}-${item.month}`;
    if (!map[key]) map[key] = { month: MONTH_NAMES[item.month - 1], bookings: 0, revenue: 0 };
    map[key].revenue = item.revenue;
  });
  return Object.values(map);
}

const QUICK_LINKS = [
  {
    to: "/admin/services",
    title: "Manage Services",
    text: "Add, edit or remove service listings on the platform.",
    icon: "home_repair_service",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    imgUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=200&fit=crop",
  },
  {
    to: "/admin/providers",
    title: "Manage Providers",
    text: "Review provider profiles, approvals, and performance.",
    icon: "engineering",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    imgUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&h=200&fit=crop",
  },
  {
    to: "/admin/bookings",
    title: "Manage Bookings",
    text: "Track all customer bookings and resolve disputes.",
    icon: "calendar_month",
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    imgUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=200&fit=crop",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

const CustomTooltip = ({ active, payload, label }) => {
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
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.dataKey === "revenue" ? `₹${Number(p.value).toLocaleString("en-IN")}` : p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await adminApi.getAnalytics();
        setAnalytics(data.data);
      } catch { /* show fallback */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  const chartData = buildChartData(analytics?.monthlyBookings, analytics?.monthlyRevenue);
  const kpiCards = KPI_CARDS(analytics);

  return (
    <div className="page-shell">
      {/* ─── Header ─── */}
      <Motion.section
        className="surface-card-static p-6 md:p-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="caption-text">SevaConnect Admin</p>
            <h1 className="page-title mt-1">Dashboard</h1>
            <p className="body-text mt-2 max-w-md">
              Monitor platform health, growth, and performance.
            </p>
          </div>
          <Button
            onClick={() => navigate("/admin/analytics")}
            variant="secondary"
            size="md"
          >
            <span className="material-symbols-outlined text-[18px]">analytics</span>
            Analytics
          </Button>
        </div>
      </Motion.section>

      {/* ─── KPI Stat Cards ─── */}
      <Motion.section
        className="mt-6 grid sm:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {kpiCards.map((card, i) => (
          <Motion.div
            key={card.label}
            className="surface-card p-5"
            variants={fadeUp}
            custom={i}
          >
            <div className="flex items-start justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--primary-100)", color: "var(--primary-500)" }}
              >
                <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
              </div>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  color: card.positive ? "var(--success-500)" : "var(--error-500)",
                  background: card.positive
                    ? "color-mix(in srgb, var(--success-500) 10%, transparent)"
                    : "color-mix(in srgb, var(--error-500) 10%, transparent)",
                }}
              >
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold mt-4" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>
              {card.value}
            </p>
            <p className="caption-text mt-0.5">{card.label}</p>
          </Motion.div>
        ))}
      </Motion.section>

      {/* ─── Charts Row ─── */}
      <section className="mt-6 grid xl:grid-cols-2 gap-4">
        <Motion.article
          className="glass-card p-5 md:p-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{ cursor: "default" }}
          whileHover={{}}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "var(--primary-100)", color: "var(--primary-500)" }}
            >
              <span className="material-symbols-outlined text-[15px]">bar_chart</span>
            </div>
            <h2 className="section-title">Booking trend</h2>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "color-mix(in srgb, var(--primary-500) 6%, transparent)" }} />
                <Bar dataKey="bookings" fill="var(--primary-500)" radius={[6, 6, 0, 0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] empty-state">
              <p className="caption-text">No booking data yet.</p>
            </div>
          )}
        </Motion.article>

        <Motion.article
          className="glass-card p-5 md:p-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ cursor: "default" }}
          whileHover={{}}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white" }}
            >
              <span className="material-symbols-outlined text-[16px]">show_chart</span>
            </div>
            <h2 className="section-title">Revenue trend</h2>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ fill: "#10b981", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] empty-state">
              <p className="caption-text">No revenue data yet.</p>
            </div>
          )}
        </Motion.article>
      </section>

      {/* ─── Quick Action Cards ─── */}
      <Motion.section
        className="mt-6 grid sm:grid-cols-3 gap-4"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {QUICK_LINKS.map((link, i) => (
          <Motion.div key={link.to} variants={fadeUp} custom={i}>
            <button
              type="button"
              onClick={() => navigate(link.to)}
              className="group block w-full text-left glass-card overflow-hidden relative"
              style={{ cursor: "pointer" }}
            >
              {/* Image */}
              <div className="relative h-32 overflow-hidden">
                <img
                  src={link.imgUrl}
                  alt={link.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.55))" }} />
                <div
                  className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: link.gradient, color: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.25)" }}
                >
                  <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="card-title group-hover:text-[color:var(--primary-500)] transition-colors">{link.title}</h3>
                <p className="caption-text mt-1">{link.text}</p>
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold mt-3 transition-colors"
                  style={{ color: "var(--primary-500)" }}
                >
                  Open
                  <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </span>
              </div>
            </button>
          </Motion.div>
        ))}
      </Motion.section>
    </div>
  );
}
