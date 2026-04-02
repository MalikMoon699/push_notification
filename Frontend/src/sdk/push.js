// import { getToken as fcmGetToken, onMessage } from "firebase/messaging";
// import { initFirebase, getMessagingInstance } from "./firebase.js";

// let isInitialized = false;

// export const getToken = async (apiKey) => {
//   try {
//     const res = await fetch(
//       `${import.meta.env.VITE_BACKEND_URL}/api/sdk/config`,
//       {
//         headers: { apikey: apiKey },
//       },
//     );

//     const { firebaseConfig, vapidKey } = await res.json();

//     if (!isInitialized) {
//       initFirebase(firebaseConfig);
//       isInitialized = true;
//     }

//     const messaging = getMessagingInstance();

//     const swRegistration = await navigator.serviceWorker.register(
//       "/firebase-messaging-sw.js",
//     );

//     const token = await fcmGetToken(messaging, {
//       vapidKey,
//       serviceWorkerRegistration: swRegistration,
//     });

//     return token;
//   } catch (err) {
//     console.error("SDK Token Error:", err);
//     return null;
//   }
// };

// export const onMessageListener = (callback) => {
//   try {
//     const messaging = getMessagingInstance();
//     onMessage(messaging, (payload) => {
//       callback(payload);

//       if (Notification.permission === "granted" && payload.notification) {
//         const { title, body, image } = payload.notification;
//         new Notification(title, { body, icon: image });
//       }
//     });
//   } catch (err) {
//     console.error("SDK onMessageListener Error:", err);
//   }
// };
import { initFirebase, getMessagingInstance } from "./firebase";
import { getToken as fcmGetToken, onMessage } from "firebase/messaging";

// Single function developers will call
export const sendPushNotification = async ({ title, body, icon, apiKey }) => {
  try {
    // 1️⃣ Fetch backend SDK config (Firebase config + VAPID)
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/sdk/config`,
      {
        headers: { apikey: apiKey },
      },
    );
    const { firebaseConfig, vapidKey } = await res.json();

    // 2️⃣ Init Firebase
    initFirebase(firebaseConfig);

    // 3️⃣ Register Service Worker
    const swRegistration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    // 4️⃣ Get FCM token
    const messaging = getMessagingInstance();
    const fcmToken = await fcmGetToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: swRegistration,
    });

    // 5️⃣ Listen for foreground notifications
    onMessage(messaging, (payload) => {
      if (Notification.permission === "granted") {
        const { title, body, image } = payload.notification;
        new Notification(title, { body, icon: image });
      }
      console.log("Foreground notification:", payload);
    });

    // 6️⃣ Call your backend to send notification
    const pushRes = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/sdk/push-notification`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: apiKey },
        body: JSON.stringify({ title, body, icon, fcmToken }),
      },
    );

    return await pushRes.json();
  } catch (err) {
    console.error("SDK Push Error:", err);
    throw err;
  }
};