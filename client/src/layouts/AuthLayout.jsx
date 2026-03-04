import { Link } from "react-router-dom";
import BrandMark from "../components/shared/BrandMark";
import PageTransitionOutlet from "../components/ui/PageTransitionOutlet";
import ThemeToggle from "../components/ui/ThemeToggle";

const TRUST_POINTS = [
  "Verified professionals for every home service",
  "Simple booking and transparent pricing",
  "Real-time updates and 24/7 support",
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen app-bg lg:grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="hidden lg:flex flex-col justify-between px-12 py-10 bg-[color:var(--surface)] border-r [border-color:var(--border)]">
        <div className="flex items-center justify-between">
          <BrandMark />
          <ThemeToggle compact />
        </div>

        <div className="space-y-8 max-w-md">
          <div className="space-y-4">
            <p className="chip w-fit">SevaConnect for customers and pros</p>
            <h1 className="page-title">
              A calmer way to book trusted local services.
            </h1>
            <p className="body-text">
              Sign in to manage bookings, track progress, and communicate with
              professionals from one place.
            </p>
          </div>

          <div className="space-y-3">
            {TRUST_POINTS.map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-[color:var(--success-500)] mt-0.5">
                  check_circle
                </span>
                <span className="body-text">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="caption-text">
          Secure access for customers, service providers, and administrators.
        </p>
      </aside>

      <section className="flex min-h-screen flex-col">
        <header className="navbar-shell lg:hidden">
          <div className="h-full px-4 flex items-center justify-between">
            <BrandMark compact />
            <ThemeToggle compact />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
          <div className="surface-card-static w-full max-w-xl p-6 sm:p-8 animate-fade-up">
            <PageTransitionOutlet />
          </div>
        </main>

        <footer className="px-4 pb-5 text-center caption-text">
          <Link to="/" className="hover:underline">
            Back to home
          </Link>
        </footer>
      </section>
    </div>
  );
}
