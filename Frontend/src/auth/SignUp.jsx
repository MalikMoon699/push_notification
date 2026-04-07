import React, { useState } from "react";
import "../assets/style/Auth.css";
import { Input } from "../components/CustomComponents";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { IMAGES } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validations = () => {
    if (!name) {
      toast.error("Full name is required!");
      return false;
    }
    if (!email) {
      toast.error("Email is required!");
      return false;
    }
    if (!password) {
      toast.error("Password is required!");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validations()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Error signing up");
        return;
      }

      toast.success("Account created! Please login.");
      navigate("/signIn");
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ flexDirection: "row-reverse" }}>
      <div className="auth-left">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="landing-page-logo-icon icon">
              <img src={IMAGES.SiteLogo} alt="" />
            </div>
            <span className="auth-logo-text">Dev Push Notification</span>
          </div>

          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">
            Already have an account?{" "}
            <span onClick={() => navigate("/signIn")} className="auth-link">
              Sign in
            </span>
          </p>

          <div className="auth-form">
            <Input
              label="Full name"
              value={name}
              setValue={setName}
              placeholder="John Doe"
              type="inputIcon"
              Icon={User}
            />
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

            <button
              disabled={loading}
              onClick={handleSignUp}
              className="auth-btn-primary"
            >
              {loading ? (
                <Loader color="#fff" size="18" stroke="2" height="17px" />
              ) : (
                <>
                  Create Account{" "}
                  <span className="icon">
                    <ArrowRight size={16} />
                  </span>
                </>
              )}
            </button>

            <p className="auth-demo">
              By signing up, you agree to our{" "}
              <span onClick={() => navigate("/terms")} className="auth-link">
                Terms of Service
              </span>{" "}
              and{" "}
              <span onClick={() => navigate("/privacy")} className="auth-link">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-content">
          <h1>Your Media, Securely Stored</h1>
          <p>
            Store, manage, and access your files, images, and media anytime,
            anywhere — all in one secure place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
