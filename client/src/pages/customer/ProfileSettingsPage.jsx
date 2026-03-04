import useAuthStore from "../../stores/useAuthStore";

export default function ProfileSettingsPage() {
  const { user } = useAuthStore();

  const fields = [
    { label: "Full name", value: user?.name, icon: "person" },
    { label: "Email", value: user?.email, icon: "mail" },
    { label: "City", value: user?.city, icon: "location_on" },
    {
      label: "Role",
      value: user?.role ? `${user.role[0].toUpperCase()}${user.role.slice(1)}` : "-",
      icon: "badge",
    },
  ];

  return (
    <div className="page-shell max-w-3xl">
      <section className="surface-card-static p-5 md:p-6">
        <h1 className="page-title !text-3xl">Profile settings</h1>
        <p className="caption-text mt-1">Your account details are currently read-only.</p>

        <div className="mt-6 flex items-center gap-3">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-[color:var(--primary-100)] text-[color:var(--primary-500)] text-2xl font-semibold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </span>
          <div>
            <p className="card-title">{user?.name}</p>
            <p className="caption-text">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 divide-y [divide-color:var(--border)] border rounded-[16px] [border-color:var(--border)]">
          {fields.map((field) => (
            <div key={field.label} className="px-4 py-3 flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-[10px] bg-[color:var(--surface-soft)] text-[color:var(--text-muted)]">
                <span className="material-symbols-outlined text-[18px]">{field.icon}</span>
              </span>
              <div>
                <p className="caption-text uppercase tracking-wide">{field.label}</p>
                <p className="body-text">{field.value || "-"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
