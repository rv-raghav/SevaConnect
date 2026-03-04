import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
      <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <section className="surface-card-static p-5 md:p-6">
          <h1 className="page-title !text-3xl">Schedule service</h1>
          <p className="caption-text mt-1">
            Fill in the booking details. You can reschedule later if needed.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="input-label">Service category</label>
              <select
                className={`input-field ${errors.categoryId ? "is-error" : ""}`}
                value={form.categoryId}
                onChange={(event) => updateField("categoryId", event.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name} - {formatCurrency(category.basePrice)}
                  </option>
                ))}
              </select>
              {errors.categoryId ? <p className="input-error">{errors.categoryId}</p> : null}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Date</label>
                <input
                  type="date"
                  className={`input-field ${errors.date ? "is-error" : ""}`}
                  value={form.date}
                  onChange={(event) => updateField("date", event.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.date ? <p className="input-error">{errors.date}</p> : null}
              </div>
              <div>
                <label className="input-label">Time</label>
                <input
                  type="time"
                  className={`input-field ${errors.time ? "is-error" : ""}`}
                  value={form.time}
                  onChange={(event) => updateField("time", event.target.value)}
                />
                {errors.time ? <p className="input-error">{errors.time}</p> : null}
              </div>
            </div>

            <div>
              <label className="input-label">Address</label>
              <input
                className={`input-field ${errors.address ? "is-error" : ""}`}
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder="Enter service address"
              />
              {errors.address ? <p className="input-error">{errors.address}</p> : null}
            </div>

            <div>
              <label className="input-label">City</label>
              <input
                className={`input-field ${errors.city ? "is-error" : ""}`}
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder="Enter city"
              />
              {errors.city ? <p className="input-error">{errors.city}</p> : null}
            </div>

            <div>
              <label className="input-label">Notes</label>
              <textarea
                rows={4}
                className="input-field !h-auto py-3"
                value={form.notes}
                onChange={(event) => updateField("notes", event.target.value)}
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
              Confirm booking
            </Button>
          </form>
        </section>

        <aside className="surface-card-static p-5 md:p-6 h-fit">
          <h2 className="section-title">Booking summary</h2>
          {provider ? (
            <>
              <div className="mt-4 flex items-center gap-3">
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-[color:var(--primary-100)] text-[color:var(--primary-500)] font-semibold text-lg">
                  {user?.name?.[0]?.toUpperCase() || "P"}
                </span>
                <div>
                  <p className="card-title">{user?.name}</p>
                  <p className="caption-text">{user?.city}</p>
                </div>
              </div>
              <p className="caption-text mt-3">
                Rating {profile?.ratingAverage?.toFixed(1) || "0.0"} (
                {profile?.totalReviews || 0} reviews)
              </p>
              {profile?.bio ? <p className="body-text mt-3">{profile.bio}</p> : null}

              {selectedCategory ? (
                <div className="mt-5 pt-4 border-t [border-color:var(--border)]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="caption-text">Category</span>
                    <span className="font-medium [color:var(--text)]">
                      {selectedCategory.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="caption-text">Base price</span>
                    <span className="font-semibold text-[color:var(--primary-500)]">
                      {formatCurrency(selectedCategory.basePrice)}
                    </span>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <p className="caption-text mt-3">Provider details unavailable.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
