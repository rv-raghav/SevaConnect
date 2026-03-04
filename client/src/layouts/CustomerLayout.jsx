import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import BrandMark from "../components/shared/BrandMark";
import ThemeToggle from "../components/ui/ThemeToggle";
import Button from "../components/ui/Button";
import PageTransitionOutlet from "../components/ui/PageTransitionOutlet";

const NAV_ITEMS = [
  { to: "/home", label: "Home" },
  { to: "/providers", label: "Providers" },
  { to: "/bookings", label: "Bookings" },
];

export default function CustomerLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen app-bg">
      <header className="navbar-shell">
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6 lg:px-8 flex items-center gap-4">
          <BrandMark to="/home" compact />

          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `btn btn-sm ${isActive ? "btn-secondary" : "btn-ghost"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle compact />

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="btn btn-ghost btn-sm !px-2.5"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full text-white text-sm font-semibold"
                  style={{ background: "var(--primary-gradient)" }}>
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="hidden lg:inline">{user?.name?.split(" ")[0]}</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </button>

              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-60 surface-card-static p-2 z-50 animate-fade-up">
                  <div className="px-3 py-2 border-b [border-color:var(--border)]">
                    <p className="card-title">{user?.name}</p>
                    <p className="caption-text">{user?.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="sidebar-link mt-2">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Profile settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="sidebar-link w-full text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>

            <button
              className="btn btn-ghost btn-sm md:hidden !px-2.5"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation"
            >
              <span className="material-symbols-outlined">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="md:hidden px-4 pb-3 border-t [border-color:var(--border)]">
            <div className="pt-3 grid gap-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `btn btn-md w-full justify-start ${isActive ? "btn-secondary" : "btn-ghost"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Button
                variant="outline"
                size="md"
                className="w-full justify-start"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/profile");
                }}
              >
                Profile settings
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
        ) : null}
      </header>

      <main>
        <PageTransitionOutlet />
      </main>
    </div>
  );
}
