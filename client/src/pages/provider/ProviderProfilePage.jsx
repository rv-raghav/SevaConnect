import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import toast from "react-hot-toast";
import useProviderStore from "../../stores/useProviderStore";
import useAuthStore from "../../stores/useAuthStore";
import useCategoryStore from "../../stores/useCategoryStore";
import { providersApi } from "../../api/providers";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

const AVAILABILITY_OPTIONS = [
  { value: "available", icon: "check_circle", label: "Available", color: "var(--success-500)" },
  { value: "busy", icon: "pending", label: "Busy", color: "#f59e0b" },
  { value: "offline", icon: "cancel", label: "Offline", color: "var(--text-muted)" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.38, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function ProviderProfilePage() {
  const { myProfile, fetchMyProfile, isLoading } = useProviderStore();
  const { user } = useAuthStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bio: "",
    experienceYears: "",
    categories: [],
    availabilityStatus: "available",
  });

  useEffect(() => {
    fetchMyProfile();
    fetchCategories();
  }, [fetchMyProfile, fetchCategories]);

  useEffect(() => {
    if (!myProfile) return;
    setForm({
      bio: myProfile.bio || "",
      experienceYears: myProfile.experienceYears || "",
      categories: myProfile.categories?.map((item) => item._id || item) || [],
      availabilityStatus: myProfile.availabilityStatus || "available",
    });
  }, [myProfile]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleCategory = (categoryId) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((item) => item !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.categories.length === 0) {
      toast.error("Select at least one service category");
      return;
    }
    setSaving(true);
    try {
      await providersApi.createOrUpdateProfile({
        bio: form.bio,
        experienceYears: Number(form.experienceYears) || 0,
        categories: form.categories,
        availabilityStatus: form.availabilityStatus,
      });
      toast.success("Profile updated");
      fetchMyProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !myProfile) return <Spinner />;

  const currentAvailability = AVAILABILITY_OPTIONS.find((o) => o.value === form.availabilityStatus);

  return (
    <div className="page-shell max-w-4xl">
      {/* ─── Profile Hero Card ─── */}
      <Motion.section
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ cursor: "default" }}
        whileHover={{}}
      >
        {/* Banner */}
        <div
          className="h-24 relative"
          style={{ background: "linear-gradient(135deg, var(--primary-500), #6366f1, #a855f7)", backgroundSize: "200% 200%", animation: "gradient-shift 10s ease infinite" }}
        >
          <div className="absolute -bottom-10 left-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "3px solid white", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
            >
              {user?.name?.[0]?.toUpperCase() || "P"}
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="pt-14 pb-6 px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-bold" style={{ fontSize: "clamp(1.3rem, 2vw, 1.6rem)", color: "var(--text)", letterSpacing: "-0.02em" }}>
                {user?.name || "Provider"}
              </h1>
              <p className="caption-text">{user?.email}</p>
              {user?.city && (
                <p className="caption-text flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {user.city}
                </p>
              )}
            </div>
            {/* Availability badge */}
            {currentAvailability && (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  color: currentAvailability.color,
                  background: `color-mix(in srgb, ${currentAvailability.color} 12%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${currentAvailability.color} 25%, var(--border))`,
                }}
              >
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>{currentAvailability.icon}</span>
                {currentAvailability.label}
              </span>
            )}
          </div>

          {/* Stats row */}
          {myProfile && (
            <Motion.div
              className="mt-5 grid sm:grid-cols-3 gap-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {[
                { icon: "star", label: "Avg. rating", value: myProfile.ratingAverage?.toFixed(1) || "0.0", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
                { icon: "rate_review", label: "Total reviews", value: myProfile.totalReviews || 0, gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)" },
                { icon: "check_circle", label: "Jobs completed", value: myProfile.completedJobs || 0, gradient: "linear-gradient(135deg, #10b981, #059669)" },
              ].map((stat, i) => (
                <Motion.div
                  key={stat.label}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{ background: "color-mix(in srgb, var(--surface-soft) 80%, transparent)", border: "1px solid var(--border)" }}
                  variants={fadeUp}
                  custom={i}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white"
                    style={{ background: stat.gradient }}
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: stat.icon === "star" ? "'FILL' 1" : "'FILL' 0" }}>{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-xl font-bold" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>{stat.value}</p>
                    <p className="caption-text text-xs">{stat.label}</p>
                  </div>
                </Motion.div>
              ))}
            </Motion.div>
          )}
        </div>
      </Motion.section>

      {/* ─── Edit Form ─── */}
      <Motion.section
        className="mt-6 glass-card p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        style={{ cursor: "default" }}
        whileHover={{}}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, var(--primary-500), #6366f1)" }}>
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </div>
          <h2 className="section-title">Edit profile</h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Bio */}
          <div>
            <label className="input-label flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]" style={{ color: "var(--primary-500)" }}>description</span>
              Bio
            </label>
            <textarea
              rows={4}
              className="input-field h-auto! py-3"
              placeholder="Describe your experience, specialization, and what makes you stand out…"
              value={form.bio}
              onChange={(e) => setField("bio", e.target.value)}
            />
          </div>

          {/* Experience */}
          <div>
            <label className="input-label flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]" style={{ color: "var(--primary-500)" }}>work</span>
              Years of experience
            </label>
            <input
              type="number"
              min="0"
              max="50"
              className="input-field"
              placeholder="e.g. 5"
              value={form.experienceYears}
              onChange={(e) => setField("experienceYears", e.target.value)}
            />
          </div>

          {/* Availability */}
          <div>
            <label className="input-label flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]" style={{ color: "var(--primary-500)" }}>schedule</span>
              Availability status
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {AVAILABILITY_OPTIONS.map((opt) => {
                const selected = form.availabilityStatus === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setField("availabilityStatus", opt.value)}
                    className="btn btn-sm flex items-center gap-1.5"
                    style={{
                      color: selected ? "white" : opt.color,
                      background: selected ? opt.color : `color-mix(in srgb, ${opt.color} 10%, transparent)`,
                      borderColor: selected ? opt.color : `color-mix(in srgb, ${opt.color} 30%, var(--border))`,
                      fontWeight: 600,
                    }}
                  >
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>{opt.icon}</span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="input-label flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]" style={{ color: "var(--primary-500)" }}>category</span>
              Service categories
            </label>
            <p className="caption-text mb-3">Select all services you can provide.</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const selected = form.categories.includes(category._id);
                return (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => toggleCategory(category._id)}
                    className="btn btn-sm"
                    style={{
                      background: selected ? "var(--primary-500)" : "color-mix(in srgb, var(--surface-soft) 90%, transparent)",
                      color: selected ? "white" : "var(--text-soft)",
                      borderColor: selected ? "color-mix(in srgb, var(--primary-500) 70%, black 30%)" : "var(--border)",
                      fontWeight: 600,
                      boxShadow: selected ? "0 4px 14px color-mix(in srgb, var(--primary-500) 25%, transparent)" : "none",
                    }}
                  >
                    {selected && <span className="material-symbols-outlined text-[14px]">check</span>}
                    {category.name}
                  </button>
                );
              })}
            </div>
            {form.categories.length > 0 && (
              <p className="caption-text mt-2">{form.categories.length} categor{form.categories.length === 1 ? "y" : "ies"} selected</p>
            )}
          </div>

          {/* Submit */}
          <div
            className="pt-2"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={saving}
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save profile
            </Button>
          </div>
        </form>
      </Motion.section>
    </div>
  );
}
