import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background-light text-slate-900 font-display antialiased">
      <Outlet />
    </div>
  );
}
