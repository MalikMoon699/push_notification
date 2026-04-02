import { useState } from "react";

const LandingPage = ({ tokken }) => {
  const [loading,setLoading]=useState(false);

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
            fcmToken: tokken,
            icon: "https://www.appsflyer.com/wp-content/uploads/2022/11/push-notifications-2.jpg",
          }),
        },
      );
      console.log("res----->", res);
    } catch (err) {
      console.error("Failed to send Notification:",err)
    }finally{
      setLoading(false)
    }
  };

  return (
    <div>
      <button disabled={loading} onClick={handleSendNotification}>
        {loading ? "Sending..." : "Send notification"}
      </button>
    </div>
  );
};

export default LandingPage;
