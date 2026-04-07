import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/style/Style.css";
import SignIn from "./auth/SignIn.jsx";
import LandingPage from "./pages/Landing/LandingPage.jsx";
import LandingLayout from "./layout/LandingLayout.jsx";
import LandingDocs from "./pages/Landing/LandingDocs.jsx";
import LandingDemo from "./pages/Landing/LandingDemo.jsx";
import LandingContact from "./pages/Landing/LandingContact.jsx";
import LandingCareers from "./pages/Landing/LandingCareers.jsx";
import LandingPrivacy from "./pages/Landing/LandingPrivacy.jsx";
import LandingTerms from "./pages/Landing/LandingTerms.jsx";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/signIn" element={<SignIn />} />

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
