import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import useAuthStore from "../../stores/useAuthStore";
import useCategoryStore from "../../stores/useCategoryStore";
import useProviderStore from "../../stores/useProviderStore";
import CategoryCard from "../../components/shared/CategoryCard";
import ProviderCard from "../../components/shared/ProviderCard";
import Button from "../../components/ui/Button";

/* ─── static data ─── */

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

const SERVICE_IMAGES = {
  Cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop",
  Plumbing: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=250&fit=crop",
  Electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop",
  Handyman: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop",
  Gardening: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
  Painting: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&h=250&fit=crop",
  Carpentry: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=250&fit=crop",
  Moving: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&h=250&fit=crop",
};

const DEFAULT_SERVICE_IMAGE = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop";

/* ─── animation variants ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─── helper ─── */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

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

  const firstName = user?.name?.split(" ")[0] || "Customer";

  return (
    <div className="page-shell">
      {/* ─── HERO GREETING ─── */}
      <Motion.section
        className="surface-card-static p-6 md:p-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="caption-text">{getGreeting()} 👋</p>
            <h1 className="page-title mt-1">{firstName}, what do you need today?</h1>
            <p className="body-text mt-2 max-w-md">
              Discover trusted providers, compare ratings, and book in a few clicks.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate("/providers")}
              className="btn btn-primary btn-md"
            >
              <span className="material-symbols-outlined text-[17px]">search</span>
              Find providers
            </button>
            <button
              type="button"
              onClick={() => navigate("/bookings")}
              className="btn btn-secondary btn-md"
            >
              <span className="material-symbols-outlined text-[17px]">calendar_month</span>
              View bookings
            </button>
          </div>
        </div>
      </Motion.section>

      {/* ─── QUICK ACTIONS ─── */}
      <Motion.section
        className="mt-8 grid sm:grid-cols-3 gap-4"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {QUICK_ACTIONS.map((action, i) => (
          <Motion.div key={action.to} variants={fadeUp} custom={i}>
            <Link
              to={action.to}
              className="surface-card group block p-5"
              style={{ cursor: "pointer" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "var(--primary-100)",
                  color: "var(--primary-500)",
                }}
              >
                <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
              </div>
              <h2 className="card-title mt-3 group-hover:text-[color:var(--primary-500)] transition-colors">
                {action.title}
              </h2>
              <p className="caption-text mt-1">{action.text}</p>
              <span
                className="material-symbols-outlined absolute right-4 bottom-4 text-[18px] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"
                style={{ color: "var(--primary-500)" }}
              >
                arrow_forward
              </span>
            </Link>
          </Motion.div>
        ))}
      </Motion.section>

      {/* ─── BROWSE CATEGORIES ─── */}
      <section className="mt-10">
        <Motion.div
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h2 className="section-title flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ color: "var(--primary-500)" }}
              >
                category
              </span>
              Browse categories
            </h2>
            <p className="caption-text mt-1">
              Pick a category to find the right professional.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/providers")}
          >
            All categories
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Button>
        </Motion.div>

        {categoriesLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-28 rounded-[18px] skeleton" />
            ))}
          </div>
        ) : (
          <Motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {categories.map((category, i) => (
              <Motion.div key={category._id} variants={fadeUp} custom={i}>
                <CategoryCard
                  category={category}
                  onClick={() => navigate(`/providers?category=${category._id}`)}
                />
              </Motion.div>
            ))}
          </Motion.div>
        )}
      </section>

      {/* ─── POPULAR SERVICES (Image cards) ─── */}
      {categories.length > 0 && (
        <section className="mt-10">
          <Motion.div
            className="flex items-end justify-between gap-3 mb-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h2 className="section-title flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ color: "var(--primary-500)" }}
                >
                  home_repair_service
                </span>
                Popular services
              </h2>
              <p className="caption-text mt-1">
                Most booked services by our community.
              </p>
            </div>
          </Motion.div>

          <Motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {categories.slice(0, 4).map((cat, i) => (
              <Motion.button
                key={cat._id}
                type="button"
                onClick={() => navigate(`/providers?category=${cat._id}`)}
                className="group relative rounded-2xl overflow-hidden text-left"
                style={{ border: "1px solid var(--border)", cursor: "pointer", background: "var(--surface)" }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={SERVICE_IMAGES[cat.name] || DEFAULT_SERVICE_IMAGE}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6))",
                    }}
                  />
                  <h3
                    className="absolute bottom-3 left-4 text-white font-semibold text-base"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
                  >
                    {cat.name}
                  </h3>
                </div>
                <div className="p-3">
                  <p className="caption-text line-clamp-2">
                    {cat.description || "Explore verified professionals"}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-semibold mt-2 transition-colors"
                    style={{ color: "var(--primary-500)" }}
                  >
                    Explore
                    <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </Motion.button>
            ))}
          </Motion.div>
        </section>
      )}

      {/* ─── FEATURED PROVIDERS ─── */}
      <section className="mt-10">
        <Motion.div
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 mb-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h2 className="section-title flex items-center gap-2">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ color: "var(--primary-500)" }}
              >
                star
              </span>
              Featured providers
            </h2>
            <p className="caption-text mt-1">
              Top rated professionals on SevaConnect.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/providers")}
          >
            View all
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Button>
        </Motion.div>

        {providersLoading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-52 rounded-[18px] skeleton" />
            ))}
          </div>
        ) : providers.length > 0 ? (
          <Motion.div
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {providers.slice(0, 6).map((provider, i) => (
              <Motion.div key={provider._id || provider.userId?._id} variants={fadeUp} custom={i}>
                <ProviderCard
                  provider={provider}
                  onBook={(item) => navigate(`/book/${item.userId?._id || item._id}`)}
                />
              </Motion.div>
            ))}
          </Motion.div>
        ) : (
          <div className="glass-card p-8 text-center" style={{ cursor: "default" }} >
            <div
              className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: "color-mix(in srgb, var(--primary-500) 10%, transparent)",
                color: "var(--primary-500)",
              }}
            >
              <span className="material-symbols-outlined text-[32px]">group_off</span>
            </div>
            <h3 className="section-title">No providers available</h3>
            <p className="body-text mt-1">Please try again shortly.</p>
          </div>
        )}
      </section>
    </div>
  );
}
