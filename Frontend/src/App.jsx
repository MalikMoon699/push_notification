import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./assets/style/Style.css";
import LandingPage from "./pages/LandingPage.jsx";
import {
  requestForToken,
  onMessageListener,
} from "./utils/FirebaseMessaging.js";

const App = () => {
  const [tokken,setTokken]=useState(null);
  useEffect(() => {
    requestForToken().then((token) => {
      if (token) {
        setTokken(token);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notification/get-fcm-tokken`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      }
    });

    onMessageListener().then((payload) => {
      console.log("Notification received: ", payload);
    });
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage tokken={tokken} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
