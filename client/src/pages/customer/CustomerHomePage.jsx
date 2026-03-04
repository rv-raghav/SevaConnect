import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import useCategoryStore from "../../stores/useCategoryStore";
import useProviderStore from "../../stores/useProviderStore";
import CategoryCard from "../../components/shared/CategoryCard";
import ProviderCard from "../../components/shared/ProviderCard";
import Button from "../../components/ui/Button";

const QUICK_ACTIONS = [
  {
    icon: "calendar_month",
    title: "My bookings",
    text: "Track upcoming and completed services.",
    to: "/bookings",
  },
  {
    icon: "groups",
    title: "Browse providers",
    text: "Find verified professionals near you.",
    to: "/providers",
  },
  {
    icon: "person",
    title: "Profile settings",
    text: "Review your account information.",
    to: "/profile",
  },
];

export default function CustomerHomePage() {
  const { user } = useAuthStore();
  const { categories, fetchCategories, isLoading: categoriesLoading } =
    useCategoryStore();
  const { providers, fetchProviders, isLoading: providersLoading } =
    useProviderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchProviders();
  }, [fetchCategories, fetchProviders]);

  return (
    <div className="page-shell">
      <section className="surface-card-static p-6 md:p-8">
        <p className="caption-text">Welcome back</p>
        <h1 className="page-title mt-1">
          {user?.name?.split(" ")[0] || "Customer"}, what service do you need today?
        </h1>
        <p className="body-text mt-3 max-w-2xl">
          Discover trusted providers, compare ratings, and book a time slot in
          a few clicks.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="primary" size="lg" onClick={() => navigate("/providers")}>
            Find providers
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/bookings")}>
            View bookings
          </Button>
        </div>
      </section>

      <section className="mt-6 grid sm:grid-cols-3 gap-4">
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.to} to={action.to} className="surface-card">
            <span className="inline-flex size-10 rounded-[12px] items-center justify-center bg-[color:var(--primary-100)] text-[color:var(--primary-500)]">
              <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
            </span>
            <h2 className="card-title mt-3">{action.title}</h2>
            <p className="caption-text mt-1">{action.text}</p>
          </Link>
        ))}
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="section-title">Browse categories</h2>
            <p className="caption-text">Pick a category to start booking.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate("/providers")}>
            All categories
          </Button>
        </div>

        {categoriesLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-28 rounded-[16px] skeleton" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                onClick={() => navigate(`/providers?category=${category._id}`)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="section-title">Featured providers</h2>
            <p className="caption-text">Top rated professionals on SevaConnect.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate("/providers")}>
            View all
          </Button>
        </div>

        {providersLoading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-52 rounded-[16px] skeleton" />
            ))}
          </div>
        ) : providers.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {providers.slice(0, 6).map((provider) => (
              <ProviderCard
                key={provider._id || provider.userId?._id}
                provider={provider}
                onBook={(item) => navigate(`/book/${item.userId?._id || item._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="surface-card-static p-6 text-center">
            <h3 className="card-title">No providers available</h3>
            <p className="caption-text mt-1">Please try again shortly.</p>
          </div>
        )}
      </section>
    </div>
  );
}
