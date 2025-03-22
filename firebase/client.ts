import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIeEIqVICeGBpcNdX0Ne9HVDdQNE2r8OQ",
  authDomain: "smartprep-243e0.firebaseapp.com",
  projectId: "smartprep-243e0",
  storageBucket: "smartprep-243e0.firebasestorage.app",
  messagingSenderId: "640390099212",
  appId: "1:640390099212:web:8c775484650ceb40c11929",
  measurementId: "G-926E2J5BRZ"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);