import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { ROLE_HOME } from "../../utils/constants";
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "../../utils/validators";
import Button from "../../components/ui/Button";

export default function RegisterPage() {
  const { register, isLoading, error, clearError, token } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    role: "customer",
  });

  if (token) return <Navigate to={ROLE_HOME.customer} replace />;

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next = {};
    const nameError = validateRequired(form.name, "Full name");
    const cityError = validateRequired(form.city, "City");
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    if (nameError) next.name = nameError;
    if (cityError) next.city = cityError;
    if (emailError) next.email = emailError;
    if (passwordError) next.password = passwordError;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearError();
    if (!validate()) return;
    try {
      const user = await register(form);
      navigate(ROLE_HOME[user.role] || "/home", { replace: true });
    } catch {
      // handled by store
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="page-title !text-3xl">Create <span className="gradient-text">account</span></h1>
        <p className="body-text mt-2">
          Join SevaConnect as a customer or service provider.
        </p>
      </div>

      <div className="p-1 rounded-[14px] border [border-color:var(--border)] bg-[color:var(--surface-soft)] mb-5 grid grid-cols-2 gap-1">
        {[
          { value: "customer", label: "Customer" },
          { value: "provider", label: "Provider" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setField("role", item.value)}
            className={`h-10 rounded-[10px] text-sm font-semibold transition-all ${
              form.role === item.value
                ? "text-white shadow-sm"
                : "[color:var(--text-muted)]"
            }`}
            style={form.role === item.value ? { background: "var(--primary-gradient)" } : {}}
          >
            {item.label}
          </button>
        ))}
      </div>

      {form.role === "provider" ? (
        <div
          className="rounded-[14px] border px-3 py-2 text-sm mb-4"
          style={{
            color: "var(--warning-500)",
            borderColor:
              "color-mix(in srgb, var(--warning-500) 35%, var(--border))",
            background:
              "color-mix(in srgb, var(--warning-500) 10%, transparent)",
          }}
        >
          Provider accounts require admin approval before accepting bookings.
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? (
          <div
            className="rounded-[14px] border px-3 py-2 text-sm"
            style={{
              color: "var(--error-500)",
              borderColor: "color-mix(in srgb, var(--error-500) 35%, var(--border))",
              background:
                "color-mix(in srgb, var(--error-500) 12%, transparent)",
            }}
          >
            {error}
          </div>
        ) : null}

        <div>
          <label className="input-label" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            className={`input-field ${errors.name ? "is-error" : ""}`}
            placeholder="Enter your full name"
          />
          {errors.name ? <p className="input-error">{errors.name}</p> : null}
        </div>

        <div>
          <label className="input-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            className={`input-field ${errors.email ? "is-error" : ""}`}
            placeholder="name@example.com"
          />
          {errors.email ? <p className="input-error">{errors.email}</p> : null}
        </div>

        <div>
          <label className="input-label" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => setField("password", event.target.value)}
              className={`input-field pr-10 ${errors.password ? "is-error" : ""}`}
              placeholder="Minimum 6 characters"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm !px-2"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>
          {errors.password ? <p className="input-error">{errors.password}</p> : null}
        </div>

        <div>
          <label className="input-label" htmlFor="city">
            City
          </label>
          <input
            id="city"
            value={form.city}
            onChange={(event) => setField("city", event.target.value)}
            className={`input-field ${errors.city ? "is-error" : ""}`}
            placeholder="Enter your city"
          />
          {errors.city ? <p className="input-error">{errors.city}</p> : null}
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" loading={isLoading}>
          Create account
        </Button>
      </form>

      <p className="body-text text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-[color:var(--primary-500)] font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
