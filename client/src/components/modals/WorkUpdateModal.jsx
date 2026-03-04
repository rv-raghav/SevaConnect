import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { bookingsApi } from "../../api/bookings";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

function toPreviewFiles(files) {
  return files.map((file) => ({
    file,
    preview: URL.createObjectURL(file),
    id: `${file.name}-${file.size}-${file.lastModified}`,
  }));
}

export default function WorkUpdateModal({
  isOpen,
  onClose,
  bookingId,
  type,
  onSuccess,
}) {
  const inputRef = useRef(null);
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [updateType, setUpdateType] = useState(type || "before");

  useEffect(() => {
    setUpdateType(type || "before");
  }, [type, isOpen]);

  useEffect(
    () => () => {
      files.forEach((item) => URL.revokeObjectURL(item.preview));
    },
    [files],
  );

  const addFiles = (selectedFiles) => {
    if (!selectedFiles.length) return;

    if (files.length + selectedFiles.length > 8) {
      toast.error("You can upload up to 8 images");
      return;
    }

    const oversize = selectedFiles.find((file) => file.size > 5 * 1024 * 1024);
    if (oversize) {
      toast.error("Each image must be under 5MB");
      return;
    }

    const next = toPreviewFiles(selectedFiles);
    setFiles((prev) => [...prev, ...next]);
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleFileInput = (event) => {
    const selected = Array.from(event.target.files || []);
    addFiles(selected);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const selected = Array.from(event.dataTransfer.files || []).filter((file) =>
      file.type.startsWith("image/"),
    );
    addFiles(selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (files.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      files.forEach((item) => formData.append("images", item.file));
      if (notes.trim()) formData.append("notes", notes.trim());
      await bookingsApi.addWorkUpdate(bookingId, formData, updateType);
      onSuccess?.();
      setNotes("");
      setFiles([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload work update");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload work updates" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="input-label">Update category</label>
          <div className="grid grid-cols-2 gap-2">
            {["before", "after"].map((option) => (
              <Button
                key={option}
                type="button"
                variant={updateType === option ? "primary" : "secondary"}
                size="md"
                onClick={() => setUpdateType(option)}
              >
                {option === "before" ? "Before work" : "After work"}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="input-label">Photos</label>
          <div
            className={`rounded-[16px] border-2 border-dashed p-6 text-center transition-colors ${
              dragOver
                ? "border-[color:var(--primary-500)] bg-[color:var(--primary-100)]"
                : "border-[color:var(--border)]"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <span className="material-symbols-outlined text-4xl [color:var(--primary-500)]">
              cloud_upload
            </span>
            <p className="body-text mt-2">Drag and drop images here</p>
            <p className="caption-text">PNG, JPG up to 5MB each (max 8 files)</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => inputRef.current?.click()}
            >
              Choose files
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        </div>

        {files.length > 0 ? (
          <div>
            <p className="input-label">Preview gallery</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {files.map((item) => (
                <div key={item.id} className="relative">
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="w-full aspect-square object-cover rounded-[12px] border [border-color:var(--border)]"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 btn btn-danger btn-sm !h-7 !px-2"
                    onClick={() => removeFile(item.id)}
                    aria-label={`Remove ${item.file.name}`}
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <label className="input-label">Notes (optional)</label>
          <textarea
            rows={3}
            className="input-field !h-auto py-3"
            placeholder="Add notes about work done"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={submitting}
            disabled={files.length === 0}
          >
            Upload update
          </Button>
        </div>
      </form>
    </Modal>
  );
}
