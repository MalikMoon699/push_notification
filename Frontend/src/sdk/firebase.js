// // /src/sdk/firebase.js
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging";

// let app;
// let messaging;

// export const initFirebase = (config) => {
//   if (!app) {
//     app = !getApps().length ? initializeApp(config) : getApp();
//     messaging = getMessaging(app);
//   }
//   return messaging;
// };

// export const getMessagingInstance = () => {
//   if (!messaging) {
//     throw new Error(
//       "Firebase not initialized. Call initFirebase(config) first.",
//     );
//   }
//   return messaging;
// };

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

let messaging;

export const initFirebase = (config) => {
  const app = !getApps().length ? initializeApp(config) : getApp();
  messaging = getMessaging(app);
  return messaging;
};

export const getMessagingInstance = () => {
  if (!messaging) throw new Error("Firebase not initialized");
  return messaging;
};