import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCategoryStore from "../../stores/useCategoryStore";
import useAuthStore from "../../stores/useAuthStore";
import { ROLE_HOME } from "../../utils/constants";
import BrandMark from "../../components/shared/BrandMark";
import CategoryCard from "../../components/shared/CategoryCard";
import Button from "../../components/ui/Button";
import ThemeToggle from "../../components/ui/ThemeToggle";

const TRUST_ITEMS = [
  {
    icon: "verified_user",
    title: "Verified professionals",
    text: "Every provider is identity-verified and quality-reviewed.",
  },
  {
    icon: "schedule",
    title: "Reliable scheduling",
    text: "Book exact slots and get live status updates for each booking.",
  },
  {
    icon: "support_agent",
    title: "Human support",
    text: "Dedicated support team helps with reschedules and service concerns.",
  },
];

const STATS = [
  { label: "Customers served", value: "50,000+" },
  { label: "Active providers", value: "2,000+" },
  { label: "Avg. rating", value: "4.8 / 5" },
];

const FALLBACK_CATEGORIES = [
  { _id: "cleaning", name: "Cleaning", description: "Home and deep cleaning" },
  { _id: "plumbing", name: "Plumbing", description: "Repairs and installation" },
  { _id: "electrical", name: "Electrical", description: "Wiring and fixtures" },
  { _id: "handyman", name: "Handyman", description: "General home fixes" },
];

export default function LandingPage() {
  const { categories, fetchCategories } = useCategoryStore();
  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const categoryList = useMemo(
    () => (categories.length > 0 ? categories : FALLBACK_CATEGORIES),
    [categories],
  );

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categoryList;
    return categoryList.filter((item) =>
      `${item.name} ${item.description || ""}`.toLowerCase().includes(query),
    );
  }, [categoryList, search]);

  const handleCategoryClick = (categoryId) => {
    if (token) {
      navigate(categoryId ? `/providers?category=${categoryId}` : "/providers");
      return;
    }
    navigate("/register");
  };

  const dashboardRoute = ROLE_HOME[user?.role] || "/home";

  return (
    <div className="min-h-screen app-bg">
      <header className="navbar-shell">
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6 lg:px-8 flex items-center gap-3">
          <BrandMark />
          <nav className="hidden md:flex items-center gap-2">
            <a href="#categories" className="btn btn-ghost btn-sm">
              Categories
            </a>
            <a href="#trust" className="btn btn-ghost btn-sm">
              Why SevaConnect
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle compact />
            {token ? (
              <Button as={Link} to={dashboardRoute} variant="primary" size="sm">
                Dashboard
              </Button>
            ) : (
              <>
                <Button as={Link} to="/login" variant="secondary" size="sm" className="hidden sm:inline-flex">
                  Log in
                </Button>
                <Button as={Link} to="/register" variant="primary" size="sm">
                  Get started
                </Button>
              </>
            )}
            <button
              type="button"
              className="btn btn-ghost btn-sm md:hidden !px-2.5"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
        {mobileMenuOpen ? (
          <div className="md:hidden px-4 pb-3 border-t [border-color:var(--border)]">
            <div className="pt-3 flex flex-col gap-2">
              <a href="#categories" className="btn btn-ghost btn-md justify-start" onClick={() => setMobileMenuOpen(false)}>
                Categories
              </a>
              <a href="#trust" className="btn btn-ghost btn-md justify-start" onClick={() => setMobileMenuOpen(false)}>
                Why SevaConnect
              </a>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <section className="page-shell pt-10 lg:pt-14">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-8 items-start">
            <div className="surface-card-static p-6 md:p-8">
              <span className="chip mb-4">Trusted local service marketplace</span>
              <h1 className="page-title max-w-2xl">
                Book verified home professionals with confidence.
              </h1>
              <p className="body-text mt-4 max-w-2xl">
                SevaConnect helps you discover trusted providers for cleaning,
                plumbing, electrical, and more with clear pricing and seamless
                booking.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleCategoryClick("")}
                >
                  Find a provider
                </Button>
                {!token ? (
                  <Button as={Link} to="/register" variant="outline" size="lg">
                    Join as provider
                  </Button>
                ) : null}
              </div>

              <div className="grid sm:grid-cols-3 gap-3 mt-8">
                {STATS.map((item) => (
                  <div key={item.label} className="surface-card-static p-4">
                    <p className="text-xl font-semibold [color:var(--text)]">{item.value}</p>
                    <p className="caption-text">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card-static p-6">
              <h2 className="section-title">Quick service search</h2>
              <p className="caption-text mt-1">
                Start with a category and refine on the provider page.
              </p>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="input-field mt-4"
                placeholder="Search category: cleaning, plumbing..."
              />
              <div className="mt-4 space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredCategories.slice(0, 8).map((category) => (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => handleCategoryClick(category._id)}
                    className="w-full text-left px-3 py-2 rounded-[12px] border [border-color:var(--border)] hover:[background:var(--surface-soft)] transition-colors"
                  >
                    <p className="card-title text-sm">{category.name}</p>
                    <p className="caption-text line-clamp-1">
                      {category.description || "Explore providers in this category"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="page-shell pt-0">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="section-title">Popular service categories</h2>
              <p className="caption-text">Explore top services from verified professionals.</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleCategoryClick("")}
            >
              Browse all
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryList.slice(0, 8).map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                onClick={() => handleCategoryClick(category._id)}
              />
            ))}
          </div>
        </section>

        <section id="trust" className="page-shell pt-0">
          <div className="surface-card-static p-6 md:p-8">
            <h2 className="section-title">Built for trust and consistency</h2>
            <p className="caption-text mt-1">
              Designed for real-world bookings at production scale.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {TRUST_ITEMS.map((item) => (
                <article key={item.title} className="surface-card-static p-4">
                  <span className="inline-flex size-10 items-center justify-center rounded-[12px] bg-[color:var(--primary-100)] text-[color:var(--primary-500)]">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </span>
                  <h3 className="card-title mt-3">{item.title}</h3>
                  <p className="caption-text mt-1">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
