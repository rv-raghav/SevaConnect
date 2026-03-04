import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "../../api/admin";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";

const TABS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_STYLE = {
  pending: {
    color: "var(--warning-500)",
    background: "color-mix(in srgb, var(--warning-500) 14%, transparent)",
    borderColor: "color-mix(in srgb, var(--warning-500) 26%, var(--border))",
  },
  approved: {
    color: "var(--success-500)",
    background: "color-mix(in srgb, var(--success-500) 14%, transparent)",
    borderColor: "color-mix(in srgb, var(--success-500) 26%, var(--border))",
  },
  rejected: {
    color: "var(--error-500)",
    background: "color-mix(in srgb, var(--error-500) 14%, transparent)",
    borderColor: "color-mix(in srgb, var(--error-500) 26%, var(--border))",
  },
};

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
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders(activeTab);
  }, [activeTab]);

  const handleAction = async (providerId, action) => {
    setActionLoading(providerId);
    try {
      if (action === "approve") await adminApi.approveProvider(providerId);
      else await adminApi.rejectProvider(providerId);
      toast.success(`Provider ${action}d`);
      loadProviders(activeTab);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} provider`);
    } finally {
      setActionLoading(null);
      setConfirmAction(null);
    }
  };

  const renderActionButtons = (provider) => {
    const status = provider.approvalStatus || "pending";
    if (status === "pending") {
      return (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            loading={actionLoading === provider._id}
            onClick={() => handleAction(provider._id, "approve")}
          >
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmAction({ id: provider._id, action: "reject" })}
          >
            Reject
          </Button>
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <Button
          variant="secondary"
          size="sm"
          loading={actionLoading === provider._id}
          onClick={() => handleAction(provider._id, "approve")}
        >
          Re-approve
        </Button>
      );
    }

    return <span className="caption-text">Active</span>;
  };

  return (
    <div className="page-shell">
      <section className="surface-card-static p-5 md:p-6">
        <h1 className="page-title !text-3xl">Provider approvals</h1>
        <p className="caption-text mt-1">
          Approve, reject, and monitor provider application status.
        </p>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        {loading ? (
          <Spinner />
        ) : providers.length > 0 ? (
          <>
            <div className="space-y-4 md:hidden">
              {providers.map((provider) => {
                const user = provider.userId || provider;
                const status = provider.approvalStatus || "pending";
                return (
                  <article key={provider._id} className="surface-card-static p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="card-title">{user?.name || "Unknown"}</p>
                        <p className="caption-text">{user?.email}</p>
                        <p className="caption-text mt-1">{user?.city || "-"}</p>
                      </div>
                      <span className="status-pill capitalize" style={STATUS_STYLE[status]}>
                        {status}
                      </span>
                    </div>
                    <p className="caption-text mt-3">
                      Experience: {provider.experienceYears || 0} years
                    </p>
                    <div className="mt-3">{renderActionButtons(provider)}</div>
                  </article>
                );
              })}
            </div>

            <div className="hidden md:block surface-card-static overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table-shell">
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>City</th>
                      <th>Experience</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((provider) => {
                      const user = provider.userId || provider;
                      const status = provider.approvalStatus || "pending";
                      return (
                        <tr key={provider._id}>
                          <td>
                            <p className="font-medium [color:var(--text)]">{user?.name || "-"}</p>
                            <p className="caption-text">{user?.email}</p>
                          </td>
                          <td>{user?.city || "-"}</td>
                          <td>{provider.experienceYears || 0} years</td>
                          <td>
                            <span className="status-pill capitalize" style={STATUS_STYLE[status]}>
                              {status}
                            </span>
                          </td>
                          <td>{renderActionButtons(provider)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            icon="group_off"
            title="No providers found"
            description="Provider applications will appear here."
          />
        )}
      </section>

      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => handleAction(confirmAction.id, confirmAction.action)}
        title="Reject provider?"
        message="This provider will not be visible to customers until approved again."
        confirmText="Reject"
      />
    </div>
  );
}
