import { formatCurrency } from "../../utils/formatters";
import { motion as Motion } from "framer-motion";
import Button from "../ui/Button";

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
    <Motion.article
      className="surface-card flex flex-col gap-4"
      whileHover={{ y: -3, transition: { duration: 0.16 } }}
    >
      {/* Header */}
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white font-semibold text-lg shrink-0 bg-[color:var(--primary-500)]">
          {user.name?.charAt(0)?.toUpperCase() || "P"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="card-title leading-tight truncate">
              {user.name}
            </h3>
            <span
              className="status-pill shrink-0"
              style={{
                color: "var(--success-500)",
                background:
                  "color-mix(in srgb, var(--success-500) 14%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--success-500) 30%, var(--border))",
              }}
            >
              <span className="material-symbols-outlined text-[10px]">
                verified
              </span>
              Verified
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="material-symbols-outlined text-[14px] [color:var(--text-muted)]">
              location_on
            </span>
            <span className="caption-text">
              {user.city}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <StarRating value={rating} />
            <span className="text-xs font-semibold [color:var(--text)]">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs [color:var(--text-muted)]">({reviews})</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p className="body-text leading-relaxed line-clamp-2">
          {profile.bio}
        </p>
      )}

      {/* Categories */}
      {profile.categories?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.categories.slice(0, 3).map((cat) => (
            <span
              key={cat._id || cat}
              className="chip"
            >
              {cat.name || cat}
            </span>
          ))}
          {profile.categories.length > 3 && (
            <span className="chip">
              +{profile.categories.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t [border-color:var(--border)]">
        {profile.hourlyRate ? (
          <div>
            <span className="text-base font-semibold [color:var(--text)]">
              {formatCurrency(profile.hourlyRate)}
            </span>
            <span className="caption-text"> / hr</span>
          </div>
        ) : (
          <span className="caption-text">
            Rate on request
          </span>
        )}
        <Button onClick={() => onBook?.(provider)} variant="primary" size="md">
          Book Now
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </Button>
      </div>
    </Motion.article>
  );
}
