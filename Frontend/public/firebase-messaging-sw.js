importScripts(
  "https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAbdMvKqltu_mN4mPrPUK-MYILFlJ8num8",
  authDomain: "pushnotification-a9905.firebaseapp.com",
  projectId: "pushnotification-a9905",
  storageBucket: "pushnotification-a9905.firebasestorage.app",
  messagingSenderId: "792292451959",
  appId: "1:792292451959:web:48dc98e4804c200a9ec872",
  measurementId: "G-0530CSL9L9",
});


const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
