import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentUser, setCurrentUser] = useState(null);
  const [authAllow, setAuthAllow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDetail, setIsDetail] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const fetchMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCurrentUser(null);
      setAuthAllow(false);
      setIsDetail(false);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        if (data.status === "approved") {
          setCurrentUser(data);
          setAuthAllow(true);
        } else {
          logout(false);
          toast.error(
            data.status === "pending"
              ? "Your account is pending approval"
              : "Your account has been banned",
          );
        }
      } else {
        logout(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      logout(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = (redirect = true) => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setAuthAllow(false);
    setIsDetail(false);
    if (redirect) navigate("/signIn");
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        currentUser,
        setCurrentUser,
        authAllow,
        setAuthAllow,
        loading,
        refresh: fetchMe,
        isDetail,
        setIsDetail,
        logout,
        isOnline,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
