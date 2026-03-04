import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useProviderStore from "../../stores/useProviderStore";
import useCategoryStore from "../../stores/useCategoryStore";
import ProviderCard from "../../components/shared/ProviderCard";
import useDebounce from "../../hooks/useDebounce";

function SkeletonCard() {
  return <div className="skeleton rounded-2xl h-52" />;
}

export default function ProviderListingsPage() {
  const { providers, fetchProviders, isLoading } = useProviderStore();
  const { categories, fetchCategories } = useCategoryStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [city, setCity] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const debouncedCity = useDebounce(city, 400);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const params = {};
    if (debouncedCity) params.city = debouncedCity;
    if (category) params.category = category;
    fetchProviders(params);
  }, [debouncedCity, category, fetchProviders]);

  const hasFilters = city || category;

  return (
    <div className="min-h-screen">
      {/* ── PAGE HEADER ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-5">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Browse Professionals
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {isLoading
                  ? "Finding professionals..."
                  : `${providers.length} verified professional${providers.length !== 1 ? "s" : ""} available`}
              </p>
            </div>
          </div>

          {/* ── FILTERS ────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* City search */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
                search
              </span>
              <input
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all text-sm font-medium"
                placeholder="Filter by city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {city && (
                <button
                  onClick={() => setCity("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                </button>
              )}
            </div>

            {/* Category filter */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
                category
              </span>
              <select
                className="h-11 pl-11 pr-8 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all appearance-none cursor-pointer min-w-[180px]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Clear all */}
            {hasFilters && (
              <button
                onClick={() => {
                  setCity("");
                  setCategory("");
                }}
                className="h-11 px-4 rounded-xl border border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">
                  clear_all
                </span>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── RESULTS ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : providers.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {providers.map((p) => (
                <ProviderCard
                  key={p._id || p.userId?._id}
                  provider={p}
                  onBook={(prov) =>
                    navigate(`/book/${prov.userId?._id || prov._id}`)
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-slate-300 text-5xl">
                person_search
              </span>
            </div>
            <h3 className="text-slate-900 font-black text-xl mb-2">
              No professionals found
            </h3>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">
              {hasFilters
                ? "Try adjusting your filters or searching a different city."
                : "No professionals are available at the moment. Check back soon!"}
            </p>
            {hasFilters && (
              <button
                onClick={() => {
                  setCity("");
                  setCategory("");
                }}
                className="btn-secondary"
              >
                <span className="material-symbols-outlined text-[18px]">
                  refresh
                </span>
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
