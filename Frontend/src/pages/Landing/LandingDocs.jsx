import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  Book,
  Code2,
  Key,
  Send,
  Smartphone,
} from "lucide-react";
import { CustomCodeSection } from "../../components/CustomComponents";

const LandingDocs = () => {
  const [active, setActive] = useState("#introduction");
  const scrollRef=useRef();

  const sideBarKeys = [
    { icon: Book, label: "Introduction", key: "#introduction" },
    { icon: Code2, label: "Installation", key: "#installation" },
    { icon: Key, label: "Authentication", key: "#authentication" },
    { icon: Code2, label: "Service Worker", key: "#serviceWorker" },
    { icon: Code2, label: "Import SDK", key: "#importSDK" },
    { icon: Code2, label: "Initialize", key: "#initMessaging" },
    { icon: Smartphone, label: "Get Device Token", key: "#getDeviceToken" },
    { icon: Send, label: "Send Notification", key: "#sendNotification" },
    { icon: ArrowDownToLine, label: "Response", key: "#response" },
  ];

useEffect(() => {
  const container = scrollRef.current;
  if (!container) return;

  const sections = sideBarKeys.map((item) => container.querySelector(item.key));

  const handleScroll = () => {
    let current = "#introduction";

    sections.forEach((section) => {
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (rect.top - containerRect.top <= 120) {
        current = `#${section.id}`;
      }
    });

    setActive(current);
  };

  container.addEventListener("scroll", handleScroll);

  handleScroll();

  return () => container.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <div className="landing-docs-container">
      <div className="landing-docs-sidebar">
        <h3 className="landing-docs-sidebar-title">Documentation</h3>

        <div className="landing-docs-sidebar-links">
          {sideBarKeys.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.key}
                onClick={() => setActive(item.key)}
                className={`landing-docs-sidebar-link ${
                  active === item.key ? "active" : ""
                }`}
              >
                <Icon className="landing-docs-sidebar-icon" />
                {item.label}
              </a>
            );
          })}
        </div>
      </div>

      <div ref={scrollRef} className="landing-docs-content">
        <section id="introduction" className="landing-docs-section">
          <h2>Introduction</h2>
          <p>
            Dev Push Notification (DPN) is a simple REST API for sending push
            notifications. Each API call costs 1 credit. You can earn free
            credits daily or purchase credit packs.
          </p>
        </section>

        <section id="installation" className="landing-docs-section">
          <h2>Installation</h2>

          <CustomCodeSection
            Title="install"
            codeBody={`npm install dev-push-notification`}
          />
        </section>

        <section id="authentication" className="landing-docs-section">
          <h2>Authentication</h2>
          <p>
            Use your API key to authenticate all requests. Keep your API key
            secure and never expose it publicly.
          </p>

          <CustomCodeSection
            Title="auth.js"
            codeBody={`const API_KEY = "YOUR_API_KEY_HERE";`}
          />
        </section>

        <section id="serviceWorker" className="landing-docs-section">
          <h2>Service Worker Setup</h2>

          <p>
            After installing the package, you must create a <b>dpn-sw.js</b>{" "}
            file inside your <b>public</b> folder. This file is required to
            handle background notifications.
          </p>

          <CustomCodeSection
            Title="public/dpn-sw.js"
            codeBody={`importScripts(
  "https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js",
);

const decodeConfig = (encoded) => {
  return atob(encoded);
};

const encodeConfig = {
  apiKey: "YOUR_ENCODED_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

firebase.initializeApp({
  apiKey: decodeConfig(encodeConfig.apiKey),
  authDomain: decodeConfig(encodeConfig.authDomain),
  projectId: decodeConfig(encodeConfig.projectId),
  storageBucket: decodeConfig(encodeConfig.storageBucket),
  messagingSenderId: decodeConfig(encodeConfig.messagingSenderId),
  appId: decodeConfig(encodeConfig.appId),
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});`}
          />
        </section>

        <section id="importSDK" className="landing-docs-section">
          <h2>Import SDK</h2>

          <CustomCodeSection
            Title="import.js"
            codeBody={`import {
  getToken,
  sendNotification,
  onMessageListener,
  initMessaging,
} from "dev-push-notification";`}
          />
        </section>

        <section id="initMessaging" className="landing-docs-section">
          <h2>Initialize Messaging</h2>

          <p>
            Initialize the notification system in your app (recommended inside
            App.jsx).
          </p>

          <CustomCodeSection
            Title="init.js"
            codeBody={`useEffect(() => {
  initMessaging(API_KEY);

  const unsubscribe = onMessageListener((payload) => {
    console.log("Notification received:", payload);

    if (Notification.permission === "granted" && payload.notification) {
      const { title, body, image } = payload.notification;

      new Notification(title, {
        body,
        icon: image,
      });
    }
  }, API_KEY);

  return () => unsubscribe();
}, []);`}
          />
        </section>

        <section id="getDeviceToken" className="landing-docs-section">
          <h2>Get Device Token</h2>

          <CustomCodeSection
            Title="getToken.js"
            codeBody={`const token = await getToken(API_KEY);
console.log("Device Token:", token);`}
          />
        </section>

        <section id="sendNotification" className="landing-docs-section">
          <h2>Send Notification</h2>

          <CustomCodeSection
            Title="sendNotification.js"
            codeBody={`await sendNotification({
  apiKey: API_KEY,
  title: "Hello",
  body: "This is a test push notification",
  icon: "https://example.com/icon.png",
  fcmTokens: [token],
});`}
          />
        </section>

        <section id="response" className="landing-docs-section">
          <h2>Response</h2>

          <p>
            The API returns structured responses for both success and error
            cases. Below are real examples based on the backend behavior.
          </p>

          <CustomCodeSection
            Title="sendNotification (Success)"
            style={{ marginBottom: "10px" }}
            codeBody={`{
  "success": true,
  "successCount": 2,
  "failureCount": 1,
  "results": [
    "message-id-1",
    "message-id-2",
    { "error": "Invalid registration token" }
  ]
}`}
          />

          <CustomCodeSection
            Title="sendNotification (Error - Missing Tokens)"
            style={{ marginBottom: "10px" }}
            codeBody={`{
  "error": "FCM tokens are required"
}`}
          />

          <CustomCodeSection
            Title="sendNotification (Server Error)"
            style={{ marginBottom: "10px" }}
            codeBody={`{
  "error": "Internal server error message"
}`}
          />

          <CustomCodeSection
            Title="getFcmToken (Success)"
            style={{ marginBottom: "10px" }}
            codeBody={`{
  "success": true,
  "token": "device-token-value"
}`}
          />

          <CustomCodeSection
            Title="getFcmToken (Error)"
            style={{ marginBottom: "10px" }}
            codeBody={`{
  "message": "Failed to get token"
}`}
          />
        </section>

        <p className="landing-docs-warning">
          ⚠️ Make sure dpn-sw.js is placed in the public folder or notifications
          will not work.
        </p>
      </div>
    </div>
  );
};

export default LandingDocs;
