import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import { categoriesApi } from "../../api/categories";

export default function CategoryFormModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}) {
  const isEdit = !!category;
  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
    basePrice: category?.basePrice || "",
    icon: category?.icon || "",
  });
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    if (!form.basePrice || Number(form.basePrice) <= 0) {
      toast.error("Base price must be greater than 0");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        basePrice: Number(form.basePrice),
        icon: form.icon.trim() || undefined,
      };
      if (isEdit) {
        await categoriesApi.updateCategory(category._id, payload);
        toast.success("Category updated successfully");
      } else {
        await categoriesApi.createCategory(payload);
        toast.success("Category created successfully");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Category" : "New Category"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Name
          </label>
          <input
            type="text"
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="e.g. Plumbing"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all"
            rows={3}
            placeholder="Service description..."
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Base Price (INR)
          </label>
          <input
            type="number"
            min="0"
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="e.g. 500"
            value={form.basePrice}
            onChange={(e) => updateField("basePrice", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Icon (Material Symbol name)
          </label>
          <input
            type="text"
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            placeholder="e.g. plumbing"
            value={form.icon}
            onChange={(e) => updateField("icon", e.target.value)}
          />
          {form.icon && (
            <div className="mt-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                {form.icon}
              </span>
              <span className="text-xs text-slate-500">Preview</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
