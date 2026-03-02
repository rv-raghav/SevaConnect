import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { ROLE_HOME } from "../utils/constants";

export default function RoleRoute({ allowedRoles }) {
  const { user } = useAuthStore();

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={ROLE_HOME[user?.role] || "/"} replace />;
  }

  return <Outlet />;
}
