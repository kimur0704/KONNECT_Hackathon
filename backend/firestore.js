import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { existsSync, readFileSync } from "fs";

const serviceAccountPath = new URL("./serviceAccountKey.json", import.meta.url);

function initializeFirebaseApp() {
  if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath));
    return initializeApp({
      credential: cert(serviceAccount),
    });
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return initializeApp({
      credential: applicationDefault(),
    });
  }

  console.warn("[Firestore] serviceAccountKey.json is missing. Firestore requests may fail until credentials are configured.");
  return initializeApp();
}

const app = initializeFirebaseApp();

export const db = getFirestore(app);
