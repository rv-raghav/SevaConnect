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

export default function CategoryCard({ category, onClick }) {
  const icon = CATEGORY_ICONS[category.name] || "home_repair_service";

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-slate-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <span className="material-symbols-outlined text-primary text-[28px]">
          {icon}
        </span>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-bold text-slate-900">{category.name}</h3>
        {category.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </button>
  );
}
