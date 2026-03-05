import { motion as Motion } from "framer-motion";
import useAuthStore from "../../stores/useAuthStore";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function ProfileSettingsPage() {
  const { user } = useAuthStore();

  const fields = [
    { label: "Full name", value: user?.name, icon: "person", color: "#3b82f6" },
    { label: "Email", value: user?.email, icon: "mail", color: "#8b5cf6" },
    { label: "City", value: user?.city, icon: "location_on", color: "#ec4899" },
    {
      label: "Role",
      value: user?.role ? `${user.role[0].toUpperCase()}${user.role.slice(1)}` : "-",
      icon: "badge",
      color: "#f59e0b",
    },
  ];

  return (
    <div className="page-shell max-w-3xl">
      <Motion.section
        className="glass-card p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ cursor: "default" }}
        whileHover={{}}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="icon-badge"
            style={{ width: 44, height: 44, borderRadius: 14 }}
          >
            <span className="material-symbols-outlined text-[22px]">settings</span>
          </div>
          <div>
            <h1
              className="font-bold"
              style={{
                fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                color: "var(--text)",
                letterSpacing: "-0.02em",
              }}
            >
              Profile settings
            </h1>
            <p className="caption-text">
              Your account details are currently read-only.
            </p>
          </div>
        </div>

        {/* Avatar card */}
        <Motion.div
          className="mt-6 flex items-center gap-4 p-5 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, var(--primary-500), #6366f1, #a855f7)",
            backgroundSize: "200% 200%",
            animation: "gradient-shift 10s ease infinite",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
            style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              color: "white",
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          >
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-lg truncate">{user?.name}</p>
            <p className="text-white/70 text-sm truncate">{user?.email}</p>
          </div>
        </Motion.div>

        {/* Info fields */}
        <Motion.div
          className="mt-6 rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
        >
          {fields.map((field, i) => (
            <Motion.div
              key={field.label}
              className="px-5 py-4 flex items-center gap-4"
              style={{
                borderBottom: i < fields.length - 1 ? "1px solid var(--border)" : "none",
                background: "transparent",
              }}
              variants={fadeUp}
              custom={i}
              whileHover={{
                backgroundColor: "color-mix(in srgb, var(--primary-500) 4%, transparent)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: `color-mix(in srgb, ${field.color} 12%, transparent)`,
                  color: field.color,
                }}
              >
                <span className="material-symbols-outlined text-[20px]">{field.icon}</span>
              </div>
              <div className="min-w-0">
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  {field.label}
                </p>
                <p className="body-text mt-0.5 truncate">{field.value || "—"}</p>
              </div>
            </Motion.div>
          ))}
        </Motion.div>

        {/* Security reminder */}
        <Motion.div
          className="mt-6 p-4 rounded-2xl flex items-start gap-3"
          style={{
            background: "color-mix(in srgb, var(--info-500) 6%, transparent)",
            border: "1px solid color-mix(in srgb, var(--info-500) 18%, var(--border))",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <span
            className="material-symbols-outlined text-[22px] shrink-0 mt-0.5"
            style={{ color: "var(--info-500)" }}
          >
            info
          </span>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Account security
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
              Your profile details are managed securely. Contact support to update
              your name, email, or role.
            </p>
          </div>
        </Motion.div>
      </Motion.section>
    </div>
  );
}
