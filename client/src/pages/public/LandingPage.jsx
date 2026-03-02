import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCategoryStore from "../../stores/useCategoryStore";
import CategoryCard from "../../components/shared/CategoryCard";
import useAuthStore from "../../stores/useAuthStore";
import { ROLE_HOME } from "../../utils/constants";

export default function LandingPage() {
  const { categories, fetchCategories } = useCategoryStore();
  const { token, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 lg:px-10 py-3">
        <div className="flex items-center gap-3">
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
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-6">
            <a
              className="text-slate-600 hover:text-primary transition-colors text-sm font-semibold"
              href="#services"
            >
              Find Services
            </a>
            <a
              className="text-slate-600 hover:text-primary transition-colors text-sm font-semibold"
              href="#features"
            >
              How it Works
            </a>
          </div>
          <div className="flex items-center gap-3">
            {token ? (
              <button
                onClick={() => navigate(ROLE_HOME[user?.role] || "/home")}
                className="flex cursor-pointer items-center justify-center rounded-xl h-10 px-5 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold shadow-lg shadow-primary/20"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-900 hover:text-primary transition-colors text-sm font-bold"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex cursor-pointer items-center justify-center rounded-xl h-10 px-5 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold shadow-lg shadow-primary/20"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <div className="px-4 py-6 md:px-10 lg:px-40">
          <div className="rounded-3xl overflow-hidden relative min-h-[480px] flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-indigo-800">
            <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center gap-8 text-center">
              <div className="space-y-4">
                <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                  Expert help for your
                  <br />
                  <span className="text-blue-200">everyday needs</span>
                </h1>
                <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                  Connect with top-rated local professionals for home cleaning,
                  repairs, plumbing, and more.
                </p>
              </div>
              <Link
                to={token ? "/home" : "/register"}
                className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-white text-primary text-base font-bold shadow-xl hover:bg-slate-50 transition-colors"
              >
                Get Started
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Popular Services */}
        <section id="services" className="px-4 py-12 md:px-10 lg:px-40">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Popular Services
            </h2>
            <p className="text-slate-500 mt-2">
              Browse our most requested service categories
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                category={cat}
                onClick={() => navigate(token ? "/providers" : "/register")}
              />
            ))}
          </div>
        </section>

        {/* Why Choose SevaConnect */}
        <section
          id="features"
          className="px-4 py-16 md:px-10 lg:px-40 bg-white"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Why Choose SevaConnect?
            </h2>
            <p className="text-slate-500 mt-2">
              We make finding the right professional simple and safe
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "verified",
                title: "Verified Professionals",
                desc: "Every service provider is vetted and approved by our admin team before they can accept bookings.",
              },
              {
                icon: "schedule",
                title: "Easy Scheduling",
                desc: "Book services at your preferred date and time. Reschedule or cancel anytime with just a click.",
              },
              {
                icon: "star",
                title: "Trusted Reviews",
                desc: "Read genuine reviews from real customers to find the best professional for your needs.",
              },
            ].map((f) => (
              <div
                key={f.icon}
                className="text-center p-8 rounded-2xl bg-background-light"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-[28px]">
                    {f.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 px-4 md:px-10 lg:px-40 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-6 text-primary">
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
              <span className="text-white font-bold">SevaConnect</span>
            </div>
            <p className="text-sm">
              Connecting you with trusted local professionals.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">For Customers</h4>
            <ul className="space-y-2 text-sm">
              <li>Find Services</li>
              <li>How it Works</li>
              <li>Pricing</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">
              For Professionals
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Become a Pro</li>
              <li>Resources</li>
              <li>Success Stories</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
          &copy; 2025 SevaConnect Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
