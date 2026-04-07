import React from "react";
import "../../assets/style/InfoPages.css";

const LandingContact = () => {
  return (
    <section className="contact-page">
      <div className="contact-page-header">
        <h1 className="contact-page-title">Contact Us</h1>
        <p className="contact-page-subtitle">
          We’re here to help you every step of the way.
        </p>
      </div>

      <div className="contact-page-content">
        <p className="contact-page-text">
          Have questions or need support? Reach out to DPN and our team will
          assist you as quickly as possible.
        </p>

        <div className="contact-page-info">
          <div className="contact-page-info-item">
            <h4>Email</h4>
            <p>support@dev-push-notification.com</p>
          </div>

          <div className="contact-page-info-item">
            <h4>Phone</h4>
            <p>+1 (800) 123-4567</p>
          </div>

          <div className="contact-page-info-item">
            <h4>Address</h4>
            <p>123 DPN Street, New York, NY</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingContact;
