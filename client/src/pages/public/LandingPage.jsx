import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCategoryStore from "../../stores/useCategoryStore";
import useAuthStore from "../../stores/useAuthStore";
import { ROLE_HOME } from "../../utils/constants";

/* ─── small inline logo ────────────────────────────────────────── */
function LogoIcon({ className = "size-8" }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

/* ─── category icon mapping ─────────────────────────────────────── */
const CAT_ICONS = {
  Cleaning: "cleaning_services",
  Plumbing: "plumbing",
  Electrical: "electrical_services",
  Handyman: "handyman",
  Gardening: "yard",
  Moving: "local_shipping",
  Painting: "format_paint",
  Carpentry: "carpenter",
};

/* ─── stats ─────────────────────────────────────────────────────── */
const STATS = [
  { value: "50K+", label: "Happy Customers" },
  { value: "2,000+", label: "Verified Pros" },
  { value: "4.8★", label: "Average Rating" },
  { value: "99%", label: "Satisfaction Rate" },
];

/* ─── how it works steps ─────────────────────────────────────────── */
const HOW_STEPS = [
  {
    icon: "search",
    step: "01",
    title: "Find a Service",
    desc: "Browse our curated list of top-rated professionals across dozens of service categories.",
  },
  {
    icon: "event",
    step: "02",
    title: "Book Instantly",
    desc: "Pick a convenient date & time. Get instant confirmation with no back-and-forth.",
  },
  {
    icon: "verified_user",
    step: "03",
    title: "Relax & Enjoy",
    desc: "Sit back while a background-verified expert handles the job to perfection.",
  },
];

/* ─── trust features ─────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "shield_person",
    title: "Background Verified",
    desc: "Every professional is personally vetted, ID-checked, and approved before joining.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: "payments",
    title: "Transparent Pricing",
    desc: "No hidden fees. See the full price upfront before you confirm your booking.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: "support_agent",
    title: "24/7 Support",
    desc: "Our support team is always a message away if anything doesn't go as planned.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: "repeat",
    title: "Satisfaction Promise",
    desc: "Not happy with the service? We'll make it right — no questions asked.",
    color: "bg-purple-50 text-purple-600",
  },
];

/* ─── testimonials ───────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Home Owner",
    avatar: "P",
    avatarBg: "bg-pink-500",
    text: "SevaConnect made finding a reliable plumber so easy. The professional arrived on time and fixed everything perfectly. Will definitely use again!",
    rating: 5,
    service: "Plumbing",
  },
  {
    name: "Rahul Mehta",
    role: "Apartment Resident",
    avatar: "R",
    avatarBg: "bg-blue-500",
    text: "Booked a deep cleaning service — the team was thorough, polite and professional. My apartment looks brand new. Highly recommended!",
    rating: 5,
    service: "Cleaning",
  },
  {
    name: "Sunita Joshi",
    role: "Villa Owner",
    avatar: "S",
    avatarBg: "bg-violet-500",
    text: "The electrician was prompt, knowledgeable, and didn't overcharge. Loved the seamless booking and real-time status updates.",
    rating: 5,
    service: "Electrical",
  },
];

export default function LandingPage() {
  const { categories, fetchCategories } = useCategoryStore();
  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCategoryClick = () =>
    navigate(token ? "/providers" : "/register");

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <LogoIcon className="size-8 text-primary" />
            <span className="text-slate-900 text-xl font-black tracking-tight">
              Seva<span className="text-primary">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            <a href="#services" className="nav-link">
              Services
            </a>
            <a href="#how-it-works" className="nav-link">
              How it Works
            </a>
            <a href="#why-us" className="nav-link">
              Why SevaConnect
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <button
                onClick={() => navigate(ROLE_HOME[user?.role] || "/home")}
                className="btn-primary"
              >
                Go to Dashboard
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-primary transition-colors text-sm font-bold"
                >
                  Log In
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started — Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            <span className="material-symbols-outlined">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-5 py-4 flex flex-col gap-4 animate-fade-in">
            <a
              href="#services"
              className="nav-link py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#how-it-works"
              className="nav-link py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </a>
            {token ? (
              <button
                onClick={() => navigate(ROLE_HOME[user?.role] || "/home")}
                className="btn-primary w-full"
              >
                Dashboard
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  className="btn-secondary w-full justify-center"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary w-full justify-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-white pt-12 pb-20 md:pt-20 md:pb-32">
          {/* Background blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-40 w-[640px] h-[640px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(17,33,212,0.06) 0%, transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-32 w-[480px] h-[480px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-5 lg:px-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Chip */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-700 mb-6 animate-fade-in-up">
                <span className="material-symbols-outlined text-[14px]">
                  verified
                </span>
                Trusted by 50,000+ customers across India
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.06] mb-6 animate-fade-in-up delay-100">
                Home services, <span className="gradient-text">done right</span>
              </h1>

              <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-xl mx-auto animate-fade-in-up delay-200">
                Book verified professionals for cleaning, plumbing, electrical,
                and 50+ more services — at the tap of a button.
              </p>

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center animate-fade-in-up delay-300">
                <Link
                  to={token ? "/providers" : "/register"}
                  className="btn-primary h-13 px-8 text-base rounded-xl"
                  style={{ height: "3.25rem", padding: "0 2rem" }}
                >
                  Book a Service
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
                <a
                  href="#how-it-works"
                  className="btn-secondary h-13 px-8 text-base rounded-xl"
                  style={{ height: "3.25rem", padding: "0 2rem" }}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    play_circle
                  </span>
                  How it Works
                </a>
              </div>

              {/* Social proof pills */}
              <div className="flex items-center justify-center gap-6 mt-10 animate-fade-in-up delay-400">
                <div className="flex -space-x-2">
                  {[
                    "bg-pink-400",
                    "bg-blue-400",
                    "bg-violet-400",
                    "bg-emerald-400",
                  ].map((c, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {["P", "R", "S", "A"][i]}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-amber-400 text-sm">
                        ★
                      </span>
                    ))}
                    <span className="text-slate-900 font-bold text-sm ml-1">
                      4.8
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs font-medium">
                    from 12,000+ reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ─────────────────────────────────────────────── */}
        <section className="bg-primary py-10">
          <div className="max-w-7xl mx-auto px-5 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-white mb-1">
                  {s.value}
                </div>
                <div className="text-blue-200 text-sm font-semibold">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── POPULAR SERVICES ─────────────────────────────────────────── */}
        <section id="services" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-5 lg:px-10">
            <div className="mb-12 text-center">
              <h2 className="section-heading">What do you need help with?</h2>
              <p className="section-subheading">
                Choose from our most popular service categories
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(categories.length > 0 ? categories : PLACEHOLDER_CATS).map(
                (cat, i) => (
                  <button
                    key={cat._id || i}
                    onClick={handleCategoryClick}
                    className="group card-premium p-6 flex flex-col items-center gap-3 cursor-pointer text-center"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/8 group-hover:bg-primary/15 transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[28px]">
                        {CAT_ICONS[cat.name] || "home_repair_service"}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-900 font-700 text-sm group-hover:text-primary transition-colors">
                        {cat.name}
                      </p>
                      {cat.description && (
                        <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                          {cat.description}
                        </p>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-[18px] self-end">
                      arrow_forward
                    </span>
                  </button>
                ),
              )}
            </div>

            <div className="text-center mt-10">
              <Link
                to={token ? "/providers" : "/register"}
                className="btn-secondary inline-flex"
              >
                View all services
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-5 lg:px-10">
            <div className="mb-14 text-center">
              <h2 className="section-heading">As easy as 1-2-3</h2>
              <p className="section-subheading">
                From discovery to completion in minutes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector line (desktop) */}
              <div
                aria-hidden
                className="hidden md:block absolute top-12 left-[calc(16.7%+2rem)] right-[calc(16.7%+2rem)] h-px bg-primary/20 z-0"
              />

              {HOW_STEPS.map((step, i) => (
                <div
                  key={i}
                  className="relative z-10 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center"
                >
                  {/* Step number badge */}
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-sm font-black mb-5">
                    {step.step}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-5">
                    <span className="material-symbols-outlined text-primary text-[28px]">
                      {step.icon}
                    </span>
                  </div>
                  <h3 className="text-slate-900 font-800 text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY SEVACONNECT ─────────────────────────────────────────── */}
        <section id="why-us" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-5 lg:px-10">
            <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h2 className="section-heading">Why SevaConnect?</h2>
                <p className="section-subheading">
                  We raise the bar for every home service experience
                </p>
              </div>
              <Link
                to={token ? "/home" : "/register"}
                className="btn-primary shrink-0 self-start md:self-auto"
              >
                Get Started Today
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURES.map((f, i) => (
                <div key={i} className="card-premium p-6 flex flex-col gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.color}`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {f.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-800 text-base mb-1.5">
                      {f.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-5 lg:px-10">
            <div className="mb-14 text-center">
              <h2 className="section-heading">What customers are saying</h2>
              <p className="section-subheading">
                Real stories from real SevaConnect customers
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="card-premium p-7 flex flex-col gap-5">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(t.rating)].map((_, s) => (
                      <span key={s} className="text-amber-400 text-base">
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {t.service}
                    </span>
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed flex-1">
                    "{t.text}"
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center text-white font-bold text-sm`}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-sm">
                        {t.name}
                      </p>
                      <p className="text-slate-400 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ──────────────────────────────────────────────── */}
        <section className="py-20 bg-primary relative overflow-hidden">
          {/* Decorative circles */}
          <div
            aria-hidden
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
            style={{ background: "rgba(255,255,255,0.3)" }}
          />
          <div
            aria-hidden
            className="absolute -bottom-28 -left-16 w-64 h-64 rounded-full opacity-10"
            style={{ background: "rgba(255,255,255,0.2)" }}
          />

          <div className="relative max-w-3xl mx-auto px-5 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Ready to get started?
            </h2>
            <p className="text-blue-200 text-lg font-medium mb-10">
              Join thousands of happy customers — book your first service in
              under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={token ? "/providers" : "/register"}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-800 text-base rounded-xl hover:bg-slate-50 transition-colors shadow-xl"
              >
                Book a Service Now
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
              {!token && (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-700 text-base rounded-xl hover:bg-white/20 transition-colors"
                >
                  I already have an account
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <LogoIcon className="size-7 text-primary" />
                <span className="text-white font-black text-lg">
                  Seva<span className="text-primary">Connect</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-5 max-w-xs">
                Connecting you with verified, top-rated local professionals for
                every home service need.
              </p>
              <div className="flex items-center gap-3">
                {["facebook", "twitter", "instagram", "linkedin"].map((s) => (
                  <div
                    key={s}
                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary/20 hover:text-primary transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {s === "twitter"
                        ? "alternate_email"
                        : s === "linkedin"
                          ? "work"
                          : s === "instagram"
                            ? "photo_camera"
                            : "groups"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
                For Customers
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  "Find Services",
                  "How it Works",
                  "Pricing",
                  "Customer Reviews",
                ].map((l) => (
                  <li key={l}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
                For Professionals
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  "Become a Pro",
                  "Pro Resources",
                  "Earnings Calculator",
                  "Success Stories",
                ].map((l) => (
                  <li key={l}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
                Company
              </h4>
              <ul className="space-y-3 text-sm">
                {[
                  "About Us",
                  "Careers",
                  "Press",
                  "Contact Us",
                  "Privacy Policy",
                ].map((l) => (
                  <li key={l}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2025 SevaConnect Technologies Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Placeholder category list while API loads */
const PLACEHOLDER_CATS = [
  { name: "Cleaning" },
  { name: "Plumbing" },
  { name: "Electrical" },
  { name: "Handyman" },
  { name: "Gardening" },
  { name: "Moving" },
  { name: "Painting" },
  { name: "Carpentry" },
];
