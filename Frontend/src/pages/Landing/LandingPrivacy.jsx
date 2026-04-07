import React from "react";
import "../../assets/style/InfoPages.css";

const LandingPrivacyPolicy = () => {
  return (
    <section className="privacy-page">
      <div className="privacy-page-header">
        <h1 className="privacy-page-title">Privacy Policy</h1>
        <p className="privacy-page-subtitle">
          Your data, your control — built with security and transparency in
          mind.
        </p>
      </div>

      <div className="privacy-page-content">
        <p className="privacy-page-text">
          Dev Notification Pusher collects only the information necessary to
          provide our notification delivery services. This includes account
          details, API usage data, and basic analytics to improve performance
          and reliability.
        </p>

        <p className="privacy-page-text">
          We do not sell or share your personal data with third parties. All API
          keys, tokens, and user data are securely stored and handled using
          industry-standard security practices.
        </p>

        <p className="privacy-page-text">
          Notification content and device tokens are processed only for delivery
          purposes and are not stored longer than necessary. We ensure your data
          remains private and protected at all times.
        </p>

        <p className="privacy-page-text">
          By using our platform, you agree to our data handling practices
          designed to keep your applications and users safe.
        </p>
      </div>
    </section>
  );
};

export default LandingPrivacyPolicy;
