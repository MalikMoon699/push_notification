import React from "react";
import {
  Sparkles,
  Shield,
  ArrowRight,
  Key,
  Code2,
  Zap,
  CreditCard,
  Gift,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../assets/style/LandingPage.css";
import { CustomCodeSection } from "../../components/CustomComponents";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page-container">
      <section className="landing-page-hero">
        <div className="landing-page-hero-inner">
          <div className="landing-page-hero-badge">
            <Sparkles
              size={18}
              color="var(--primary)"
              className="landing-page-icon-small"
            />
            Now with daily free credits
          </div>

          <h1 className="landing-page-hero-title">
            Send Notifications{" "}
            <span className="landing-page-text-primary">Instantly</span> with
            Dev Push Notification
          </h1>
          <p className="landing-page-hero-subtitle">
            The simplest API for push notifications. Built for developers, loved
            by startups. One API call. One credit. Done.
          </p>
          <div className="landing-page-hero-cta">
            <button
              onClick={() => navigate("/api-section")}
              className="landing-page-btn landing-page-btn-primary"
            >
              <Key size={18} className="landing-page-icon-small icon" />
              Get API Key
            </button>
            <button
              onClick={() => navigate("/landing-docs")}
              className="landing-page-btn landing-page-btn-outline"
            >
              <Code2 size={18} className="landing-page-icon-small icon" />
              View Docs
            </button>
          </div>
        </div>
      </section>

      <section className="landing-page-stats">
        <div className="landing-page-section-header">
          <h2 className="landing-page-section-title">
            Why Developers Choose Us
          </h2>
          <p className="landing-page-section-subtitle">
            Everything you need to add push notifications to your app.
          </p>
        </div>
        <div className="landing-page-features-grid">
          <div className="landing-page-feature-card">
            <div className="landing-page-feature-icon-wrapper">
              <Zap className="landing-page-icon-feature icon" />
            </div>
            <h3 className="landing-page-feature-title">Lightning Fast</h3>
            <p className="landing-page-feature-desc">
              Send notifications in under 100ms with our global edge network.
            </p>
          </div>
          <div className="landing-page-feature-card">
            <div className="landing-page-feature-icon-wrapper">
              <Shield className="landing-page-icon-feature icon" />
            </div>
            <h3 className="landing-page-feature-title">Secure by Default</h3>
            <p className="landing-page-feature-desc">
              API keys are encrypted and rate-limited. Your data stays safe.
            </p>
          </div>
          <div className="landing-page-feature-card">
            <div className="landing-page-feature-icon-wrapper">
              <Code2 className="landing-page-icon-feature icon" />
            </div>
            <h3 className="landing-page-feature-title">Developer First</h3>
            <p className="landing-page-feature-desc">
              Simple REST API with SDKs for JavaScript, Python, and more.
            </p>
          </div>
          <div className="landing-page-feature-card">
            <div className="landing-page-feature-icon-wrapper">
              <CreditCard className="landing-page-icon-feature icon" />
            </div>
            <h3 className="landing-page-feature-title">Pay Per Use</h3>
            <p className="landing-page-feature-desc">
              Credit-based pricing. Only pay for what you send.
            </p>
          </div>

          <div className="landing-page-feature-card">
            <div className="landing-page-feature-icon-wrapper">
              <Key className="landing-page-icon-feature icon" />
            </div>
            <h3 className="landing-page-feature-title">API Key System</h3>
            <p className="landing-page-feature-desc">
              Generate multiple keys with granular permissions.
            </p>
          </div>

          <div className="landing-page-feature-card">
            <div className="landing-page-feature-icon-wrapper">
              <Gift className="landing-page-icon-feature icon" />
            </div>
            <h3 className="landing-page-feature-title">Free Daily Credits</h3>
            <p className="landing-page-feature-desc">
              Earn free credits every day with our reward system.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-page-testimonials">
        <div className="landing-use-code-demo-left">
          <h2 className="landing-page-section-title">Three Lines of Code</h2>
          <p className="landing-page-section-subtitle">
            Install our SDK, set your API key, and start sending. It's that
            simple.
          </p>

          <div className="landing-code-points">
            <div className="landing-code-point">
              <div className="landing-code-point-icon">
                <Bell />
              </div>
              <div>
                <h4>1 notification = 1 credit</h4>
                <p>Simple, transparent pricing</p>
              </div>
            </div>

            <div className="landing-code-point">
              <div className="landing-code-point-icon">
                <Key />
              </div>
              <div>
                <h4>Secure API keys</h4>
                <p>Rotate, revoke, and manage access</p>
              </div>
            </div>
          </div>
        </div>

        <div className="landing-use-code-demo-right">
          <CustomCodeSection
            Title="notification.js"
            codeBody={`import { sendNotification } from "dev-push-notification";

const API_KEY = "YOUR_API_KEY_HERE";

// Send a push notification
await sendNotification({
  apiKey: API_KEY,
  title: 'Hello World!',
  body: 'Your first push notification',
  icon: "https://dev-push-notification.vercel.app/SiteIcon.png",
  fcmTokens: [token],
});`}
          />
        </div>
      </section>

      <section className="landing-credit-system"></section>

      <section style={{ padding: "9rem 1rem" }} className="landing-page-hero">
        <div className="landing-page-cta-inner">
          <h2
            style={{ fontSize: "28px" }}
            className="landing-page-section-title"
          >
            Ready to Take Control of Your Notifications?
          </h2>
          <p className="landing-page-section-subtitle">
            Join thousands of developers sending notifications with our API.
          </p>
          <button
            style={{ marginTop: "15px" }}
            onClick={() => navigate("/signUp")}
            className="landing-page-btn landing-page-btn-secondary"
          >
            Get Started Free
            <ArrowRight className="landing-page-icon-small icon" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
