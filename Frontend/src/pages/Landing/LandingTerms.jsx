import React from "react";
import "../../assets/style/InfoPages.css";

const LandingTerms = () => {
  return (
    <section className="terms-page">
      <div className="terms-page-header">
        <h1 className="terms-page-title">Terms of Service</h1>
        <p className="terms-page-subtitle">
          Please read these terms carefully before using Dev Notification
          Pusher.
        </p>
      </div>

      <div className="terms-page-content">
        <p className="terms-page-text">
          By accessing or using Dev Notification Pusher, you agree to comply
          with these terms. Our platform provides developers with tools to send
          push notifications using API keys and a credit-based system.
        </p>

        <p className="terms-page-text">
          You are responsible for maintaining the security of your API keys and
          ensuring that your usage complies with applicable laws and
          regulations. Any misuse of the platform, including spam or
          unauthorized messaging, may result in account suspension.
        </p>

        <p className="terms-page-text">
          Credits purchased or earned are non-refundable and are used based on
          platform actions such as sending notifications or generating device
          tokens.
        </p>

        <p className="terms-page-text">
          We strive to provide reliable service, but we do not guarantee
          uninterrupted availability. Dev Notification Pusher is not responsible
          for any data loss, delivery delays, or service interruptions.
        </p>

        <p className="terms-page-text">
          By continuing to use our platform, you agree to these terms and our
          commitment to providing a secure and developer-friendly experience.
        </p>
      </div>
    </section>
  );
};

export default LandingTerms;
