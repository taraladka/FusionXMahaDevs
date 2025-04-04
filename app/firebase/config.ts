// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// Only import analytics in client components
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCt1EZAcN-F6905GLpXhVa7_G3eQ4A-Upo",
  authDomain: "fusion-club-1456b.firebaseapp.com",
  projectId: "fusion-club-1456b",
  storageBucket: "fusion-club-1456b.firebasestorage.app",
  messagingSenderId: "20769116100",
  appId: "1:20769116100:web:1fcbbef4d9fd3fa6a05e91",
  measurementId: "G-FKJ8EEV21Y"
};

// Initialize Firebase
let app;
let analytics;

// Initialize Firebase safely for both server and client
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth and get a reference to the service
const auth = getAuth(app);

// Only initialize analytics in the browser environment in a function
// that will be called on the client side
const getFirebaseAnalytics = () => {
  if (typeof window !== 'undefined') {
    return getAnalytics(app);
  }
  return null;
};

export { app, auth, getFirebaseAnalytics }; 