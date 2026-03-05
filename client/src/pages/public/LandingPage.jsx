import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import useCategoryStore from "../../stores/useCategoryStore";
import useAuthStore from "../../stores/useAuthStore";
import { ROLE_HOME } from "../../utils/constants";
import BrandMark from "../../components/shared/BrandMark";
import CategoryCard from "../../components/shared/CategoryCard";
import Button from "../../components/ui/Button";
import ThemeToggle from "../../components/ui/ThemeToggle";

/* ─── static data ─── */

const TRUST_ITEMS = [
  {
    icon: "verified_user",
    title: "Verified professionals",
    text: "Every provider is identity-verified and quality-reviewed before joining the platform.",
  },
  {
    icon: "schedule",
    title: "Reliable scheduling",
    text: "Book exact time slots and get live status updates for every booking in real time.",
  },
  {
    icon: "support_agent",
    title: "Dedicated support",
    text: "Our human support team helps with reschedules, refunds, and service concerns 24/7.",
  },
];

const STATS = [
  { label: "Customers served", value: "50,000+", icon: "group" },
  { label: "Active providers", value: "2,000+", icon: "engineering" },
  { label: "Average rating", value: "4.8 / 5", icon: "star" },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: "search",
    title: "Search & discover",
    text: "Browse verified providers by category, location, or service type.",
  },
  {
    step: 2,
    icon: "calendar_month",
    title: "Book instantly",
    text: "Pick your preferred time slot and confirm your booking in seconds.",
  },
  {
    step: 3,
    icon: "thumb_up",
    title: "Sit back & relax",
    text: "Track your booking live and rate your experience after completion.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Homeowner",
    text: "SevaConnect made finding a reliable plumber so easy. The booking was seamless and the provider was punctual and professional!",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "Business owner",
    text: "As a small business, I rely on quick electrical fixes. SevaConnect's verified pros and transparent pricing saved me hours.",
    rating: 5,
  },
  {
    name: "Anita Desai",
    role: "Working professional",
    text: "I've tried many platforms, but this one stands out. The scheduling, support, and quality are unmatched. Highly recommended!",
    rating: 4,
  },
];

const FALLBACK_CATEGORIES = [
  { _id: "cleaning", name: "Cleaning", description: "Home and deep cleaning" },
  { _id: "plumbing", name: "Plumbing", description: "Repairs and installation" },
  { _id: "electrical", name: "Electrical", description: "Wiring and fixtures" },
  { _id: "handyman", name: "Handyman", description: "General home fixes" },
];

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Categories", href: "#categories" },
  { label: "Testimonials", href: "#testimonials" },
];

/* ─── animation variants ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── sub-components ─── */

function StarRatingDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="material-symbols-outlined text-[16px]"
          style={{
            color: star <= rating ? "#f59e0b" : "var(--border)",
            fontVariationSettings: "'FILL' 1",
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function SectionBadge({ children }) {
  return (
    <Motion.span
      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase"
      style={{
        background: "color-mix(in srgb, var(--primary-500) 10%, transparent)",
        color: "var(--primary-500)",
        border: "1px solid color-mix(in srgb, var(--primary-500) 20%, var(--border))",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      {children}
    </Motion.span>
  );
}

/* ─── main component ─── */

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

  const handleCategoryClick = useCallback(
    (categoryId) => {
      if (token) {
        navigate(categoryId ? `/providers?category=${categoryId}` : "/providers");
        return;
      }
      navigate("/register");
    },
    [token, navigate],
  );

  const scrollToSection = useCallback((e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  }, []);

  const dashboardRoute = ROLE_HOME[user?.role] || "/home";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* ─────────── NAVBAR ─────────── */}
      <header className="navbar-shell">
        <div className="max-w-7xl mx-auto h-full px-3 sm:px-4 md:px-6 lg:px-8 flex items-center gap-2 sm:gap-3">
          <BrandMark />

          <nav className="hidden md:flex items-center gap-1 ml-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="btn btn-ghost btn-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle compact />
            {token ? (
              <Button as={Link} to={dashboardRoute} variant="primary" size="sm" className="!px-2.5 md:!px-3">
                <span className="material-symbols-outlined text-[16px]">dashboard</span>
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button as={Link} to="/login" variant="ghost" size="sm">
                  Log in
                </Button>
                <Button as={Link} to="/register" variant="primary" size="sm">
                  Get started
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Button>
              </div>
            )}

            <div className="flex md:hidden">
              <button
                type="button"
                className="btn btn-ghost btn-sm !px-2.5"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle menu"
              >
                <span className="material-symbols-outlined">
                  {mobileMenuOpen ? "close" : "menu"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <Motion.div
              className="md:hidden border-t px-4 pb-4"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="pt-3 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="btn btn-ghost btn-md justify-start"
                  >
                    {link.label}
                  </a>
                ))}
                {!token && (
                  <div className="flex gap-2 mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                    <Button as={Link} to="/login" variant="secondary" size="md" className="flex-1">
                      Log in
                    </Button>
                    <Button as={Link} to="/register" variant="primary" size="md" className="flex-1">
                      Get started
                    </Button>
                  </div>
                )}
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* ─────────── HERO ─────────── */}
        <section className="landing-hero">
          {/* Decorative orbs */}
          <div
            className="landing-orb"
            style={{
              width: 340,
              height: 340,
              top: "-10%",
              left: "10%",
              background: "color-mix(in srgb, var(--primary-500) 25%, transparent)",
            }}
          />
          <div
            className="landing-orb"
            style={{
              width: 260,
              height: 260,
              bottom: "-5%",
              right: "15%",
              background: "color-mix(in srgb, #a855f7 18%, transparent)",
              animationDelay: "3s",
            }}
          />
          <div
            className="landing-orb"
            style={{
              width: 180,
              height: 180,
              top: "50%",
              right: "5%",
              background: "color-mix(in srgb, #6366f1 15%, transparent)",
              animationDelay: "1.5s",
            }}
          />

          <div className="landing-section relative z-10" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <div className="max-w-3xl mx-auto text-center">
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SectionBadge>✨ Trusted local service marketplace</SectionBadge>
              </Motion.div>

              <Motion.h1
                className="mt-6"
                style={{
                  fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                  lineHeight: 1.1,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                Book verified home
                <br />
                <span className="gradient-text">professionals</span> with
                <br />
                confidence.
              </Motion.h1>

              <Motion.p
                className="mt-5 mx-auto"
                style={{
                  maxWidth: 560,
                  fontSize: "clamp(1rem, 1.5vw, 1.18rem)",
                  color: "var(--text-soft)",
                  lineHeight: 1.7,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                SevaConnect helps you discover trusted providers for cleaning,
                plumbing, electrical, and more — with clear pricing and seamless
                booking.
              </Motion.p>

              <Motion.div
                className="mt-8 flex flex-wrap justify-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <Button variant="primary" size="lg" onClick={() => handleCategoryClick("")}>
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  Find a provider
                </Button>
                {!token && (
                  <Button as={Link} to="/register" variant="outline" size="lg">
                    <span className="material-symbols-outlined text-[18px]">handshake</span>
                    Join as provider
                  </Button>
                )}
              </Motion.div>

              {/* Social proof strip */}
              <Motion.div
                className="mt-10 flex flex-wrap justify-center items-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex -space-x-2">
                  {["P", "R", "A", "S"].map((letter, i) => (
                    <div
                      key={letter}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"][i],
                        border: "2px solid var(--bg)",
                        zIndex: 4 - i,
                      }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className="material-symbols-outlined text-[14px]"
                        style={{ color: "#f59e0b", fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                    <span className="text-sm font-semibold ml-1" style={{ color: "var(--text)" }}>
                      4.8
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    from 50,000+ happy customers
                  </p>
                </div>
              </Motion.div>
            </div>
          </div>
        </section>

        {/* ─────────── STATS BAR ─────────── */}
        <section
          style={{
            background: "var(--surface)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Motion.div
            className="landing-section"
            style={{ paddingTop: 32, paddingBottom: 32 }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 sm:divide-x" style={{ "--tw-divide-opacity": "1", borderColor: "var(--border)" }}>
              {STATS.map((item, i) => (
                <Motion.div
                  key={item.label}
                  className="flex items-center justify-center gap-4 px-4"
                  variants={fadeUp}
                  custom={i}
                >
                  <div className="icon-badge">
                    <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
                      {item.value}
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {item.label}
                    </p>
                  </div>
                </Motion.div>
              ))}
            </div>
          </Motion.div>
        </section>

        {/* ─────────── CATEGORY SEARCH ─────────── */}
        <section className="landing-section">
          <Motion.div
            className="glass-card p-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            style={{ cursor: "default" }}
            whileHover={{}}
          >
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
              <div>
                <SectionBadge>Quick search</SectionBadge>
                <h2 className="section-title mt-4">Find the perfect service</h2>
                <p className="body-text mt-2">
                  Start typing to search across all categories. Click any category to discover verified
                  providers instantly.
                </p>
                <div className="relative mt-5">
                  <span
                    className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    search
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field !pl-11"
                    placeholder="Search: cleaning, plumbing, electrical..."
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredCategories.slice(0, 8).map((category) => (
                  <Motion.button
                    key={category._id}
                    type="button"
                    onClick={() => handleCategoryClick(category._id)}
                    className="w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 group"
                    style={{
                      border: "1px solid var(--border)",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                    whileHover={{
                      backgroundColor: "color-mix(in srgb, var(--primary-500) 6%, transparent)",
                      borderColor: "color-mix(in srgb, var(--primary-500) 30%, var(--border))",
                      x: 4,
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="card-title text-sm group-hover:[color:var(--primary-500)] transition-colors">
                        {category.name}
                      </p>
                      <p className="caption-text line-clamp-1">
                        {category.description || "Explore providers in this category"}
                      </p>
                    </div>
                    <span
                      className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-all"
                      style={{ color: "var(--primary-500)" }}
                    >
                      arrow_forward
                    </span>
                  </Motion.button>
                ))}
                {filteredCategories.length === 0 && (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-[32px]" style={{ color: "var(--text-muted)" }}>
                      search_off
                    </span>
                    <p className="caption-text mt-2">No categories found for "{search}"</p>
                  </div>
                )}
              </div>
            </div>
          </Motion.div>
        </section>

        {/* ─────────── FEATURES / WHY SEVACONNECT ─────────── */}
        <section id="features" className="landing-section">
          <Motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionBadge>Why SevaConnect</SectionBadge>
            <h2 className="section-title mt-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
              Built for trust and consistency
            </h2>
            <p className="body-text mt-2 mx-auto" style={{ maxWidth: 520 }}>
              Designed for real-world home service bookings at production scale.
            </p>
          </Motion.div>

          <Motion.div
            className="grid md:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {TRUST_ITEMS.map((item, i) => (
              <Motion.article
                key={item.title}
                className="glass-card p-6"
                variants={fadeUp}
                custom={i}
              >
                <div className="icon-badge mb-4">
                  <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                </div>
                <h3 className="card-title">{item.title}</h3>
                <p className="body-text mt-2">{item.text}</p>
              </Motion.article>
            ))}
          </Motion.div>
        </section>

        {/* ─────────── HOW IT WORKS ─────────── */}
        <section
          id="how-it-works"
          style={{ background: "var(--surface-soft)" }}
        >
          <div className="landing-section">
            <Motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SectionBadge>How it works</SectionBadge>
              <h2 className="section-title mt-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                Three simple steps to get started
              </h2>
              <p className="body-text mt-2 mx-auto" style={{ maxWidth: 480 }}>
                From search to completion, we make home services effortless.
              </p>
            </Motion.div>

            <Motion.div
              className="grid md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {HOW_IT_WORKS.map((item, i) => (
                <Motion.div
                  key={item.step}
                  className="text-center relative"
                  variants={fadeUp}
                  custom={i}
                >
                  {/* connector line (hidden on mobile and last item) */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="step-connector hidden md:block" />
                  )}
                  <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center relative z-10"
                    style={{
                      background: "linear-gradient(135deg, var(--primary-500), #6366f1)",
                      boxShadow: "0 8px 24px color-mix(in srgb, var(--primary-500) 30%, transparent)",
                    }}
                  >
                    <span className="material-symbols-outlined text-[24px] text-white">{item.icon}</span>
                  </div>
                  <div
                    className="mt-1 mb-3 mx-auto w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "color-mix(in srgb, var(--primary-500) 10%, transparent)",
                      color: "var(--primary-500)",
                    }}
                  >
                    {item.step}
                  </div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="body-text mt-2 mx-auto" style={{ maxWidth: 280 }}>
                    {item.text}
                  </p>
                </Motion.div>
              ))}
            </Motion.div>
          </div>
        </section>

        {/* ─────────── CATEGORIES GRID ─────────── */}
        <section id="categories" className="landing-section">
          <Motion.div
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <SectionBadge>Browse services</SectionBadge>
              <h2 className="section-title mt-4">Popular service categories</h2>
              <p className="body-text mt-1">Explore top services from verified professionals.</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => handleCategoryClick("")}>
              Browse all
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Button>
          </Motion.div>

          <Motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {categoryList.slice(0, 8).map((category, i) => (
              <Motion.div key={category._id} variants={fadeUp} custom={i}>
                <CategoryCard
                  category={category}
                  onClick={() => handleCategoryClick(category._id)}
                />
              </Motion.div>
            ))}
          </Motion.div>
        </section>

        {/* ─────────── TESTIMONIALS ─────────── */}
        <section
          id="testimonials"
          style={{ background: "var(--surface-soft)" }}
        >
          <div className="landing-section">
            <Motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <SectionBadge>Testimonials</SectionBadge>
              <h2 className="section-title mt-4" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
                What our customers say
              </h2>
              <p className="body-text mt-2 mx-auto" style={{ maxWidth: 480 }}>
                Real reviews from real people who trust SevaConnect for their home services.
              </p>
            </Motion.div>

            <Motion.div
              className="grid md:grid-cols-3 gap-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {TESTIMONIALS.map((t, i) => (
                <Motion.div
                  key={t.name}
                  className="glass-card testimonial-card p-6"
                  variants={fadeUp}
                  custom={i}
                >
                  <StarRatingDisplay rating={t.rating} />
                  <p className="body-text mt-4 leading-relaxed">{t.text}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${["#3b82f6", "#8b5cf6", "#ec4899"][i]}, ${["#6366f1", "#a855f7", "#f43f5e"][i]})`,
                      }}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                        {t.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {t.role}
                      </p>
                    </div>
                  </div>
                </Motion.div>
              ))}
            </Motion.div>
          </div>
        </section>

        {/* ─────────── CTA BANNER ─────────── */}
        <section className="landing-section">
          <Motion.div
            className="landing-cta-banner rounded-3xl p-8 md:p-14 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Subtle pattern overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 50%)",
              }}
            />
            <div className="relative z-10">
              <h2
                className="font-bold text-white"
                style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                Ready to transform your home service experience?
              </h2>
              <p className="mt-3 text-white/80 mx-auto" style={{ maxWidth: 500, fontSize: "1.05rem" }}>
                Join thousands of satisfied customers and verified service professionals on SevaConnect.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCategoryClick("")}
                  className="btn btn-lg"
                  style={{
                    background: "white",
                    color: "var(--primary-500)",
                    fontWeight: 700,
                    borderColor: "transparent",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  Find a provider
                </button>
                {!token && (
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="btn btn-lg"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      color: "white",
                      fontWeight: 600,
                      borderColor: "rgba(255,255,255,0.3)",
                    }}
                  >
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    Create free account
                  </button>
                )}
              </div>
            </div>
          </Motion.div>
        </section>

        {/* ─────────── FOOTER ─────────── */}
        <footer className="landing-footer">
          <div className="landing-section" style={{ paddingBottom: 0 }}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand column */}
              <div>
                <BrandMark />
                <p className="body-text mt-3" style={{ maxWidth: 240, lineHeight: 1.7 }}>
                  Your trusted marketplace for verified home service professionals. Book with confidence.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Quick Links
                </h4>
                <div className="flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="footer-link"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Services
                </h4>
                <div className="flex flex-col gap-2">
                  {categoryList.slice(0, 4).map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => handleCategoryClick(cat._id)}
                      className="footer-link text-left"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Get in Touch
                </h4>
                <div className="flex flex-col gap-2">
                  <span className="footer-link flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    support@sevaconnect.com
                  </span>
                  <span className="footer-link flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">phone</span>
                    +91 98765 43210
                  </span>
                  <span className="footer-link flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    New Delhi, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright bar */}
          <div
            className="mt-10 py-5 text-center text-xs"
            style={{
              borderTop: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            © {new Date().getFullYear()} SevaConnect. All rights reserved. Built with
            <span className="material-symbols-outlined text-[12px] mx-1" style={{ color: "#ef4444", fontVariationSettings: "'FILL' 1", verticalAlign: "middle" }}>
              favorite
            </span>
            in India.
          </div>
        </footer>
      </main>
    </div>
  );
}
