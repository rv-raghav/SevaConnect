import useAuthStore from "../../stores/useAuthStore";

export default function ProfileSettingsPage() {
  const { user } = useAuthStore();

  const fields = [
    { label: "Full Name", value: user?.name, icon: "person" },
    { label: "Email Address", value: user?.email, icon: "mail" },
    { label: "City", value: user?.city, icon: "location_on" },
    {
      label: "Account Type",
      value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1),
      icon: "badge",
    },
  ];

  return (
    <div className="px-4 py-6 md:px-10 lg:px-20 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Profile Settings
        </h1>
        <p className="text-slate-500 mt-1">Your account information</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
          {user?.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center gap-4 px-6 py-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-slate-500 text-[20px]">
                {field.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {field.label}
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">
                {field.value || "-"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-4 text-center">
        Profile information is read-only. Contact support to make changes.
      </p>
    </div>
  );
}
