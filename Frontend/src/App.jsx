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
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/api-section"
            element={
              <ProtectedRoute>
                <APISection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usage"
            element={
              <ProtectedRoute>
                <Usage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <Rewards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
