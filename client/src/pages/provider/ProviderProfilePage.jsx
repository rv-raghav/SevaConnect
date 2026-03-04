import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useProviderStore from "../../stores/useProviderStore";
import useCategoryStore from "../../stores/useCategoryStore";
import { providersApi } from "../../api/providers";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function ProviderProfilePage() {
  const { myProfile, fetchMyProfile, isLoading } = useProviderStore();
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

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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

  return (
    <div className="page-shell max-w-4xl">
      <section className="surface-card-static p-5 md:p-6">
        <h1 className="page-title !text-3xl">Provider profile</h1>
        <p className="caption-text mt-1">
          Keep your profile accurate so customers can book with confidence.
        </p>

        {myProfile ? (
          <div className="mt-5 grid sm:grid-cols-3 gap-3">
            <div className="surface-card-static p-4">
              <p className="text-2xl font-semibold [color:var(--text)]">
                {myProfile.ratingAverage?.toFixed(1) || "0.0"}
              </p>
              <p className="caption-text">Average rating</p>
            </div>
            <div className="surface-card-static p-4">
              <p className="text-2xl font-semibold [color:var(--text)]">
                {myProfile.totalReviews || 0}
              </p>
              <p className="caption-text">Total reviews</p>
            </div>
            <div className="surface-card-static p-4">
              <p className="text-2xl font-semibold [color:var(--text)]">
                {myProfile.completedJobs || 0}
              </p>
              <p className="caption-text">Jobs completed</p>
            </div>
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="input-label">Bio</label>
            <textarea
              rows={4}
              className="input-field !h-auto py-3"
              placeholder="Describe your experience and specialization"
              value={form.bio}
              onChange={(event) => setField("bio", event.target.value)}
            />
          </div>

          <div>
            <label className="input-label">Years of experience</label>
            <input
              type="number"
              min="0"
              max="50"
              className="input-field"
              value={form.experienceYears}
              onChange={(event) => setField("experienceYears", event.target.value)}
            />
          </div>

          <div>
            <label className="input-label">Availability</label>
            <div className="flex flex-wrap gap-2">
              {["available", "busy", "offline"].map((status) => (
                <Button
                  key={status}
                  variant={form.availabilityStatus === status ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setField("availabilityStatus", status)}
                  type="button"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="input-label">Service categories</label>
            <p className="caption-text mb-2">Select all services you provide.</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category._id}
                  type="button"
                  size="sm"
                  variant={form.categories.includes(category._id) ? "primary" : "secondary"}
                  onClick={() => toggleCategory(category._id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={saving}>
            Save profile
          </Button>
        </form>
      </section>
    </div>
  );
}
