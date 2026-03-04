import { useState } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { ROLE_HOME } from "../../utils/constants";
import { validateEmail, validatePassword } from "../../utils/validators";

export default function LoginPage() {
  const { login, isLoading, error, clearError, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  if (token) {
    return <Navigate to={ROLE_HOME["customer"]} replace />;
  }

  const validate = () => {
    const newErrors = {};
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try {
      const user = await login(email, password);
      const from = location.state?.from?.pathname;
      navigate(from || ROLE_HOME[user.role] || "/home", { replace: true });
    } catch {
      // handled by store
    }
  };

  return (
    <div className="w-full animate-fade-in-up">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">
          Welcome back
        </h1>
        <p className="text-slate-500 text-base font-medium">
          Log in to manage your bookings and profile
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* API Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
            <span className="material-symbols-outlined text-red-500 text-[18px] mt-0.5 shrink-0">
              error
            </span>
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label
            className="block text-sm font-bold text-slate-700"
            htmlFor="email"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
              mail
            </span>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: "" }));
              }}
              className={`w-full h-12 pl-11 pr-4 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary ${
                errors.email ? "border-red-400 bg-red-50" : "border-slate-200"
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">
                error
              </span>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              className="block text-sm font-bold text-slate-700"
              htmlFor="password"
            >
              Password
            </label>
            <span className="text-xs text-primary font-semibold cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
              lock
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((p) => ({ ...p, password: "" }));
              }}
              className={`w-full h-12 pl-11 pr-12 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary ${
                errors.password
                  ? "border-red-400 bg-red-50"
                  : "border-slate-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">
                error
              </span>
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign In
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-slate-400 text-xs font-medium">
          or continue with
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Social (UI only — no functionality) */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "g_translate", label: "Google" },
          { icon: "public", label: "Apple" },
        ].map((s) => (
          <button
            key={s.label}
            type="button"
            className="flex items-center justify-center gap-2 h-11 border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {s.icon}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Sign up link */}
      <p className="mt-8 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-bold text-primary hover:underline">
          Create one free
        </Link>
      </p>
    </div>
  );
}
