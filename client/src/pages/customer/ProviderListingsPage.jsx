import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useProviderStore from "../../stores/useProviderStore";
import useCategoryStore from "../../stores/useCategoryStore";
import ProviderCard from "../../components/shared/ProviderCard";
import EmptyState from "../../components/ui/EmptyState";
import useDebounce from "../../hooks/useDebounce";
import Button from "../../components/ui/Button";

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

  const hasFilters = Boolean(city || category);

  return (
    <div className="page-shell">
      <section className="surface-card-static p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="page-title !text-3xl">Providers</h1>
            <p className="caption-text mt-1">
              {isLoading
                ? "Searching providers..."
                : `${providers.length} provider${providers.length === 1 ? "" : "s"} found`}
            </p>
          </div>
        </div>

        <div className="mt-4 grid sm:grid-cols-[1fr_220px_auto] gap-3">
          <input
            className="input-field"
            placeholder="Search by city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
          <select
            className="input-field"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
          {hasFilters ? (
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setCity("");
                setCategory("");
              }}
            >
              Clear filters
            </Button>
          ) : null}
        </div>
      </section>

      <section className="mt-6">
        {isLoading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, idx) => (
              <div key={idx} className="h-52 rounded-[16px] skeleton" />
            ))}
          </div>
        ) : providers.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <ProviderCard
                key={provider._id || provider.userId?._id}
                provider={provider}
                onBook={(item) => navigate(`/book/${item.userId?._id || item._id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="person_search"
            title="No providers available"
            description={
              hasFilters
                ? "Try another city or category."
                : "No providers are currently listed."
            }
            action={
              hasFilters ? (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setCity("");
                    setCategory("");
                  }}
                >
                  Reset search
                </Button>
              ) : null
            }
          />
        )}
      </section>
    </div>
  );
}
