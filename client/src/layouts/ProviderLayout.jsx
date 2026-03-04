import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../stores/useAuthStore";
import BrandMark from "../components/shared/BrandMark";
import ThemeToggle from "../components/ui/ThemeToggle";
import Button from "../components/ui/Button";
import PageTransitionOutlet from "../components/ui/PageTransitionOutlet";

const NAV_ITEMS = [
  { to: "/provider/dashboard", icon: "dashboard", label: "Dashboard" },
  { to: "/provider/bookings", icon: "calendar_month", label: "Bookings" },
  { to: "/provider/profile", icon: "person", label: "Profile" },
];

export default function ProviderLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen app-bg lg:grid lg:grid-cols-[260px_1fr]">
      <aside
        className={`sidebar-shell fixed lg:sticky top-0 left-0 inset-y-0 z-50 w-64 transform transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-4 py-5 border-b [border-color:var(--border)]">
            <BrandMark to="/provider/dashboard" />
            <p className="caption-text mt-2">Provider workspace</p>
          </div>

          <nav className="p-3 flex-1 space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
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

          <div className="px-3 pb-4 space-y-2 border-t [border-color:var(--border)] pt-3">
            <div className="px-2 py-2">
              <p className="card-title">{user?.name}</p>
              <p className="caption-text">{user?.email}</p>
            </div>
            <Button
              variant="secondary"
              size="md"
              className="w-full justify-start"
              onClick={() => navigate("/provider/profile")}
            >
              Edit profile
            </Button>
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
            <p className="section-title text-base">Provider Portal</p>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle compact />
              <span className="chip hidden sm:inline-flex">
                {user?.name?.split(" ")[0]}
              </span>
            </div>
          </div>
        </header>
        <PageTransitionOutlet />
      </div>
    </div>
  );
}
