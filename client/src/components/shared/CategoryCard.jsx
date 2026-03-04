import { motion as Motion } from "framer-motion";

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
  const color =
    CATEGORY_COLORS[category.name] ||
    "bg-[color:var(--primary-100)] text-[color:var(--primary-500)]";

  return (
    <Motion.button
      onClick={onClick}
      className="group surface-card w-full text-left"
      whileHover={{ y: -3, transition: { duration: 0.16 } }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-[14px] flex items-center justify-center transition-colors ${color} group-hover:opacity-90`}
        >
          <span className="material-symbols-outlined text-[24px]">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="card-title group-hover:[color:var(--primary-500)] transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="caption-text mt-1 line-clamp-2">{category.description}</p>
          )}
        </div>
        <span className="material-symbols-outlined text-[18px] [color:var(--text-muted)] group-hover:[color:var(--primary-500)] transition-colors">
          arrow_forward
        </span>
      </div>
    </Motion.button>
  );
}
