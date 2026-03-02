import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import Spinner from "../components/ui/Spinner";

export default function ProtectedRoute() {
  const { user, token, isLoading, fetchMe } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (token && !user && !isLoading) {
      fetchMe();
    }
  }, [token, user, isLoading, fetchMe]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading || !user) {
    return <Spinner fullScreen />;
  }

  return <Outlet />;
}
