import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "../../api/admin";
import Spinner from "../../components/ui/Spinner";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const loadProviders = async (status) => {
    setLoading(true);
    try {
      const params = {};
      if (status) params.status = status;
      const { data } = await adminApi.listProviders(params);
      setProviders(data.data || []);
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProviders(activeTab);
  }, [activeTab]);

  const handleAction = async (providerId, action) => {
    setActionLoading(providerId);
    try {
      if (action === "approve") await adminApi.approveProvider(providerId);
      else await adminApi.rejectProvider(providerId);
      toast.success(`Provider ${action}d successfully`);
      loadProviders(activeTab);
    } catch (err) {
      toast.error(
        err.response?.data?.message || `Failed to ${action} provider`,
      );
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-600 border-amber-200",
      approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
      rejected: "bg-red-50 text-red-600 border-red-200",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border capitalize ${styles[status] || "bg-slate-100 text-slate-600 border-slate-200"}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="px-4 py-6 md:px-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Provider Management
        </h1>
        <p className="text-slate-500 mt-1">
          Review and manage service provider applications
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? "bg-primary text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <Spinner />
      ) : providers.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providers.map((provider) => {
                  const user = provider.userId || provider;
                  return (
                    <tr
                      key={provider._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {user?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {user?.city || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {provider.experienceYears
                          ? `${provider.experienceYears} years`
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(provider.approvalStatus || "pending")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {(provider.approvalStatus === "pending" ||
                            !provider.approvalStatus) && (
                            <>
                              <button
                                onClick={() =>
                                  handleAction(provider._id, "approve")
                                }
                                disabled={actionLoading === provider._id}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  setConfirmAction({
                                    id: provider._id,
                                    action: "reject",
                                  })
                                }
                                disabled={actionLoading === provider._id}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {provider.approvalStatus === "approved" && (
                            <span className="text-xs text-emerald-600 font-semibold">
                              Active
                            </span>
                          )}
                          {provider.approvalStatus === "rejected" && (
                            <button
                              onClick={() =>
                                handleAction(provider._id, "approve")
                              }
                              disabled={actionLoading === provider._id}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary hover:bg-primary/90 text-white transition-colors disabled:opacity-50"
                            >
                              Re-approve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">
            group_off
          </span>
          <p className="text-lg font-semibold">No providers found</p>
          <p className="text-sm mt-1">Provider applications will appear here</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => handleAction(confirmAction.id, confirmAction.action)}
        title="Reject Provider?"
        message="Are you sure you want to reject this provider? They will not be able to receive bookings."
      />
    </div>
  );
}
