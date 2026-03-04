export default function StatCard({
  icon,
  iconColor = "var(--primary-500)",
  label,
  value,
  trend,
  trendUp,
}) {
  return (
    <div className="surface-card-static p-5 group hover:glow-border transition-all duration-200">
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-[12px] flex items-center justify-center"
          style={{
            color: "#fff",
            background: `linear-gradient(135deg, ${iconColor}, color-mix(in srgb, ${iconColor} 70%, #8B5CF6))`,
            boxShadow: `0 4px 12px color-mix(in srgb, ${iconColor} 25%, transparent)`,
          }}
        >
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        {trend && (
          <span
            className="status-pill"
            style={{
              color: trendUp ? "var(--success-500)" : "var(--error-500)",
              background: trendUp
                ? "color-mix(in srgb, var(--success-500) 16%, transparent)"
                : "color-mix(in srgb, var(--error-500) 16%, transparent)",
              borderColor: trendUp
                ? "color-mix(in srgb, var(--success-500) 30%, var(--border))"
                : "color-mix(in srgb, var(--error-500) 30%, var(--border))",
            }}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold [color:var(--text)] tracking-tight">{value}</p>
        <p className="caption-text mt-1">{label}</p>
      </div>
    </div>
  );
}
