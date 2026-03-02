import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import useCategoryStore from "../../stores/useCategoryStore";
import useProviderStore from "../../stores/useProviderStore";
import CategoryCard from "../../components/shared/CategoryCard";
import ProviderCard from "../../components/shared/ProviderCard";
import Spinner from "../../components/ui/Spinner";

export default function CustomerHomePage() {
  const { user } = useAuthStore();
  const {
    categories,
    fetchCategories,
    isLoading: catLoading,
  } = useCategoryStore();
  const {
    providers,
    fetchProviders,
    isLoading: provLoading,
  } = useProviderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProviders();
  }, [fetchCategories, fetchProviders]);

  return (
    <div className="px-4 py-6 md:px-10 lg:px-20">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-slate-500 mt-1">
          Find the right professional for your needs
        </p>
      </div>

      {/* Categories */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">Browse Services</h2>
          <button
            onClick={() => navigate("/providers")}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all
          </button>
        </div>
        {catLoading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                category={cat}
                onClick={() => navigate(`/providers?category=${cat._id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Providers */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Featured Professionals
          </h2>
          <button
            onClick={() => navigate("/providers")}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all
          </button>
        </div>
        {provLoading ? (
          <Spinner />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.slice(0, 6).map((p) => (
              <ProviderCard
                key={p._id || p.userId?._id}
                provider={p}
                onBook={(prov) =>
                  navigate(`/book/${prov.userId?._id || prov._id}`)
                }
              />
            ))}
          </div>
        )}
        {!provLoading && providers.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">
              group_off
            </span>
            No providers available at the moment.
          </div>
        )}
      </section>
    </div>
  );
}
