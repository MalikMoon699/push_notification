import React, { useState } from "react";
import "../assets/style/Auth.css";
import { Input } from "../components/CustomComponents";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { IMAGES } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { refresh, currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validations = () => {
    if (!email) {
      toast.error("email is required!");
      return false;
    }
    if (!password) {
      toast.error("password is required!");
      return false;
    }
    if (password.length < 8) {
      toast.error("password must be at least 8 characters required!");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    const isValid = validations();
    if (!isValid) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setEmail("");
      setPassword("");
      await refresh();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="landing-page-logo-icon icon">
              <img src={IMAGES.SiteLogo} alt="" />
            </div>
            <span className="auth-logo-text">Dev Push Notification</span>
          </div>

          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">
            Don&apos;t have an account?{" "}
            <span onClick={() => navigate("/signUp")} className="auth-link">
              Sign up for free
            </span>
          </p>

          <div className="auth-form">
            <Input
              label="Email address"
              value={email}
              setValue={setEmail}
              placeholder="you@example.com"
              type="inputIcon"
              Icon={Mail}
              InputType="email"
            />

            <Input
              label="Password"
              value={password}
              setValue={setPassword}
              placeholder="••••••••"
              type="inputIcon"
              Icon={Lock}
              InputType="password"
            />

            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" />
                Remember me
              </label>
            </div>

            <button
              disabled={loading}
              onClick={handleSignIn}
              className="auth-btn-primary"
            >
              {loading ? (
                <Loader color="#fff" size="18" stroke="2" height="17px" />
              ) : (
                <>
                  Sign in{" "}
                  <span className="icon">
                    <ArrowRight size={16} />
                  </span>
                </>
              )}
            </button>

            <p className="auth-demo">
              Welcome! Log in with your account or sign up to get started.
            </p>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-right-content">
          <h1>Powerful Push Notifications Made Simple</h1>
          <p>
            Send, manage, and track real-time notifications effortlessly — all
            from one centralized platform built for developers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
