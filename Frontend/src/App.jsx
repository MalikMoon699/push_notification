import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/style/Style.css";
import { PublicRoute, ProtectedRoute } from "./routes/RouteGuards.jsx";
import SignIn from "./auth/SignIn.jsx";
import SignUp from "./auth/SignUp.jsx";
import LandingPage from "./pages/Landing/LandingPage.jsx";
import LandingLayout from "./layout/LandingLayout.jsx";
import LandingDocs from "./pages/Landing/LandingDocs.jsx";
import LandingDemo from "./pages/Landing/LandingDemo.jsx";
import LandingContact from "./pages/Landing/LandingContact.jsx";
import LandingCareers from "./pages/Landing/LandingCareers.jsx";
import LandingPrivacy from "./pages/Landing/LandingPrivacy.jsx";
import LandingTerms from "./pages/Landing/LandingTerms.jsx";
import AppLayout from "./layout/AppLayout.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import Analytics from "./pages/Analytics.jsx";
import APISection from "./pages/APISection.jsx";
import Usage from "./pages/Usage.jsx";
import Rewards from "./pages/Rewards.jsx";
import PaymentSuccess from "./components/PaymentSuccess.jsx";
import Payments from "./pages/Payments.jsx";
import Settings from "./pages/Settings.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Admin
import AdminLayout from "./layout/AdminLayout.jsx";
import AdminDashBoard from "./pages/Admin/DashBoard.jsx";
import AdminUsers from "./pages/Admin/Users.jsx";
import AdminCreditSales from "./pages/Admin/CreditSales.jsx";
import AdminCreditLogs from "./pages/Admin/CreditLogs.jsx";
import AdminApiKeys from "./pages/Admin/APIKeys.jsx";
import AdminSettings from "./pages/Admin/Settings.jsx";
import PaymentFailed from "./components/PaymentFailed.jsx";


const App = () => {

  return (
    <>
      <Routes>
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role={["admin"]}>
                <AdminDashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/credit-sales"
            element={
              <ProtectedRoute role={["admin"]}>
                <AdminCreditSales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/credit-logs"
            element={
              <ProtectedRoute role={["admin"]}>
                <AdminCreditLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/api-keys"
            element={
              <ProtectedRoute role={["admin"]}>
                <AdminApiKeys />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute role={["admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role={["user"]}>
                <DashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute role={["user"]}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/api-section"
            element={
              <ProtectedRoute role={["user"]}>
                <APISection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usage"
            element={
              <ProtectedRoute role={["user"]}>
                <Usage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rewards"
            element={
              <ProtectedRoute role={["user"]}>
                <Rewards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ProtectedRoute role={["user"]}>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-failed"
            element={
              <ProtectedRoute role={["user"]}>
                <PaymentFailed />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedRoute role={["user"]}>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute role={["user"]}>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing-docs" element={<LandingDocs />} />
          <Route path="/landing-demo" element={<LandingDemo />} />
          <Route path="/contact" element={<LandingContact />} />
          <Route path="/careers" element={<LandingCareers />} />
          <Route path="/privacy" element={<LandingPrivacy />} />
          <Route path="/terms" element={<LandingTerms />} />
        </Route>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
