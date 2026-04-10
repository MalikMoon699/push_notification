import React, { useEffect, useState } from "react";
import { Input } from "../../components/CustomComponents";
import { Key, SendHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  getToken,
  sendNotification,
  onMessageListener,
  initMessaging,
} from "dev-push-notification";
import { useNavigate } from "react-router";

const LandingDemo = () => {
  const navigate=useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = apiKey;

  useEffect(() => {
    initMessaging(API_KEY);
    const unsubscribe = onMessageListener((payload) => {
      if (Notification.permission === "granted" && payload.notification) {
        const { title, body, image } = payload.notification;
        new Notification(title, { body, icon: image });
      }
    }, API_KEY);

    return () => unsubscribe();
  }, []);

  const handleSendNotification = async () => {
    if (apiKey.trim() === "") return toast.error("Api Key is required!");
    else if (title.trim() === "") return toast.error("Title is required!");
    else if (message.trim() === "") return toast.error("Message is required!");
    try {
      setLoading(true);
      const tokenRes = await getToken(API_KEY);
      if (!tokenRes?.success) {
        return toast.error(tokenRes?.message || "Something went wrong");
      }
      const token = tokenRes.token;
      const res = await sendNotification({
        apiKey: API_KEY,
        title: title,
        body: message,
        icon: "https://dev-push-notification.vercel.app/SiteIcon.png",
        fcmTokens: [token],
      });
      if (!res?.success) {
        return toast.error(res?.message || "Something went wrong");
      }
      toast.success("Notification sent successfully!");
    } catch (err) {
      console.error("Failed to send notification:", err);
      toast.error(err?.message || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-demo-container">
      <div className="landing-demo-inner-container">
        <h1>Live Demo</h1>
        <h4>
          Test the API directly from your browser. Each test requires{" "}
          <b>2 credits</b> (1 for token generation and 1 for sending the
          notification).
        </h4>
        <div className="form-card">
          <div style={{ display: "flex", width: "100%", alignItems: "end" }}>
            <div style={{ width: "100%" }}>
              <Input
                label="API Key"
                value={apiKey}
                setValue={setApiKey}
                placeholder="dpn_sk_live_..."
                type="input"
                InputType="text"
                margin="6px 0px 8px 0px"
              />
            </div>
            <button
              style={{
                whiteSpace: "nowrap",
                margin: "0px 0px 9px 6px",
                borderRadius: "6px",
              }}
              className="landing-page-btn landing-page-btn-primary"
              onClick={() => navigate("/api-section")}
            >
              Get Key
            </button>
          </div>
          <Input
            label="Notification Title"
            value={title}
            setValue={setTitle}
            placeholder="Hello World!"
            type="input"
            InputType="text"
            margin="6px 0px 8px 0px"
          />
          <Input
            label="Message"
            value={message}
            setValue={setMessage}
            placeholder="Your notification message..."
            type="textArea"
            style={{ height: "150px" }}
            InputType="text"
            margin="6px 0px 8px 0px"
          />
          <button
            onClick={handleSendNotification}
            disabled={loading}
            className="send-request-btn"
            style={{ height: "40px" }}
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                Send Notification
                <span className="icon">
                  <SendHorizontal />
                </span>
              </>
            )}
          </button>{" "}
        </div>
      </div>
    </div>
  );
};

export default LandingDemo;
