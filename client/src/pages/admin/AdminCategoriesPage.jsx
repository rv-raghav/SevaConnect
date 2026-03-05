import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import useCategoryStore from "../../stores/useCategoryStore";
import CategoryFormModal from "../../components/modals/CategoryFormModal";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency } from "../../utils/formatters";

const CATEGORY_IMAGES = {
  Cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=60&h=60&fit=crop",
  Plumbing: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=60&h=60&fit=crop",
  Electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop",
  Painting: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=60&h=60&fit=crop",
  Carpentry: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=60&h=60&fit=crop",
  Gardening: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=60&h=60&fit=crop",
};
const DEFAULT_CAT_IMG = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=60&h=60&fit=crop";

const GRADIENTS = [
  "linear-gradient(135deg, var(--primary-500), #6366f1)",
  "linear-gradient(135deg, #8b5cf6, #a855f7)",
  "linear-gradient(135deg, #10b981, #059669)",
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #ec4899, #f43f5e)",
  "linear-gradient(135deg, #3b82f6, #06b6d4)",
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.38, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function AdminCategoriesPage() {
  const { categories, fetchCategories, isLoading } = useCategoryStore();
  const [modal, setModal] = useState({ open: false, category: null });

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleSuccess = () => {
    setModal({ open: false, category: null });
    fetchCategories();
  };

  return (
    <div className="page-shell">
      {/* Header */}
      <Motion.section
        className="glass-card p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ cursor: "default" }}
        whileHover={{}}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, var(--primary-500), #6366f1)" }}>
              <span className="material-symbols-outlined text-[22px]">category</span>
            </div>
            <div>
              <h1 className="font-bold" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", color: "var(--text)", letterSpacing: "-0.02em" }}>
                Service categories
              </h1>
              <p className="caption-text">Maintain marketplace categories and base prices.</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setModal({ open: true, category: null })}
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add category
          </Button>
        </div>
      </Motion.section>

      {/* Categories */}
      <section className="mt-6">
        {isLoading ? (
          <Spinner />
        ) : categories.length > 0 ? (
          <>
            {/* Mobile cards */}
            <Motion.div
              className="space-y-3 md:hidden"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            >
              {categories.map((category, i) => (
                <Motion.article
                  key={category._id}
                  className="glass-card p-4 flex items-center gap-4"
                  variants={fadeUp}
                  custom={i}
                  style={{ cursor: "default" }}
                  whileHover={{}}
                >
                  <div
                    className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center"
                    style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                  >
                    <img
                      src={CATEGORY_IMAGES[category.name] || DEFAULT_CAT_IMG}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="card-title truncate">{category.name}</p>
                    <p className="caption-text mt-0.5 truncate">
                      {category.description || "No description"}
                    </p>
                    <p className="text-sm font-bold mt-1" style={{ color: "var(--primary-500)" }}>
                      {formatCurrency(category.basePrice)}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setModal({ open: true, category })}
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </Button>
                </Motion.article>
              ))}
            </Motion.div>

            {/* Desktop table as elegant cards */}
            <Motion.div
              className="hidden md:block glass-card overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ cursor: "default" }}
              whileHover={{}}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)", background: "color-mix(in srgb, var(--surface-soft) 60%, transparent)" }}>
                      <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>Category</th>
                      <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>Description</th>
                      <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>Base price</th>
                      <th className="text-left px-5 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, i) => (
                      <tr
                        key={category._id}
                        style={{ borderBottom: i < categories.length - 1 ? "1px solid var(--border)" : "none" }}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl overflow-hidden shrink-0"
                              style={{ background: GRADIENTS[i % GRADIENTS.length] }}
                            >
                              <img
                                src={CATEGORY_IMAGES[category.name] || DEFAULT_CAT_IMG}
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="font-semibold" style={{ color: "var(--text)" }}>{category.name}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 caption-text max-w-xs">
                          <p className="truncate">{category.description || "—"}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold" style={{ color: "var(--primary-500)" }}>
                            {formatCurrency(category.basePrice)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setModal({ open: true, category })}
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Motion.div>
          </>
        ) : (
          <EmptyState
            icon="category"
            title="No categories yet"
            description="Create your first category to enable bookings."
            action={
              <Button variant="primary" size="md" onClick={() => setModal({ open: true, category: null })}>
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add category
              </Button>
            }
          />
        )}
      </section>

      {modal.open && (
        <CategoryFormModal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, category: null })}
          category={modal.category}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
