import { useEffect, useState } from "react";
import useCategoryStore from "../../stores/useCategoryStore";
import CategoryFormModal from "../../components/modals/CategoryFormModal";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import { formatCurrency } from "../../utils/formatters";

export default function AdminCategoriesPage() {
  const { categories, fetchCategories, isLoading } = useCategoryStore();
  const [modal, setModal] = useState({ open: false, category: null });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSuccess = () => {
    setModal({ open: false, category: null });
    fetchCategories();
  };

  return (
    <div className="page-shell">
      <section className="surface-card-static p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="page-title !text-3xl">Service categories</h1>
            <p className="caption-text mt-1">
              Maintain marketplace categories and base prices.
            </p>
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
      </section>

      <section className="mt-6">
        {isLoading ? (
          <Spinner />
        ) : categories.length > 0 ? (
          <>
            <div className="space-y-4 md:hidden">
              {categories.map((category) => (
                <article key={category._id} className="surface-card-static p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="card-title">{category.name}</p>
                      <p className="caption-text mt-1">
                        {category.description || "No description"}
                      </p>
                      <p className="body-text mt-2">
                        {formatCurrency(category.basePrice)}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setModal({ open: true, category })}
                    >
                      Edit
                    </Button>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden md:block surface-card-static overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-shell">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Base price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category._id}>
                        <td>
                          <p className="font-medium [color:var(--text)]">{category.name}</p>
                        </td>
                        <td>{category.description || "-"}</td>
                        <td className="font-semibold [color:var(--text)]">
                          {formatCurrency(category.basePrice)}
                        </td>
                        <td>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setModal({ open: true, category })}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            icon="category"
            title="No categories yet"
            description="Create your first category to enable bookings."
          />
        )}
      </section>

      {modal.open ? (
        <CategoryFormModal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, category: null })}
          category={modal.category}
          onSuccess={handleSuccess}
        />
      ) : null}
    </div>
  );
}
