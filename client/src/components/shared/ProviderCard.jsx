import { formatCurrency } from "../../utils/formatters";

export default function ProviderCard({ provider, onBook }) {
  const profile = provider.profile || provider;
  const user = provider.userId || provider;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-100 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
          {user.name?.charAt(0)?.toUpperCase() || "P"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 truncate">
            {user.name}
          </h3>
          <p className="text-sm text-slate-500">{user.city}</p>
          <div className="flex items-center gap-1 mt-1">
            <span
              className="material-symbols-outlined text-amber-400 text-[16px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-sm font-semibold text-slate-900">
              {profile.ratingAverage?.toFixed(1) || "0.0"}
            </span>
            <span className="text-sm text-slate-400">
              ({profile.totalReviews || 0} reviews)
            </span>
          </div>
        </div>
      </div>
      {profile.bio && (
        <p className="text-sm text-slate-600 mt-3 line-clamp-2">
          {profile.bio}
        </p>
      )}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
        <div>
          {profile.categories?.map((cat) => (
            <span
              key={cat._id || cat}
              className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-md mr-1 mb-1"
            >
              {cat.name || cat}
            </span>
          ))}
        </div>
        <button
          onClick={() => onBook?.(provider)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
        >
          <span>Book</span>
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
