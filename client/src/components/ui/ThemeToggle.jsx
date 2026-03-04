import useTheme from "../../hooks/useTheme";

export default function ThemeToggle({ compact = false }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn btn-ghost ${compact ? "btn-sm" : "btn-md"}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="material-symbols-outlined text-[18px]">
        {isDark ? "light_mode" : "dark_mode"}
      </span>
      {!compact && <span>{isDark ? "Light" : "Dark"}</span>}
    </button>
  );
}
