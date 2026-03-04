import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../stores/useAuthStore";

function LogoIcon({ className = "size-8" }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

const NAV_ITEMS = [
  { to: "/admin", icon: "dashboard", label: "Dashboard", end: true },
  { to: "/admin/providers", icon: "groups", label: "Providers" },
  { to: "/admin/categories", icon: "category", label: "Categories" },
  { to: "/admin/reviews", icon: "reviews", label: "Reviews" },
  { to: "/admin/analytics", icon: "analytics", label: "Analytics" },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? "bg-primary/10 text-primary border-l-[3px] border-primary pl-[calc(0.75rem-3px)]"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-[3px] border-transparent pl-[calc(0.75rem-3px)]"
    }`;

  const sidebar = (
    <div className="flex flex-col h-full bg-white">
      {/* Brand */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[20px]">
              admin_panel_settings
            </span>
          </div>
          <div>
            <h2 className="text-slate-900 text-base font-black tracking-tight">
              SevaConnect
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[10px]">
                shield
              </span>
              ADMIN PANEL
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
          Management
        </p>
        {NAV_ITEMS.map((item) => (
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

      {/* Platform status */}
      <div className="px-4 pb-4">
        <div className="bg-emerald-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <p className="text-emerald-700 text-xs font-bold">
              All Systems Operational
            </p>
          </div>
          <p className="text-emerald-600 text-xs">
            Platform is running normally
          </p>
        </div>
      </div>

      {/* User footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-light">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 sticky top-0 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined">
            {sidebarOpen ? "close" : "menu"}
          </span>
        </button>
        <span className="text-slate-900 font-black text-base">Admin Panel</span>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shadow-xl lg:shadow-none border-r border-slate-100 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
