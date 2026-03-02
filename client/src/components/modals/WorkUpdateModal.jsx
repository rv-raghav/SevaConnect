import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import { bookingsApi } from "../../api/bookings";

export default function WorkUpdateModal({
  isOpen,
  onClose,
  bookingId,
  type,
  onSuccess,
}) {
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    const oversized = selected.find((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      toast.error("Each file must be under 5MB");
      return;
    }
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("images", f));
      if (notes.trim()) formData.append("notes", notes.trim());
      await bookingsApi.addWorkUpdate(bookingId, formData, type);
      onSuccess();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to upload work update",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Upload ${type === "before" ? "Before" : "After"} Photos`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                type === "before"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {type === "before" ? "Before Work" : "After Work"}
            </span>
          </div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Photos (max 5)
          </label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary/40 transition-colors">
            <span className="material-symbols-outlined text-3xl text-slate-300 mb-2 block">
              cloud_upload
            </span>
            <p className="text-sm text-slate-500 mb-2">
              Drag & drop or click to select images
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              style={{ position: "relative" }}
            />
          </div>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {files.map((file, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    close
                  </span>
                </button>
                <p className="text-xs text-slate-500 truncate mt-1">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Notes (optional)
          </label>
          <textarea
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all"
            rows={3}
            placeholder="Add any notes about the work..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
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
            disabled={submitting || files.length === 0}
            className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Uploading..." : "Upload Photos"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
