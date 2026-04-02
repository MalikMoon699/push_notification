import { useEffect, useState } from "react";
import { getToken, onMessageListener } from "./sdk/push.js";

const App = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const tok = await getToken("YOUR_API_KEY_HERE");
      if (tok) {
        setToken(tok);
        onMessageListener((payload) => {
          console.log("Foreground notification:", payload);
        });
      }
    };
    init();
  }, []);

  useEffect(() => {
    handleSendNotification();
  }, [token]);

  const handleSendNotification = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/notification/send-notification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Push Notification",
            body: "Testing push notification by MERN + Firebase",
            fcmToken: token,
            icon: "https://www.appsflyer.com/wp-content/uploads/2022/11/push-notifications-2.jpg",
          }),
        },
      );
      console.log("res----->", res);
    } catch (err) {
      console.error("Failed to send Notification:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log("token----->", token);

  return (
    <div>{loading ? "Sending..." : "Waiting..."}</div>
  );
};

export default App;