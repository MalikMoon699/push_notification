import React from "react";
import "../../assets/style/InfoPages.css";

const LandingCareers = () => {
  return (
    <section className="careers-page">
      <div className="careers-page-header">
        <h1 className="careers-page-title">
          Careers at Dev Notification Pusher
        </h1>
        <p className="careers-page-subtitle">
          Build the future of developer-friendly notification infrastructure.
        </p>
      </div>

      <div className="careers-page-content">
        <p className="careers-page-text">
          At Dev Notification Pusher, we are building a powerful and simple
          platform that helps developers send notifications effortlessly using
          APIs and a credit-based system. We value speed, simplicity, and
          scalability. If you love building tools for developers and want to
          make an impact, join us.
        </p>

        <div className="careers-page-roles">
          <div className="careers-page-role">
            <h4>Frontend Developer</h4>
            <p>
              Build clean, fast, and intuitive interfaces for developers using
              modern frameworks like React.
            </p>
          </div>

          <div className="careers-page-role">
            <h4>Backend Engineer</h4>
            <p>
              Design scalable APIs, manage credit systems, and ensure secure
              notification delivery.
            </p>
          </div>

          <div className="careers-page-role">
            <h4>DevRel Engineer</h4>
            <p>
              Help developers succeed by creating documentation, examples, and
              engaging with the community.
            </p>
          </div>

          <div className="careers-page-role">
            <h4>Product Engineer</h4>
            <p>
              Work across frontend and backend to improve user experience,
              dashboard features, and developer workflows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCareers;
