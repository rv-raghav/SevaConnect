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
      // Error handled by store
    }
  };

  const inputClass = (field) =>
    `w-full h-12 px-4 rounded-xl border ${errors[field] ? "border-red-400" : "border-slate-200"} bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-base`;

  return (
    <div className="w-full max-w-[520px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 text-center">
        <h1 className="text-slate-900 tracking-tight text-[32px] font-bold leading-tight">
          Create your account
        </h1>
        <p className="text-slate-500 text-base font-normal leading-normal mt-2">
          Join SevaConnect to find trusted professionals or grow your business.
        </p>
      </div>

      {/* Role Toggle */}
      <div className="flex px-8 pb-6">
        <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-slate-100 p-1">
          <label
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all text-sm font-bold leading-normal ${
              form.role === "customer"
                ? "bg-white shadow-sm text-primary"
                : "text-slate-500"
            }`}
          >
            <span className="truncate mr-2">Customer</span>
            <input
              className="invisible w-0 absolute"
              name="role"
              type="radio"
              value="customer"
              checked={form.role === "customer"}
              onChange={() => updateField("role", "customer")}
            />
            <span className="material-symbols-outlined text-[18px]">
              person
            </span>
          </label>
          <label
            className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 transition-all text-sm font-bold leading-normal ${
              form.role === "provider"
                ? "bg-white shadow-sm text-primary"
                : "text-slate-500"
            }`}
          >
            <span className="truncate mr-2">Provider</span>
            <input
              className="invisible w-0 absolute"
              name="role"
              type="radio"
              value="provider"
              checked={form.role === "provider"}
              onChange={() => updateField("role", "provider")}
            />
            <span className="material-symbols-outlined text-[18px]">
              engineering
            </span>
          </label>
        </div>
      </div>

      {form.role === "provider" && (
        <div className="mx-8 mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
          <span className="material-symbols-outlined text-[16px] align-middle mr-1">
            info
          </span>
          Provider accounts require admin approval before accepting bookings.
        </div>
      )}

      {/* Form */}
      <form className="flex flex-col gap-5 px-8 pb-8" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-slate-900 text-sm font-medium"
            htmlFor="full_name"
          >
            Full Name
          </label>
          <div className="relative">
            <input
              className={inputClass("name")}
              id="full_name"
              placeholder="Enter your full name"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              badge
            </span>
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs font-medium">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-900 text-sm font-medium" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <input
              className={inputClass("email")}
              id="email"
              placeholder="name@example.com"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              mail
            </span>
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs font-medium">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-slate-900 text-sm font-medium"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className={inputClass("password")}
              id="password"
              placeholder="Create a secure password (min 6 chars)"
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              lock
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs font-medium">
              {errors.password}
            </p>
          )}
        </div>

        {/* City */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-900 text-sm font-medium" htmlFor="city">
            City
          </label>
          <div className="relative">
            <input
              className={inputClass("city")}
              id="city"
              placeholder="Enter your city"
              type="text"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              location_on
            </span>
          </div>
          {errors.city && (
            <p className="text-red-500 text-xs font-medium">{errors.city}</p>
          )}
        </div>

        {/* Submit */}
        <button
          className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 bg-primary text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-base font-bold disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <span>Create Account</span>
          )}
        </button>

        <p className="text-center text-slate-500 text-sm mt-2">
          Already have an account?{" "}
          <Link className="text-primary font-bold hover:underline" to="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
