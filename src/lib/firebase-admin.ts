import "server-only";
import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Check if we are in an environment with service account key
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let credential: any = undefined;

if (serviceAccountKey) {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    // Basic validation to avoid crashes during build with placeholder
    if (serviceAccount.private_key && !serviceAccount.private_key.includes("PLACEHOLDER")) {
      credential = cert(serviceAccount);
    }
  } catch (error) {
    console.error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY:", error);
  }
}

export function getFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp({
    credential,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

export function getAdminFirestore() {
  return getFirestore(getFirebaseAdminApp());
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}
