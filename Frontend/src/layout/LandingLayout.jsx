import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../assets/style/LandingPage.css";
import { IMAGES } from "../utils/constants";

const LandingLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing-page-container">
      <header className="landing-page-header">
        <div className="landing-page-header-inner">
          <div className="landing-page-logo">
            <div className="landing-page-logo-icon icon">
              <img src={IMAGES.SiteLogo} alt="" />
            </div>
            <span className="landing-page-logo-text">
              Dev Push Notification
            </span>
          </div>
          <nav className="landing-page-nav">
            <Link
              to="/"
              style={{
                color: location.pathname === "/" ? "var(--primary)" : "",
              }}
              className="landing-page-nav-link"
            >
              Home
            </Link>
            <Link
              style={{
                color:
                  location.pathname === "/landing-docs" ? "var(--primary)" : "",
              }}
              to="/landing-docs"
              className="landing-page-nav-link"
            >
              Docs
            </Link>
            <Link
              style={{
                color:
                  location.pathname === "/landing-demo" ? "var(--primary)" : "",
              }}
              to="/landing-demo"
              className="landing-page-nav-link"
            >
              Demo
            </Link>
            <Link
              style={{
                color: location.pathname === "/contact" ? "var(--primary)" : "",
              }}
              to="/contact"
              className="landing-page-nav-link"
            >
              Contact
            </Link>
          </nav>
          <div className="landing-page-header-actions">
            <button
              onClick={toggleTheme}
              className="landing-page-icon-btn icon"
            >
              {theme === "dark" ? (
                <Sun className="landing-page-icon" />
              ) : (
                <Moon className="landing-page-icon" />
              )}
            </button>
            <button
              onClick={() => navigate("/signIn")}
              className="landing-page-btn landing-page-btn-ghost"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signUp")}
              className="landing-page-btn landing-page-btn-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>
      <Outlet />
      <footer className="landing-page-footer">
        <div className="landing-page-footer-inner">
          <div className="landing-page-footer-column">
            <div className="landing-page-logo">
              <div className="landing-page-logo-icon">
                <img src={IMAGES.SiteLogo} alt="" />
              </div>
              <span className="landing-page-logo-text">DPN</span>
            </div>
            <p className="landing-page-footer-text">
              Send push notifications in seconds with our developer-friendly
              API.
            </p>
          </div>
          <div className="landing-page-footer-column">
            <h4 className="landing-page-footer-title">Product</h4>
            <ul className="landing-page-footer-list">
              <li>
                <Link to="/landing-docs">Documentation</Link>
              </li>
              <li>
                <Link to="/landing-demo">Demo</Link>
              </li>
            </ul>
          </div>
          <div className="landing-page-footer-column">
            <h4 className="landing-page-footer-title">Company</h4>
            <ul className="landing-page-footer-list">
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/careers">Careers</Link>
              </li>
            </ul>
          </div>
          <div className="landing-page-footer-column">
            <h4 className="landing-page-footer-title">Legal</h4>
            <ul className="landing-page-footer-list">
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="landing-page-footer-bottom">
          © {new Date().getFullYear()} DPN. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
