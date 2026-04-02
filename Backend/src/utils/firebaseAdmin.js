import admin from "firebase-admin";
import serviceAccount from "./pushnotification-a9905-247727cb17ad.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
