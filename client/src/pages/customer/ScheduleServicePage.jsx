import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useCategoryStore from "../../stores/useCategoryStore";
import { providersApi } from "../../api/providers";
import { bookingsApi } from "../../api/bookings";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency } from "../../utils/formatters";
import { validateRequired, validateFutureDate } from "../../utils/validators";

export default function ScheduleServicePage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { categories, fetchCategories } = useCategoryStore();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    categoryId: "",
    address: "",
    city: "",
    date: "",
    time: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    const loadProvider = async () => {
      try {
        const { data } = await providersApi.getProviders();
        const found = data.data?.find(
          (p) => (p.userId?._id || p._id) === providerId,
        );
        if (found) setProvider(found);
      } catch {
        /* ignore */
      }
      setLoading(false);
    };
    loadProvider();
  }, [providerId, fetchCategories]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (validateRequired(form.categoryId, "Category"))
      e.categoryId = validateRequired(form.categoryId, "Category");
    if (validateRequired(form.address, "Address"))
      e.address = validateRequired(form.address, "Address");
    if (validateRequired(form.city, "City"))
      e.city = validateRequired(form.city, "City");
    if (validateRequired(form.date, "Date"))
      e.date = validateRequired(form.date, "Date");
    if (validateRequired(form.time, "Time"))
      e.time = validateRequired(form.time, "Time");
    if (form.date && form.time) {
      const dateErr = validateFutureDate(`${form.date}T${form.time}`);
      if (dateErr) e.date = dateErr;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const scheduledDateTime = new Date(
        `${form.date}T${form.time}`,
      ).toISOString();
      await bookingsApi.createBooking({
        providerId,
        categoryId: form.categoryId,
        address: form.address,
        city: form.city,
        scheduledDateTime,
        notes: form.notes || undefined,
      });
      toast.success("Booking created successfully!");
      navigate("/bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  const user = provider?.userId || provider;
  const profile = provider?.profile || provider;

  const selectedCat = categories.find((c) => c._id === form.categoryId);

  return (
    <div className="px-4 py-6 md:px-10 lg:px-20 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-primary mb-6 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        Back
      </button>

      <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
        Schedule a Service
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Service Category
            </label>
            <select
              className={`w-full h-12 px-4 rounded-xl border ${errors.categoryId ? "border-red-400" : "border-slate-200"} bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
            >
              <option value="">Select a service</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} - {formatCurrency(c.basePrice)}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Date
              </label>
              <input
                type="date"
                className={`w-full h-12 px-4 rounded-xl border ${errors.date ? "border-red-400" : "border-slate-200"} bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Time
              </label>
              <input
                type="time"
                className={`w-full h-12 px-4 rounded-xl border ${errors.time ? "border-red-400" : "border-slate-200"} bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
              />
              {errors.time && (
                <p className="text-red-500 text-xs mt-1">{errors.time}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Address
            </label>
            <input
              type="text"
              className={`w-full h-12 px-4 rounded-xl border ${errors.address ? "border-red-400" : "border-slate-200"} bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
              placeholder="Enter service address"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              City
            </label>
            <input
              type="text"
              className={`w-full h-12 px-4 rounded-xl border ${errors.city ? "border-red-400" : "border-slate-200"} bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
              placeholder="Enter city"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Notes (optional)
            </label>
            <textarea
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all"
              rows={3}
              placeholder="Any special instructions..."
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating Booking..." : "Confirm Booking"}
          </button>
        </form>

        {/* Provider Summary Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 h-fit">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
            Provider Details
          </h3>
          {provider ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{user?.name}</p>
                  <p className="text-sm text-slate-500">{user?.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-4">
                <span
                  className="material-symbols-outlined text-amber-400 text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="text-sm font-semibold">
                  {profile?.ratingAverage?.toFixed(1) || "0.0"}
                </span>
                <span className="text-sm text-slate-400">
                  ({profile?.totalReviews || 0})
                </span>
              </div>
              {profile?.bio && (
                <p className="text-sm text-slate-600 mb-4">{profile.bio}</p>
              )}
              {selectedCat && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Service</span>
                    <span className="font-medium text-slate-900">
                      {selectedCat.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Estimated Price</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(selectedCat.basePrice)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Provider not found</p>
          )}
        </div>
      </div>
    </div>
  );
}
