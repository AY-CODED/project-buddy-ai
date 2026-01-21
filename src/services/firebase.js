import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBw6ovOKDyfMuZyk4nJb7SLmXF4DVBu5mY",
  authDomain: "projectbuddyai.firebaseapp.com",
  projectId: "projectbuddyai",
  storageBucket: "projectbuddyai.firebasestorage.app",
  messagingSenderId: "33864885665",
  appId: "1:33864885665:web:d35b7a595764cd9e2a57e0",
  measurementId: "G-H52SFZ7GPN"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app); // Export db