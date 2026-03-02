import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useProviderStore from "../../stores/useProviderStore";
import useCategoryStore from "../../stores/useCategoryStore";
import { providersApi } from "../../api/providers";
import Spinner from "../../components/ui/Spinner";

export default function ProviderProfilePage() {
  const { myProfile, fetchMyProfile, isLoading } = useProviderStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [form, setForm] = useState({
    bio: "",
    experienceYears: "",
    categories: [],
    availabilityStatus: "available",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMyProfile();
    fetchCategories();
  }, [fetchMyProfile, fetchCategories]);

  useEffect(() => {
    if (myProfile) {
      setForm({
        bio: myProfile.bio || "",
        experienceYears: myProfile.experienceYears || "",
        categories: myProfile.categories?.map((c) => c._id || c) || [],
        availabilityStatus: myProfile.availabilityStatus || "available",
      });
    }
  }, [myProfile]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (catId) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter((c) => c !== catId)
        : [...prev.categories, catId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.categories.length === 0) {
      toast.error("Please select at least one service category");
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
      toast.success("Profile updated successfully");
      fetchMyProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && !myProfile) return <Spinner />;

  return (
    <div className="px-4 py-6 md:px-8 lg:px-10 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Profile Settings
        </h1>
        <p className="text-slate-500 mt-1">Manage your provider profile</p>
      </div>

      {/* Stats Bar */}
      {myProfile && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">
              {myProfile.ratingAverage?.toFixed(1) || "0.0"}
            </p>
            <p className="text-xs text-slate-500 mt-1">Rating</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">
              {myProfile.totalReviews || 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">Reviews</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">
              {myProfile.completedJobs || 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">Jobs Done</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5"
      >
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Bio
          </label>
          <textarea
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all"
            rows={4}
            placeholder="Tell customers about yourself and your expertise..."
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Years of Experience
          </label>
          <input
            type="number"
            min="0"
            max="50"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="e.g. 5"
            value={form.experienceYears}
            onChange={(e) => updateField("experienceYears", e.target.value)}
          />
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Availability
          </label>
          <div className="flex gap-3">
            {["available", "busy", "offline"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => updateField("availabilityStatus", status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                  form.availabilityStatus === status
                    ? status === "available"
                      ? "bg-emerald-600 text-white"
                      : status === "busy"
                        ? "bg-orange-500 text-white"
                        : "bg-slate-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Service Categories */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Service Categories
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Select the services you offer
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => toggleCategory(cat._id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  form.categories.includes(cat._id)
                    ? "bg-primary text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {categories.length === 0 && (
            <p className="text-sm text-slate-400 mt-2">
              No categories available
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
