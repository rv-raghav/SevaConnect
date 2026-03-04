const CATEGORY_ICONS = {
  Plumbing: "plumbing",
  Cleaning: "cleaning_services",
  Electrical: "electrical_services",
  Handyman: "handyman",
  Gardening: "yard",
  Moving: "local_shipping",
  Painting: "format_paint",
  Carpentry: "carpenter",
};

const CATEGORY_COLORS = {
  Plumbing: "bg-blue-50 text-blue-600",
  Cleaning: "bg-emerald-50 text-emerald-600",
  Electrical: "bg-amber-50 text-amber-600",
  Handyman: "bg-orange-50 text-orange-600",
  Gardening: "bg-green-50 text-green-600",
  Moving: "bg-violet-50 text-violet-600",
  Painting: "bg-pink-50 text-pink-600",
  Carpentry: "bg-yellow-50 text-yellow-700",
};

export default function CategoryCard({ category, onClick }) {
  const icon = CATEGORY_ICONS[category.name] || "home_repair_service";
  const color = CATEGORY_COLORS[category.name] || "bg-primary/8 text-primary";

  return (
    <button
      onClick={onClick}
      className="group card-premium p-5 flex flex-col items-center gap-3 text-center cursor-pointer w-full"
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${color} group-hover:opacity-90`}
      >
        <span className="material-symbols-outlined text-[28px]">{icon}</span>
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
            {category.description}
          </p>
        )}
      </div>
      <span className="material-symbols-outlined text-slate-200 group-hover:text-primary transition-colors text-[16px]">
        arrow_forward
      </span>
    </button>
  );
}
