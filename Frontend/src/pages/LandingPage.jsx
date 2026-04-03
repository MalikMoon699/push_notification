import {
  Bell,
  Key,
  CreditCard,
  ShieldCheck,
  Zap,
  Code,
  Gift,
  Menu,
} from "lucide-react";
import "../assets/style/LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Topbar */}
      <header className="landing-topbar">
        <div className="landing-logo">DevNotify</div>
        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#credits">Credits</a>
          <a href="#docs">Docs</a>
        </nav>
        <button className="landing-btn-primary">Dashboard</button>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <h1 className="landing-title">Dev Notification Pusher</h1>
        <p className="landing-subtitle">
          The easiest way for developers to send push notifications with secure
          API keys and a powerful credit system.
        </p>
        <div className="landing-cta">
          <button className="landing-btn-primary">Get API Key</button>
          <button className="landing-btn-secondary">View Docs</button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="landing-why">
        <h2>Why Choose DevNotify?</h2>
        <div className="landing-why-grid">
          <div className="landing-why-card">
            <Zap className="landing-icon" />
            <h3>Super Easy</h3>
            <p>Integrate in minutes with simple API calls.</p>
          </div>
          <div className="landing-why-card">
            <ShieldCheck className="landing-icon" />
            <h3>Secure</h3>
            <p>Protected API keys and secure transactions.</p>
          </div>
          <div className="landing-why-card">
            <CreditCard className="landing-icon" />
            <h3>Flexible Credits</h3>
            <p>Pay only for what you use.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="landing-features">
        <div className="landing-feature-card">
          <Bell className="landing-icon" />
          <h3>Send Notifications</h3>
          <p>1 credit per notification with fast delivery system.</p>
        </div>

        <div className="landing-feature-card">
          <Key className="landing-icon" />
          <h3>API Keys</h3>
          <p>Generate secure API keys to integrate with your apps.</p>
        </div>

        <div className="landing-feature-card">
          <Zap className="landing-icon" />
          <h3>Fast & Scalable</h3>
          <p>Built for performance and reliability.</p>
        </div>
      </section>

      {/* Credits Section */}
      <section id="credits" className="landing-credits">
        <h2>Credits System</h2>
        <div className="landing-credit-grid">
          <div className="landing-credit-card">
            <Gift className="landing-icon" />
            <h4>Daily Rewards</h4>
            <p>Claim random credits daily.</p>
          </div>

          <div className="landing-credit-card">
            <CreditCard className="landing-icon" />
            <h4>Buy Credits</h4>
            <p>Purchase extra credits anytime.</p>
          </div>

          <div className="landing-credit-card">
            <Code className="landing-icon" />
            <h4>Device Tokens</h4>
            <p>1 credit per token generation.</p>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section id="docs" className="landing-code">
        <h2>Simple Integration</h2>
        <pre className="landing-code-block">
          {`import { sendNotification } from 'dev-notification-pusher';

sendNotification({
  apiKey: "your-api-key",
  title: "Hello",
  body: "Test notification",
  icon: "https://example.com/icon.png",
  fcmTokens: [token],
});`}
        </pre>
      </section>

      <section className="landing-security">
        <ShieldCheck className="landing-icon-large" />
        <h2>Secure & Reliable</h2>
        <p>
          All transactions and API usage are fully secured. Supports all major
          cards.
        </p>
      </section>

      <footer className="landing-footer">
        <p>© 2026 Dev Notification Pusher. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
