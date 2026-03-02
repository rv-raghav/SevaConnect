import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../stores/useAuthStore";

export default function CustomerLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-colors ${isActive ? "text-primary" : "text-slate-600 hover:text-primary"}`;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 lg:px-10 py-3">
        <Link to="/home" className="flex items-center gap-3">
          <div className="size-8 text-primary">
            <svg
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
          </div>
          <h2 className="text-slate-900 text-xl font-bold tracking-tight">
            SevaConnect
          </h2>
        </Link>
        <nav className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-6">
            <NavLink to="/home" className={navLinkClass}>
              Find Services
            </NavLink>
            <NavLink to="/providers" className={navLinkClass}>
              Browse Pros
            </NavLink>
            <NavLink to="/bookings" className={navLinkClass}>
              My Bookings
            </NavLink>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-primary"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="hidden lg:inline">{user?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[22px]">
                logout
              </span>
            </button>
          </div>
        </nav>
        <button
          className="md:hidden text-slate-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="material-symbols-outlined">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </header>
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3">
          <NavLink
            to="/home"
            className="block text-sm font-semibold text-slate-700 hover:text-primary"
            onClick={() => setMobileOpen(false)}
          >
            Find Services
          </NavLink>
          <NavLink
            to="/providers"
            className="block text-sm font-semibold text-slate-700 hover:text-primary"
            onClick={() => setMobileOpen(false)}
          >
            Browse Pros
          </NavLink>
          <NavLink
            to="/bookings"
            className="block text-sm font-semibold text-slate-700 hover:text-primary"
            onClick={() => setMobileOpen(false)}
          >
            My Bookings
          </NavLink>
          <NavLink
            to="/profile"
            className="block text-sm font-semibold text-slate-700 hover:text-primary"
            onClick={() => setMobileOpen(false)}
          >
            Profile
          </NavLink>
          <button
            onClick={() => {
              handleLogout();
              setMobileOpen(false);
            }}
            className="block text-sm font-semibold text-red-500"
          >
            Logout
          </button>
        </div>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
