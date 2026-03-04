import { formatCurrency } from "../../utils/formatters";

function StarRating({ value = 0 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`material-symbols-outlined text-[14px] ${
            s <= Math.round(value) ? "text-amber-400" : "text-slate-200"
          }`}
          style={{
            fontVariationSettings:
              s <= Math.round(value) ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function ProviderCard({ provider, onBook }) {
  const profile = provider.profile || provider;
  const user = provider.userId || provider;
  const rating = profile.ratingAverage || 0;
  const reviews = profile.totalReviews || 0;

  return (
    <div className="card-premium p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-lg shrink-0">
          {user.name?.charAt(0)?.toUpperCase() || "P"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-slate-900 font-black text-base leading-tight truncate">
              {user.name}
            </h3>
            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[10px]">
                verified
              </span>
              Verified
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="material-symbols-outlined text-slate-400 text-[14px]">
              location_on
            </span>
            <span className="text-slate-500 text-xs font-medium">
              {user.city}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <StarRating value={rating} />
            <span className="text-slate-800 text-xs font-bold">
              {rating.toFixed(1)}
            </span>
            <span className="text-slate-400 text-xs">({reviews})</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
          {profile.bio}
        </p>
      )}

      {/* Categories */}
      {profile.categories?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.categories.slice(0, 3).map((cat) => (
            <span
              key={cat._id || cat}
              className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg"
            >
              {cat.name || cat}
            </span>
          ))}
          {profile.categories.length > 3 && (
            <span className="px-2.5 py-1 bg-slate-100 text-slate-400 text-xs font-semibold rounded-lg">
              +{profile.categories.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        {profile.hourlyRate ? (
          <div>
            <span className="text-slate-900 font-black text-base">
              {formatCurrency(profile.hourlyRate)}
            </span>
            <span className="text-slate-400 text-xs font-medium"> / hr</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs font-medium">
            Rate on request
          </span>
        )}
        <button
          onClick={() => onBook?.(provider)}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-primary/30"
        >
          Book Now
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
