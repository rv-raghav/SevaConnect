import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useProviderStore from "../../stores/useProviderStore";
import useCategoryStore from "../../stores/useCategoryStore";
import ProviderCard from "../../components/shared/ProviderCard";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import useDebounce from "../../hooks/useDebounce";

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

  return (
    <div className="px-4 py-6 md:px-10 lg:px-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Browse Professionals
        </h1>
        <p className="text-slate-500 mt-1">
          Find the perfect professional for your needs
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 h-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            placeholder="Filter by city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <select
          className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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
      </div>

      {/* Results */}
      {isLoading ? (
        <Spinner />
      ) : providers.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      ) : (
        <EmptyState
          icon="person_search"
          title="No providers found"
          description="Try adjusting your filters or check back later."
        />
      )}
    </div>
  );
}
