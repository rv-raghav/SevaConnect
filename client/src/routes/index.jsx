import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import ProviderLayout from "../layouts/ProviderLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import LandingPage from "../pages/public/LandingPage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";

import CustomerHomePage from "../pages/customer/CustomerHomePage";
import ProviderListingsPage from "../pages/customer/ProviderListingsPage";
import ScheduleServicePage from "../pages/customer/ScheduleServicePage";
import CustomerBookingsPage from "../pages/customer/CustomerBookingsPage";
import ProfileSettingsPage from "../pages/customer/ProfileSettingsPage";

import ProviderDashboardPage from "../pages/provider/ProviderDashboardPage";
import ProviderBookingsPage from "../pages/provider/ProviderBookingsPage";
import ProviderProfilePage from "../pages/provider/ProviderProfilePage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminAnalyticsPage from "../pages/admin/AdminAnalyticsPage";
import AdminProvidersPage from "../pages/admin/AdminProvidersPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminReviewsPage from "../pages/admin/AdminReviewsPage";

export default function AppRouter() {
  return (
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
            <Route path="/book/:providerId" element={<ScheduleServicePage />} />
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
            <Route path="/provider/profile" element={<ProviderProfilePage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/providers" element={<AdminProvidersPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/reviews" element={<AdminReviewsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
