import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import toast from "react-hot-toast";
import useCategoryStore from "../../stores/useCategoryStore";
import { providersApi } from "../../api/providers";
import { bookingsApi } from "../../api/bookings";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import { formatCurrency } from "../../utils/formatters";
import { validateFutureDate, validateRequired } from "../../utils/validators";

export default function ScheduleServicePage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { categories, fetchCategories } = useCategoryStore();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    categoryId: "",
    address: "",
    city: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    fetchCategories();
    const loadProvider = async () => {
      try {
        const { data } = await providersApi.getProviders();
        const found = data.data?.find(
          (item) => (item.userId?._id || item._id) === providerId,
        );
        if (found) setProvider(found);
      } catch {
        // ignore and show fallback
      } finally {
        setLoading(false);
      }
    };
    loadProvider();
  }, [fetchCategories, providerId]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next = {};
    const categoryError = validateRequired(form.categoryId, "Category");
    const addressError = validateRequired(form.address, "Address");
    const cityError = validateRequired(form.city, "City");
    const dateError = validateRequired(form.date, "Date");
    const timeError = validateRequired(form.time, "Time");

    if (categoryError) next.categoryId = categoryError;
    if (addressError) next.address = addressError;
    if (cityError) next.city = cityError;
    if (dateError) next.date = dateError;
    if (timeError) next.time = timeError;

    if (form.date && form.time) {
      const futureError = validateFutureDate(`${form.date}T${form.time}`);
      if (futureError) next.date = futureError;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const scheduledDateTime = new Date(`${form.date}T${form.time}`).toISOString();
      await bookingsApi.createBooking({
        providerId,
        categoryId: form.categoryId,
        address: form.address,
        city: form.city,
        scheduledDateTime,
        notes: form.notes || undefined,
      });
      toast.success("Booking created successfully");
      navigate("/bookings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  const profile = provider?.profile || provider;
  const user = provider?.userId || provider;
  const selectedCategory = categories.find((item) => item._id === form.categoryId);

  return (
    <div className="page-shell">
      {/* Back button */}
      <Motion.div
        className="mb-5"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </Button>
      </Motion.div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        {/* ─── Booking Form ─── */}
        <Motion.section
          className="glass-card p-6 md:p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ cursor: "default" }}
          whileHover={{}}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--primary-500), #6366f1)",
                color: "white",
              }}
            >
              <span className="material-symbols-outlined text-[22px]">edit_calendar</span>
            </div>
            <div>
              <h1
                className="font-bold"
                style={{
                  fontSize: "clamp(1.3rem, 2.5vw, 1.7rem)",
                  color: "var(--text)",
                  letterSpacing: "-0.02em",
                }}
              >
                Schedule service
              </h1>
              <p className="caption-text">
                Fill in the details. You can reschedule later.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category */}
            <div>
              <label className="input-label flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]" style={{ color: "var(--primary-500)" }}>
                  category
                </span>
                Service category
              </label>
              <div className="relative">
                <select
                  className={`input-field appearance-none ${errors.categoryId ? "is-error" : ""}`}
                  value={form.categoryId}
                  onChange={(e) => updateField("categoryId", e.target.value)}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name} - {formatCurrency(cat.basePrice)}
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
              {errors.categoryId && <p className="input-error">{errors.categoryId}</p>}
            </div>

            {/* Date & Time */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]" style={{ color: "var(--primary-500)" }}>
                    calendar_today
                  </span>
                  Date
                </label>
                <input
                  type="date"
                  className={`input-field ${errors.date ? "is-error" : ""}`}
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.date && <p className="input-error">{errors.date}</p>}
              </div>
              <div>
                <label className="input-label flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]" style={{ color: "var(--primary-500)" }}>
                    schedule
                  </span>
                  Time
                </label>
                <input
                  type="time"
                  className={`input-field ${errors.time ? "is-error" : ""}`}
                  value={form.time}
                  onChange={(e) => updateField("time", e.target.value)}
                />
                {errors.time && <p className="input-error">{errors.time}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="input-label flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]" style={{ color: "var(--primary-500)" }}>
                  home
                </span>
                Address
              </label>
              <input
                className={`input-field ${errors.address ? "is-error" : ""}`}
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Enter service address"
              />
              {errors.address && <p className="input-error">{errors.address}</p>}
            </div>

            {/* City */}
            <div>
              <label className="input-label flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]" style={{ color: "var(--primary-500)" }}>
                  location_city
                </span>
                City
              </label>
              <input
                className={`input-field ${errors.city ? "is-error" : ""}`}
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Enter city"
              />
              {errors.city && <p className="input-error">{errors.city}</p>}
            </div>

            {/* Notes */}
            <div>
              <label className="input-label flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]" style={{ color: "var(--primary-500)" }}>
                  notes
                </span>
                Notes
                <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>(optional)</span>
              </label>
              <textarea
                rows={4}
                className="input-field !h-auto py-3"
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Anything the provider should know?"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={submitting}
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Confirm booking
            </Button>
          </form>
        </Motion.section>

        {/* ─── Booking Summary Sidebar ─── */}
        <Motion.aside
          className="glass-card p-6 md:p-8 h-fit lg:sticky lg:top-20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          style={{ cursor: "default" }}
          whileHover={{}}
        >
          <h2 className="section-title flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]" style={{ color: "var(--primary-500)" }}>
              receipt_long
            </span>
            Booking summary
          </h2>

          {provider ? (
            <>
              <div
                className="mt-5 flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: "color-mix(in srgb, var(--surface-soft) 80%, transparent)" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-semibold text-lg shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--primary-500), #6366f1)" }}
                >
                  {user?.name?.[0]?.toUpperCase() || "P"}
                </div>
                <div className="min-w-0">
                  <p className="card-title truncate">{user?.name}</p>
                  <p className="caption-text flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    {user?.city}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className="material-symbols-outlined text-[14px]"
                      style={{
                        color: s <= Math.round(profile?.ratingAverage || 0) ? "#f59e0b" : "var(--border)",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  {(profile?.ratingAverage || 0).toFixed(1)}
                </span>
                <span className="caption-text">({profile?.totalReviews || 0} reviews)</span>
              </div>

              {profile?.bio && (
                <p className="body-text mt-3 leading-relaxed">{profile.bio}</p>
              )}

              {selectedCategory && (
                <div
                  className="mt-5 pt-4 space-y-3"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="caption-text flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">category</span>
                      Category
                    </span>
                    <span className="font-medium" style={{ color: "var(--text)" }}>
                      {selectedCategory.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="caption-text flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                      Base price
                    </span>
                    <span
                      className="font-bold text-base"
                      style={{ color: "var(--primary-500)" }}
                    >
                      {formatCurrency(selectedCategory.basePrice)}
                    </span>
                  </div>
                </div>
              )}

              {/* Security badge */}
              <div
                className="mt-5 p-3 rounded-2xl flex items-center gap-3"
                style={{
                  background: "color-mix(in srgb, var(--success-500) 8%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--success-500) 20%, var(--border))",
                }}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ color: "var(--success-500)" }}
                >
                  verified_user
                </span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--success-500)" }}>
                    Secure booking
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Your booking is protected by SevaConnect.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-4 text-center py-6">
              <span
                className="material-symbols-outlined text-[32px]"
                style={{ color: "var(--text-muted)" }}
              >
                person_off
              </span>
              <p className="caption-text mt-2">Provider details unavailable.</p>
            </div>
          )}
        </Motion.aside>
      </div>
    </div>
  );
}
