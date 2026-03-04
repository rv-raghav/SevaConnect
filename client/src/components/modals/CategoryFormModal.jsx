import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
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
          <label className="input-label">Name</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Plumbing"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>
        <div>
          <label className="input-label">Description</label>
          <textarea
            className="input-field !h-auto py-3"
            rows={3}
            placeholder="Service description..."
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>
        <div>
          <label className="input-label">Base price (INR)</label>
          <input
            type="number"
            min="0"
            className="input-field"
            placeholder="e.g. 500"
            value={form.basePrice}
            onChange={(e) => updateField("basePrice", e.target.value)}
          />
        </div>
        <div>
          <label className="input-label">Icon (Material symbol)</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. plumbing"
            value={form.icon}
            onChange={(e) => updateField("icon", e.target.value)}
          />
          {form.icon && (
            <div className="mt-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[color:var(--primary-500)]">
                {form.icon}
              </span>
              <span className="caption-text">Preview</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" size="md" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" className="flex-1" loading={saving}>
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
