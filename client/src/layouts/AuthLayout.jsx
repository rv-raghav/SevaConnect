import { Outlet, Link } from "react-router-dom";

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

const TRUST_POINTS = [
  { icon: "verified_user", text: "Every professional is background verified" },
  { icon: "thumb_up", text: "4.8★ average rating from 12,000+ reviews" },
  { icon: "support_agent", text: "24/7 customer support whenever you need" },
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* ── LEFT PANEL (branding, desktop only) ─────────────────── */}
      <div className="hidden lg:flex flex-col w-[480px] shrink-0 relative overflow-hidden bg-primary">
        {/* Decorative circles */}
        <div
          aria-hidden
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10"
          style={{ background: "rgba(255,255,255,0.5)" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full opacity-10"
          style={{ background: "rgba(255,255,255,0.3)" }}
        />

        <div className="relative z-10 flex flex-col flex-1 p-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <LogoIcon className="size-10 text-white" />
            <span className="text-white text-2xl font-black tracking-tight">
              SevaConnect
            </span>
          </Link>

          {/* Hero copy */}
          <div className="flex-1 flex flex-col justify-center mt-16">
            <h2 className="text-white text-4xl font-black leading-tight tracking-tight mb-4">
              Your home,
              <br />
              in expert hands.
            </h2>
            <p className="text-blue-200 text-base font-medium leading-relaxed mb-12 max-w-sm">
              Join over 50,000 customers who trust SevaConnect for cleaning,
              plumbing, electrical, and more.
            </p>

            {/* Trust points */}
            <div className="space-y-4">
              {TRUST_POINTS.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-[18px]">
                      {p.icon}
                    </span>
                  </div>
                  <p className="text-blue-100 text-sm font-medium">{p.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
            <p className="text-blue-100 text-sm leading-relaxed italic mb-3">
              "The electrician was on time, professional and fixed the issue in
              20 minutes. SevaConnect is my go-to!"
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                R
              </div>
              <div>
                <p className="text-white text-xs font-bold">Rahul M.</p>
                <p className="text-blue-300 text-xs">Verified Customer</p>
              </div>
              <div className="ml-auto flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-amber-300 text-xs">
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center px-6 py-4 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <LogoIcon className="size-7 text-primary" />
            <span className="text-slate-900 font-black text-lg">
              Seva<span className="text-primary">Connect</span>
            </span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-50 lg:bg-white">
          <div className="w-full max-w-[480px]">
            <Outlet />
          </div>
        </main>

        <footer className="text-center text-xs text-slate-400 py-5 px-6">
          © 2025 SevaConnect Technologies Pvt. Ltd. · All rights reserved.
        </footer>
      </div>
    </div>
  );
}
