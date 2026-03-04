import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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
  { to: "/home", icon: "home", label: "Find Services" },
  { to: "/providers", icon: "groups", label: "Browse Pros" },
  { to: "/bookings", icon: "calendar_month", label: "My Bookings" },
];

export default function CustomerLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
          scrolled
            ? "shadow-sm border-b border-slate-100"
            : "border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center gap-6">
          <Link to="/home" className="flex items-center gap-2.5 shrink-0">
            <LogoIcon className="size-7 text-primary" />
            <span className="text-slate-900 text-lg font-black tracking-tight">
              Seva<span className="text-primary">Connect</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 flex-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-slate-600 hover:text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="hidden lg:inline text-slate-800 text-sm font-semibold">
                  {user?.name?.split(" ")[0]}
                </span>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">
                  expand_more
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-scale-in z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-slate-900 font-bold text-sm">{user?.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-400">person</span>
                    Profile Settings
                  </Link>
                  <Link
                    to="/bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-400">calendar_month</span>
                    My Bookings
                  </Link>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 text-sm font-medium w-full text-left transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="material-symbols-outlined">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-5 py-4 flex flex-col gap-1 animate-fade-in">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? "bg-primary/8 text-primary" : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              Profile
            </Link>
            <button
              onClick={() => { handleLogout(); setMobileOpen(false); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
