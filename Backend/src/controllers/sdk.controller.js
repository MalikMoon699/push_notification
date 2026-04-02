import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_SENDER_ID,
  FIREBASE_APP_ID,
  VAPID_KEY,
} from "../config/env.js";

export const getSdkConfig = (req, res) => {
  res.json({
    firebaseConfig: {
      apiKey: FIREBASE_API_KEY,
      authDomain: FIREBASE_AUTH_DOMAIN,
      projectId: FIREBASE_PROJECT_ID,
      storageBucket: FIREBASE_STORAGE_BUCKET,
      messagingSenderId: FIREBASE_SENDER_ID,
      appId: FIREBASE_APP_ID,
    },
    vapidKey: VAPID_KEY,
  });
};
