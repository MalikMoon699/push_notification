import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { handleVerifyHelper } from "../services/payment.services";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { TopBar } from "./CustomComponents";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { refresh } = useAuth();

  useEffect(() => {
    handleVerify();
  }, []);

  const handleVerify = async () => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    try {
      const res = await handleVerifyHelper(sessionId);
      toast.success(res?.data?.message || "Credits added successfully");
      if (res?.status === 200) {
        refresh();
      }
    } catch (err) {
      console.error("Failed to increase credits:", err.response?.data);
      toast.error("Credits failed to add.");
    }
  };

  return (
    <>
      <TopBar title="Payment" />
      <div
        className="page-container"
      >
        <div className="payment-success-container">
          <div className="payment-success-card">
            <div className="payment-success-icon-wrapper">
              <CheckCircle2 size={70} color="#e8f9f7" fill="var(--primary)" />
            </div>
            <div className="payment-success-content">
              <h2 className="payment-success-title">Payment Successful</h2>
              <p className="payment-success-description">
                Your credits will be added shortly.
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

export default PaymentSuccess;
