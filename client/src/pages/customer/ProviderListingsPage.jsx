import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import useProviderStore from "../../stores/useProviderStore";
import useCategoryStore from "../../stores/useCategoryStore";
import ProviderCard from "../../components/shared/ProviderCard";
import EmptyState from "../../components/ui/EmptyState";
import useDebounce from "../../hooks/useDebounce";
import Button from "../../components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

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
      {/* ─── Header & Filters ─── */}
      <Motion.section
        className="glass-card p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ cursor: "default" }}
        whileHover={{}}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="icon-badge"
              style={{ width: 44, height: 44, borderRadius: 14 }}
            >
              <span className="material-symbols-outlined text-[22px]">groups</span>
            </div>
            <div>
              <h1
                className="font-bold"
                style={{
                  fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                  color: "var(--text)",
                  letterSpacing: "-0.02em",
                }}
              >
                Providers
              </h1>
              <p className="caption-text">
                {isLoading
                  ? "Searching providers..."
                  : `${providers.length} provider${providers.length === 1 ? "" : "s"} found`}
              </p>
            </div>
          </div>
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCity("");
                setCategory("");
              }}
            >
              <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
              Clear filters
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <div className="relative">
            <span
              className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px]"
              style={{ color: "var(--text-muted)" }}
            >
              location_on
            </span>
            <input
              className="input-field !pl-10"
              placeholder="Search by city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="relative">
            <span
              className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] z-10 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            >
              category
            </span>
            <select
              className="input-field !pl-10 appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ cursor: "pointer" }}
            >
              <option value="">All categories</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            <span
              className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            >
              expand_more
            </span>
          </div>
        </div>
      </Motion.section>

      {/* ─── Provider Grid ─── */}
      <section className="mt-6">
        {isLoading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, idx) => (
              <div key={idx} className="h-52 rounded-[18px] skeleton" />
            ))}
          </div>
        ) : providers.length > 0 ? (
          <Motion.div
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-4"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {providers.map((provider, i) => (
              <Motion.div
                key={provider._id || provider.userId?._id}
                variants={fadeUp}
                custom={i}
              >
                <ProviderCard
                  provider={provider}
                  onBook={(item) => navigate(`/book/${item.userId?._id || item._id}`)}
                />
              </Motion.div>
            ))}
          </Motion.div>
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
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
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
