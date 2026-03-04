import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import BrandMark from "../components/shared/BrandMark";
import ThemeToggle from "../components/ui/ThemeToggle";
import Button from "../components/ui/Button";
import PageTransitionOutlet from "../components/ui/PageTransitionOutlet";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen app-bg lg:grid lg:grid-cols-[272px_1fr]">
      <aside
        className={`sidebar-shell fixed lg:sticky top-0 left-0 inset-y-0 z-50 w-[272px] transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-4 py-5 border-b [border-color:var(--border)] space-y-2">
            <BrandMark to="/admin" />
            <span className="chip flex items-center gap-1.5 w-fit">
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: "var(--error-500)" }} />
              Admin control center
            </span>
          </div>

          <nav className="p-3 flex-1 space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <span className="material-symbols-outlined text-[18px]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="px-3 pb-4 border-t [border-color:var(--border)] pt-3 space-y-2">
            <div className="px-2 py-2">
              <p className="card-title">{user?.name}</p>
              <p className="caption-text">Administrator</p>
            </div>
            <Button
              variant="danger"
              size="md"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        />
      ) : null}

      <div className="min-h-screen">
        <header className="navbar-shell lg:sticky">
          <div className="h-full px-4 md:px-6 flex items-center gap-2">
            <button
              className="btn btn-ghost btn-sm lg:hidden !px-2.5"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <p className="section-title text-base gradient-text font-semibold">Administration</p>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle compact />
            </div>
          </div>
        </header>
        <PageTransitionOutlet />
      </div>
    </div>
  );
}
