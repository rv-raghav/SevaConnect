import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../stores/useAuthStore";

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
      isActive ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
    }`;

  const navItems = [
    { to: "/admin", icon: "dashboard", label: "Dashboard", end: true },
    { to: "/admin/providers", icon: "groups", label: "Providers" },
    { to: "/admin/categories", icon: "category", label: "Categories" },
    { to: "/admin/reviews", icon: "reviews", label: "Reviews" },
    { to: "/admin/analytics", icon: "analytics", label: "Analytics" },
  ];

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[20px]">
              admin_panel_settings
            </span>
          </div>
          <div>
            <h2 className="text-slate-900 text-lg font-bold tracking-tight">
              SevaConnect
            </h2>
            <p className="text-xs text-slate-500 font-medium">Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined text-[20px]">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-500"
            title="Logout"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-light font-display">
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-700"
        >
          <span className="material-symbols-outlined">
            {sidebarOpen ? "close" : "menu"}
          </span>
        </button>
        <h2 className="text-lg font-bold text-slate-900">Admin Panel</h2>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-500"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebar}
      </aside>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <main className="lg:ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
