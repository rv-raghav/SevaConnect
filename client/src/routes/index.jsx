import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import ProviderLayout from "../layouts/ProviderLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import Spinner from "../components/ui/Spinner";

const LandingPage = lazy(() => import("../pages/public/LandingPage"));
const LoginPage = lazy(() => import("../pages/public/LoginPage"));
const RegisterPage = lazy(() => import("../pages/public/RegisterPage"));

const CustomerHomePage = lazy(
  () => import("../pages/customer/CustomerHomePage"),
);
const ProviderListingsPage = lazy(
  () => import("../pages/customer/ProviderListingsPage"),
);
const ScheduleServicePage = lazy(
  () => import("../pages/customer/ScheduleServicePage"),
);
const CustomerBookingsPage = lazy(
  () => import("../pages/customer/CustomerBookingsPage"),
);
const ProfileSettingsPage = lazy(
  () => import("../pages/customer/ProfileSettingsPage"),
);

const ProviderDashboardPage = lazy(
  () => import("../pages/provider/ProviderDashboardPage"),
);
const ProviderBookingsPage = lazy(
  () => import("../pages/provider/ProviderBookingsPage"),
);
const ProviderProfilePage = lazy(
  () => import("../pages/provider/ProviderProfilePage"),
);

const AdminDashboardPage = lazy(
  () => import("../pages/admin/AdminDashboardPage"),
);
const AdminAnalyticsPage = lazy(
  () => import("../pages/admin/AdminAnalyticsPage"),
);
const AdminProvidersPage = lazy(
  () => import("../pages/admin/AdminProvidersPage"),
);
const AdminCategoriesPage = lazy(
  () => import("../pages/admin/AdminCategoriesPage"),
);
const AdminReviewsPage = lazy(() => import("../pages/admin/AdminReviewsPage"));

export default function AppRouter() {
  return (
    <Suspense fallback={<Spinner fullScreen />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute allowedRoles={["customer"]} />}>
            <Route element={<CustomerLayout />}>
              <Route path="/home" element={<CustomerHomePage />} />
              <Route path="/providers" element={<ProviderListingsPage />} />
              <Route
                path="/book/:providerId"
                element={<ScheduleServicePage />}
              />
              <Route path="/bookings" element={<CustomerBookingsPage />} />
              <Route path="/profile" element={<ProfileSettingsPage />} />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRoles={["provider"]} />}>
            <Route element={<ProviderLayout />}>
              <Route
                path="/provider/dashboard"
                element={<ProviderDashboardPage />}
              />
              <Route
                path="/provider/bookings"
                element={<ProviderBookingsPage />}
              />
              <Route
                path="/provider/profile"
                element={<ProviderProfilePage />}
              />
            </Route>
          </Route>

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/providers" element={<AdminProvidersPage />} />
              <Route
                path="/admin/categories"
                element={<AdminCategoriesPage />}
              />
              <Route path="/admin/reviews" element={<AdminReviewsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}
