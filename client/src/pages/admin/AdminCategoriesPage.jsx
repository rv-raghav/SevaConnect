import { useEffect, useState } from "react";
import useCategoryStore from "../../stores/useCategoryStore";
import CategoryFormModal from "../../components/modals/CategoryFormModal";
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
    <div className="px-4 py-6 md:px-8 lg:px-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Service Categories
          </h1>
          <p className="text-slate-500 mt-1">
            Manage available service categories
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true, category: null })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Category
        </button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : categories.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Base Price
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-[20px]">
                            {cat.icon || "category"}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">
                          {cat.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {cat.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {formatCurrency(cat.basePrice)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setModal({ open: true, category: cat })}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">
            category
          </span>
          <p className="text-lg font-semibold">No categories yet</p>
          <p className="text-sm mt-1">Create your first service category</p>
        </div>
      )}

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
