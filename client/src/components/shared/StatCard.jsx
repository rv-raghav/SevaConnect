export default function StatCard({
  icon,
  iconColor = "text-primary bg-primary/10",
  label,
  value,
  trend,
  trendUp,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}
        >
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${trendUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
