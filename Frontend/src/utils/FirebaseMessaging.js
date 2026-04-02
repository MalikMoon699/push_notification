import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebaseConfig";

const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const swRegistration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (currentToken) return currentToken;
    return null;
  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
