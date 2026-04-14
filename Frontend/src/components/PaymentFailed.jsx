import React, { useEffect } from "react";
import { ArrowRight, CircleX } from "lucide-react";
import { useNavigate } from "react-router";
import { handleFailedHelper } from "../services/payment.services";
import { toast } from "sonner";
import { TopBar } from "./CustomComponents";

const PaymentFailed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    handleVerify();
  }, []);

  const handleVerify = async () => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    try {
      await handleFailedHelper(sessionId);
      toast.error("Payment failed.");
    } catch (err) {
      console.error("Failed to increase credits:", err.response?.data);
      toast.error("Payment failed.");
    }
  };

  return (
    <>
      <TopBar title="Payment" />
      <div className="page-container">
        <div className="payment-success-container">
          <div className="payment-success-card">
            <div className="payment-success-icon-wrapper">
              <CircleX size={70} color="#e8f9f7" fill="var(--status-rejected)" />
            </div>
            <div className="payment-success-content">
              <h2 className="payment-success-title">Payment failed</h2>
              <p className="payment-success-description">
                Your payment failed, Try again later.
              </p>
              <div style={{ marginTop: "8px" }}>
                <button
                  className="landing-page-btn landing-page-btn-secondary"
                  onClick={() => navigate("/payments")}
                >
                  Go to payments
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentFailed;
