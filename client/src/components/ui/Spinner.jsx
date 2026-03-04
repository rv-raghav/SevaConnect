export default function Spinner({ fullScreen = false }) {
  const wrapperClass = fullScreen
    ? "min-h-screen flex flex-col items-center justify-center gap-3 app-bg"
    : "flex flex-col items-center justify-center py-12 gap-3";

  if (fullScreen) {
    return (
      <div className={wrapperClass}>
        <div className="size-11 rounded-full border-[3px] border-[color:var(--border)] border-t-[color:var(--primary-500)] spin" />
        <p className="caption-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <div className="size-10 rounded-full border-[3px] border-[color:var(--border)] border-t-[color:var(--primary-500)] spin" />
      <p className="caption-text">Loading...</p>
    </div>
  );
}
