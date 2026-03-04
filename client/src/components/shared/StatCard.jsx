export default function StatCard({
  icon,
  iconColor = "var(--primary-500)",
  label,
  value,
  trend,
  trendUp,
}) {
  return (
    <div className="surface-card-static p-5">
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center"
          style={{
            color: iconColor,
            background: "color-mix(in srgb, var(--surface-soft) 70%, transparent)",
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
        <p className="text-2xl font-semibold [color:var(--text)]">{value}</p>
        <p className="caption-text mt-0.5">{label}</p>
      </div>
    </div>
  );
}
