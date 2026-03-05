import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { adminApi } from "../../api/admin";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";

const TABS = [
  { label: "All", value: "", icon: "list" },
  { label: "Pending", value: "pending", icon: "pending" },
  { label: "Approved", value: "approved", icon: "check_circle" },
  { label: "Rejected", value: "rejected", icon: "cancel" },
];

const STATUS_STYLE = {
  pending: { color: "var(--warning-500)", background: "color-mix(in srgb, var(--warning-500) 12%, transparent)", border: "color-mix(in srgb, var(--warning-500) 24%, var(--border))" },
  approved: { color: "var(--success-500)", background: "color-mix(in srgb, var(--success-500) 12%, transparent)", border: "color-mix(in srgb, var(--success-500) 24%, var(--border))" },
  rejected: { color: "var(--error-500)", background: "color-mix(in srgb, var(--error-500) 12%, transparent)", border: "color-mix(in srgb, var(--error-500) 24%, var(--border))" },
};

const STATUS_ICON = { pending: "pending", approved: "check_circle", rejected: "cancel" };

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.38, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
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
    } catch { setProviders([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProviders(activeTab); }, [activeTab]);

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
          <Button variant="primary" size="sm" loading={actionLoading === provider._id} onClick={() => handleAction(provider._id, "approve")}>
            <span className="material-symbols-outlined text-[16px]">check</span>
            Approve
          </Button>
          <Button variant="outline" size="sm" onClick={() => setConfirmAction({ id: provider._id, action: "reject" })}>
            <span className="material-symbols-outlined text-[16px]">close</span>
            Reject
          </Button>
        </div>
      );
    }
    if (status === "rejected") {
      return (
        <Button variant="secondary" size="sm" loading={actionLoading === provider._id} onClick={() => handleAction(provider._id, "approve")}>
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Re-approve
        </Button>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: "var(--success-500)", background: "color-mix(in srgb, var(--success-500) 10%, transparent)" }}>
        <span className="material-symbols-outlined text-[14px]">check_circle</span>
        Active
      </span>
    );
  };

  return (
    <div className="page-shell">
      {/* Header + Tabs */}
      <Motion.section
        className="glass-card p-6 md:p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ cursor: "default" }}
        whileHover={{}}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}>
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div>
              <h1 className="font-bold" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", color: "var(--text)", letterSpacing: "-0.02em" }}>
                Provider approvals
              </h1>
              <p className="caption-text">Approve, reject, and monitor provider applications.</p>
            </div>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: "color-mix(in srgb, var(--primary-500) 10%, transparent)",
              color: "var(--primary-500)",
              border: "1px solid color-mix(in srgb, var(--primary-500) 20%, var(--border))",
            }}
          >
            {providers.length} providers
          </span>
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 -mb-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className="btn btn-sm shrink-0"
              style={{
                background: activeTab === tab.value ? "var(--primary-500)" : "color-mix(in srgb, var(--surface-soft) 90%, transparent)",
                color: activeTab === tab.value ? "white" : "var(--text-soft)",
                borderColor: activeTab === tab.value ? "color-mix(in srgb, var(--primary-500) 70%, black 30%)" : "var(--border)",
                fontWeight: 600,
                boxShadow: activeTab === tab.value ? "0 4px 16px color-mix(in srgb, var(--primary-500) 25%, transparent)" : "none",
              }}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </Motion.section>

      {/* Provider list */}
      <section className="mt-6">
        {loading ? (
          <Spinner />
        ) : providers.length > 0 ? (
          <>
            {/* Mobile cards */}
            <Motion.div
              className="space-y-3 md:hidden"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            >
              <AnimatePresence mode="popLayout">
                {providers.map((provider, i) => {
                  const user = provider.userId || provider;
                  const status = provider.approvalStatus || "pending";
                  const style = STATUS_STYLE[status] || STATUS_STYLE.pending;
                  return (
                    <Motion.article
                      key={provider._id}
                      className="glass-card p-4"
                      variants={fadeUp}
                      custom={i}
                      style={{ cursor: "default" }}
                      whileHover={{}}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-semibold text-base shrink-0"
                            style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}
                          >
                            {user?.name?.[0]?.toUpperCase() || "P"}
                          </div>
                          <div>
                            <p className="card-title">{user?.name || "Unknown"}</p>
                            <p className="caption-text">{user?.email}</p>
                            {user?.city && <p className="caption-text flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">location_on</span>{user.city}</p>}
                          </div>
                        </div>
                        <span
                          className="status-pill capitalize shrink-0"
                          style={{ color: style.color, background: style.background, borderColor: style.border }}
                        >
                          <span className="material-symbols-outlined text-[12px]">{STATUS_ICON[status]}</span>
                          {status}
                        </span>
                      </div>
                      <p className="caption-text mt-3 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px]">work</span>
                        {provider.experienceYears || 0} years experience
                      </p>
                      <div className="mt-3">{renderActionButtons(provider)}</div>
                    </Motion.article>
                  );
                })}
              </AnimatePresence>
            </Motion.div>

            {/* Desktop table */}
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
                      {["Provider", "City", "Experience", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((provider, i) => {
                      const user = provider.userId || provider;
                      const status = provider.approvalStatus || "pending";
                      const style = STATUS_STYLE[status] || STATUS_STYLE.pending;
                      return (
                        <tr key={provider._id} style={{ borderBottom: i < providers.length - 1 ? "1px solid var(--border)" : "none" }}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-semibold shrink-0"
                                style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}
                              >
                                {user?.name?.[0]?.toUpperCase() || "P"}
                              </div>
                              <div>
                                <p className="font-semibold" style={{ color: "var(--text)" }}>{user?.name || "—"}</p>
                                <p className="caption-text">{user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 caption-text">{user?.city || "—"}</td>
                          <td className="px-5 py-4 caption-text">{provider.experienceYears || 0} yrs</td>
                          <td className="px-5 py-4">
                            <span
                              className="status-pill capitalize"
                              style={{ color: style.color, background: style.background, borderColor: style.border }}
                            >
                              <span className="material-symbols-outlined text-[12px]">{STATUS_ICON[status]}</span>
                              {status}
                            </span>
                          </td>
                          <td className="px-5 py-4">{renderActionButtons(provider)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Motion.div>
          </>
        ) : (
          <EmptyState icon="group_off" title="No providers found" description="Provider applications will appear here." />
        )}
      </section>

      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => handleAction(confirmAction.id, confirmAction.action)}
        title="Reject provider?"
        message="This provider won't be visible to customers until approved again."
        confirmText="Reject"
      />
    </div>
  );
}
