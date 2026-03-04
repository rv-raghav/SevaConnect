import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { ROLE_HOME } from "../../utils/constants";
import { validateEmail, validatePassword } from "../../utils/validators";
import Button from "../../components/ui/Button";

export default function LoginPage() {
  const { login, isLoading, error, clearError, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  if (token) return <Navigate to={ROLE_HOME.customer} replace />;

  const validate = () => {
    const next = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
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
      const user = await login(email, password);
      const from = location.state?.from?.pathname;
      navigate(from || ROLE_HOME[user.role] || "/home", { replace: true });
    } catch {
      // handled by store
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="page-title !text-3xl">Welcome <span className="gradient-text">back</span></h1>
        <p className="body-text mt-2">Sign in to manage bookings and profile settings.</p>
      </div>

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
          <label className="input-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            className={`input-field ${errors.email ? "is-error" : ""}`}
            placeholder="name@example.com"
          />
          {errors.email ? <p className="input-error">{errors.email}</p> : null}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="input-label !mb-0" htmlFor="password">
              Password
            </label>
            <button type="button" className="caption-text hover:underline">
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
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

        <Button type="submit" variant="primary" size="lg" className="w-full" loading={isLoading}>
          Sign in
        </Button>
      </form>

      <p className="body-text text-center mt-6">
        New to SevaConnect?{" "}
        <Link to="/register" className="text-[color:var(--primary-500)] font-semibold hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
