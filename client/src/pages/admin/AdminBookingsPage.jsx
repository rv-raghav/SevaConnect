import { useEffect, useState, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { adminApi } from "../../api/admin";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const TABS = [
  { label: "All",         value: "" },
  { label: "Requested",   value: "requested" },
  { label: "Confirmed",   value: "confirmed" },
  { label: "In progress", value: "in-progress" },
  { label: "Completed",   value: "completed" },
  { label: "Cancelled",   value: "cancelled" },
];

const STATUS_STYLE = {
  requested:   { bg: "linear-gradient(135deg,#64748b,#94a3b8)", icon: "pending_actions" },
  confirmed:   { bg: "linear-gradient(135deg,#3b82f6,#6366f1)", icon: "event_available" },
  "in-progress": { bg: "linear-gradient(135deg,#f59e0b,#d97706)", icon: "construction" },
  completed:   { bg: "linear-gradient(135deg,#10b981,#059669)", icon: "check_circle" },
  cancelled:   { bg: "linear-gradient(135deg,#ef4444,#dc2626)", icon: "cancel" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: i * 0.04, ease: [0.25,0.46,0.45,0.94] },
  }),
};

// ── Lightbox ──────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, images.length - 1));
      if (e.key === "ArrowLeft")  setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white"
        style={{ background: "rgba(255,255,255,0.12)" }}
      >
        <span className="material-symbols-outlined">close</span>
      </button>
      <img
        src={images[idx]?.url}
        alt={`Work image ${idx + 1}`}
        className="max-h-[80vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      {images.length > 1 && (
        <div className="flex items-center gap-4 mt-5" onClick={(e) => e.stopPropagation()}>
          <button
            disabled={idx === 0}
            onClick={() => setIdx((i) => i - 1)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-30"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="text-white text-sm font-medium">{idx + 1} / {images.length}</span>
          <button
            disabled={idx === images.length - 1}
            onClick={() => setIdx((i) => i + 1)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-30"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Image Strip ───────────────────────────────────────────
function ImageStrip({ label, images, onOpen }) {
  if (!images?.length) return null;
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</p>
      <div className="flex gap-2 flex-wrap">
        {images.map((img, i) => (
          <button
            key={img.publicId || i}
            type="button"
            onClick={() => onOpen(images, i)}
            className="relative group w-16 h-16 rounded-xl overflow-hidden shrink-0 border"
            style={{ borderColor: "var(--border)" }}
          >
            <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.45)" }}>
              <span className="material-symbols-outlined text-white text-[16px]">zoom_in</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────
export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [lightbox, setLightbox] = useState(null); // { images, idx }
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async (page = 1, status = "") => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (status) params.status = status;
      const { data } = await adminApi.getBookings(params);
      setBookings(data.data.bookings);
      setPagination({ page: data.data.page, pages: data.data.pages, total: data.data.total });
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(1, activeTab); }, [activeTab, load]);

  const handleTabChange = (val) => { setActiveTab(val); setPagination((p) => ({ ...p, page: 1 })); };
  const handlePage = (p) => { load(p, activeTab); setPagination((prev) => ({ ...prev, page: p })); };

  return (
    <div className="page-shell">
      {/* Header */}
      <Motion.section
        className="glass-card p-6 md:p-8"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
        style={{ cursor: "default" }}
        whileHover={{}}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, var(--primary-500), #6366f1)" }}
            >
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div>
              <h1 className="page-title">All Bookings</h1>
              <p className="caption-text">System-wide booking management and work image review.</p>
            </div>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full shrink-0"
            style={{
              background: "color-mix(in srgb, var(--primary-500) 10%, transparent)",
              color: "var(--primary-500)",
              border: "1px solid color-mix(in srgb, var(--primary-500) 20%, var(--border))",
            }}
          >
            {pagination.total} total
          </span>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 -mb-1">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleTabChange(t.value)}
              className="btn btn-sm shrink-0"
              style={{
                background: activeTab === t.value ? "var(--primary-500)" : "color-mix(in srgb, var(--surface-soft) 90%, transparent)",
                color: activeTab === t.value ? "white" : "var(--text-soft)",
                borderColor: activeTab === t.value ? "color-mix(in srgb, var(--primary-500) 70%, black 30%)" : "var(--border)",
                fontWeight: 600,
                boxShadow: activeTab === t.value ? "0 4px 16px color-mix(in srgb, var(--primary-500) 25%, transparent)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Motion.section>

      {/* List */}
      <section className="mt-6">
        {loading ? (
          <Spinner />
        ) : bookings.length === 0 ? (
          <EmptyState icon="event_busy" title="No bookings found" description="No bookings match the selected filter." />
        ) : (
          <>
            <Motion.div
              className="space-y-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              <AnimatePresence mode="popLayout">
                {bookings.map((b, i) => {
                  const st = STATUS_STYLE[b.status] || STATUS_STYLE.requested;
                  const isOpen = expanded === b._id;
                  const hasBefore = b.beforeImages?.length > 0;
                  const hasAfter  = b.afterImages?.length  > 0;

                  return (
                    <Motion.article
                      key={b._id}
                      variants={fadeUp}
                      custom={i}
                      layout
                      className="glass-card overflow-hidden"
                      style={{ cursor: "default" }}
                      whileHover={{}}
                    >
                      {/* Row */}
                      <button
                        type="button"
                        className="w-full text-left p-4 md:p-5 flex items-start gap-4"
                        onClick={() => setExpanded(isOpen ? null : b._id)}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5"
                          style={{ background: st.bg }}
                        >
                          <span className="material-symbols-outlined text-[18px]">{st.icon}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                              {b.customerId?.name || "—"}
                            </span>
                            <span className="caption-text">→</span>
                            <span className="text-sm" style={{ color: "var(--text-soft)" }}>
                              {b.providerId?.name || "—"}
                            </span>
                          </div>
                          <p className="caption-text mt-0.5">{b.categoryId?.name || "—"} · {formatDateTime(b.scheduledDateTime)}</p>
                          <p className="caption-text mt-0.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">location_on</span>
                            {b.city}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-bold text-sm" style={{ color: "var(--text)" }}>
                            {formatCurrency(b.priceSnapshot)}
                          </span>
                          <Badge status={b.status} />
                          {(hasBefore || hasAfter) && (
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: "color-mix(in srgb, var(--primary-500) 12%, transparent)", color: "var(--primary-500)" }}
                            >
                              📷 {(b.beforeImages?.length || 0) + (b.afterImages?.length || 0)} imgs
                            </span>
                          )}
                          <span className="material-symbols-outlined text-[18px]" style={{ color: "var(--text-muted)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}>
                            expand_more
                          </span>
                        </div>
                      </button>

                      {/* Expanded detail */}
                      <AnimatePresence>
                        {isOpen && (
                          <Motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28 }}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="px-4 md:px-5 pb-5 space-y-3 border-t" style={{ borderColor: "var(--border)" }}>
                              {/* Meta */}
                              <div className="pt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                <div>
                                  <p className="caption-text">Customer email</p>
                                  <p className="font-medium mt-0.5" style={{ color: "var(--text)" }}>{b.customerId?.email || "—"}</p>
                                </div>
                                <div>
                                  <p className="caption-text">Provider email</p>
                                  <p className="font-medium mt-0.5" style={{ color: "var(--text)" }}>{b.providerId?.email || "—"}</p>
                                </div>
                                <div>
                                  <p className="caption-text">Address</p>
                                  <p className="font-medium mt-0.5" style={{ color: "var(--text)" }}>{b.address || "—"}</p>
                                </div>
                                <div>
                                  <p className="caption-text">Notes</p>
                                  <p className="font-medium mt-0.5" style={{ color: "var(--text)" }}>{b.notes || "—"}</p>
                                </div>
                              </div>

                              {/* Work notes */}
                              {b.workNotes && (
                                <div className="p-3 rounded-xl text-sm" style={{ background: "color-mix(in srgb, var(--surface-soft) 70%, transparent)", border: "1px solid var(--border)" }}>
                                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Provider work notes</p>
                                  <p style={{ color: "var(--text)" }}>{b.workNotes}</p>
                                </div>
                              )}

                              {/* Before / After images */}
                              {(hasBefore || hasAfter) ? (
                                <div className="flex flex-wrap gap-6">
                                  <ImageStrip
                                    label="📸 Before images"
                                    images={b.beforeImages}
                                    onOpen={(imgs, idx) => setLightbox({ images: imgs, idx })}
                                  />
                                  <ImageStrip
                                    label="✅ After images"
                                    images={b.afterImages}
                                    onOpen={(imgs, idx) => setLightbox({ images: imgs, idx })}
                                  />
                                </div>
                              ) : (
                                <p className="text-xs" style={{ color: "var(--text-muted)" }}>No work images uploaded for this booking.</p>
                              )}
                            </div>
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </Motion.article>
                  );
                })}
              </AnimatePresence>
            </Motion.div>

            <Pagination
              page={pagination.page}
              pages={pagination.pages}
              total={pagination.total}
              onPageChange={handlePage}
            />
          </>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            images={lightbox.images}
            startIndex={lightbox.idx}
            onClose={() => setLightbox(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
