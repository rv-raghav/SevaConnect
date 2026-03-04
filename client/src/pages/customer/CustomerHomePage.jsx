import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import useCategoryStore from "../../stores/useCategoryStore";
import useProviderStore from "../../stores/useProviderStore";
import CategoryCard from "../../components/shared/CategoryCard";
import ProviderCard from "../../components/shared/ProviderCard";

function SectionHeader({ title, subtitle, onViewAll }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>
        )}
      </div>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
        >
          View all
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
        </button>
      )}
    </div>
  );
}

function SkeletonCard({ className = "" }) {
  return <div className={`skeleton rounded-2xl ${className}`} />;
}

const QUICK_ACTIONS = [
  {
    icon: "calendar_month",
    label: "My Bookings",
    desc: "Track your upcoming and past bookings",
    to: "/bookings",
    color: "bg-primary/8 text-primary",
  },
  {
    icon: "groups",
    label: "Browse Pros",
    desc: "Find verified professionals near you",
    to: "/providers",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: "person",
    label: "My Profile",
    desc: "Update your details and preferences",
    to: "/profile",
    color: "bg-amber-50 text-amber-600",
  },
];

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

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen">
      {/* ── HERO BANNER ──────────────────────────────────────────── */}
      <div className="bg-primary relative overflow-hidden">
        {/* Decorative circles */}
        <div
          aria-hidden
          className="absolute -top-10 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: "rgba(255,255,255,0.5)" }}
        />
        <div
          aria-hidden
          className="absolute top-4 right-32 w-20 h-20 rounded-full opacity-8"
          style={{ background: "rgba(255,255,255,0.3)" }}
        />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-10 py-10">
          <div className="max-w-xl">
            <p className="text-blue-200 text-sm font-semibold mb-1">
              Good day, {firstName} 👋
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-3">
              What service do you
              <br />
              need today?
            </h1>
            <p className="text-blue-200 text-sm font-medium mb-6">
              Browse from 50+ categories and get instant help from verified
              professionals.
            </p>
            <button
              onClick={() => navigate("/providers")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors shadow-lg"
            >
              <span className="material-symbols-outlined text-[18px]">
                search
              </span>
              Find a Professional
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8 space-y-12">
        {/* ── QUICK ACTIONS ─────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="card-premium p-5 flex items-center gap-4 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${action.color}`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {action.icon}
                  </span>
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-sm">
                    {action.label}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5 leading-snug">
                    {action.desc}
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-[18px] ml-auto">
                  arrow_forward
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── BROWSE CATEGORIES ─────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Browse Services"
            subtitle="Choose from our curated service categories"
            onViewAll={() => navigate("/providers")}
          />

          {catLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} className="h-36" />
              ))}
            </div>
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

        {/* ── FEATURED PROVIDERS ─────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Top Professionals"
            subtitle="Most highly rated service providers on SevaConnect"
            onViewAll={() => navigate("/providers")}
          />

          {provLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} className="h-44" />
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <span className="material-symbols-outlined text-5xl text-slate-200 block mb-3">
                group_off
              </span>
              <p className="text-slate-500 font-medium">
                No professionals available right now. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
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
        </section>

        {/* ── BOTTOM CTA ────────────────────────────────────────────── */}
        <section className="bg-slate-900 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <h3 className="text-white text-xl font-black tracking-tight mb-1">
              Become a SevaConnect Pro
            </h3>
            <p className="text-slate-400 text-sm font-medium">
              Earn more by offering your expert services to thousands of
              customers.
            </p>
          </div>
          <Link
            to="/register"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[18px]">
              engineering
            </span>
            Join as a Pro
          </Link>
        </section>
      </div>
    </div>
  );
}
