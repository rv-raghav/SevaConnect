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
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(ROLE_HOME[user.role] || "/home", { replace: true });
      }
    } catch {
      // Error handled by store
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-slate-900 text-3xl font-bold tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-base">
            Log in to manage your bookings and profile
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-slate-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">
                  mail
                </span>
              </div>
              <input
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? "border-red-400" : "border-slate-200"} bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none`}
                id="email"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-slate-700"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">
                  lock
                </span>
              </div>
              <input
                className={`w-full pl-10 pr-12 py-3 rounded-xl border ${errors.password ? "border-red-400" : "border-slate-200"} bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none`}
                id="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            className="font-bold text-primary hover:text-primary/80 transition-colors"
            to="/register"
          >
            Create account
          </Link>
        </p>
      </div>
      <div className="h-2 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
    </div>
  );
}
