import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { ROLE_HOME } from "../../utils/constants";
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "../../utils/validators";

export default function RegisterPage() {
  const { register, isLoading, error, clearError, token } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    role: "customer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  if (token) {
    return <Navigate to={ROLE_HOME["customer"]} replace />;
  }

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const nameErr = validateRequired(form.name, "Full name");
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    const cityErr = validateRequired(form.city, "City");
    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (cityErr) newErrors.city = cityErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    try {
      const user = await register(form);
      navigate(ROLE_HOME[user.role] || "/home", { replace: true });
    } catch {
      // handled by store
    }
  };
  const fieldClass = (field) =>
    `w-full h-12 pl-11 pr-4 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary ${
      errors[field] ? "border-red-400 bg-red-50" : "border-slate-200"
    }`;

  return (
    <div className="w-full animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">
          Create your account
        </h1>
        <p className="text-slate-500 text-base font-medium">
          Join SevaConnect to book trusted professionals or grow your business
        </p>
      </div>

      <div className="flex h-12 items-center rounded-xl bg-slate-100 p-1 mb-6">
        {[
          { value: "customer", icon: "person", label: "I need help" },
          { value: "provider", icon: "engineering", label: "I provide services" },
        ].map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer h-full flex-1 items-center justify-center gap-2 rounded-lg px-3 transition-all text-sm font-bold select-none ${
              form.role === opt.value
                ? "bg-white shadow-sm text-primary"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {opt.icon}
            </span>
            {opt.label}
            <input
              className="sr-only"
              type="radio"
              name="role"
              value={opt.value}
              checked={form.role === opt.value}
              onChange={() => updateField("role", opt.value)}
            />
          </label>
        ))}
      </div>

      {form.role === "provider" && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 mb-5">
          <span className="material-symbols-outlined text-amber-500 text-[18px] mt-0.5 shrink-0">
            info
          </span>
          <p className="text-amber-700 text-sm font-medium">
            Provider accounts require admin approval before accepting bookings.
            We review applications within 24 hours.
          </p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
            <span className="material-symbols-outlined text-red-500 text-[18px] mt-0.5 shrink-0">
              error
            </span>
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-700" htmlFor="full_name">
            Full Name
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
              badge
            </span>
            <input
              id="full_name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={fieldClass("name")}
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs font-semibold">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-700" htmlFor="email">
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
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={fieldClass("email")}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs font-semibold">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-700" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
              lock
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className={`${fieldClass("password")} pr-12`}
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
            <p className="text-red-500 text-xs font-semibold">{errors.password}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-700" htmlFor="city">
            City
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
              location_on
            </span>
            <input
              id="city"
              type="text"
              placeholder="Enter your city"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              className={fieldClass("city")}
            />
          </div>
          {errors.city && (
            <p className="text-red-500 text-xs font-semibold">{errors.city}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Create Account
              <span className="material-symbols-outlined text-[18px]">check</span>
            </>
          )}
        </button>

        <p className="text-center text-slate-400 text-xs pt-1">
          By creating an account, you agree to our{" "}
          <span className="text-primary cursor-pointer hover:underline font-medium">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-primary cursor-pointer hover:underline font-medium">
            Privacy Policy
          </span>
        </p>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
