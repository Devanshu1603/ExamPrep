// src/config/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD618XZZNEkEHlbgCZ_dWbPn3DAG6hxjKc",
  authDomain: "examprep-aea73.firebaseapp.com",
  projectId: "examprep-aea73",
  storageBucket: "examprep-aea73.firebasestorage.app",
  messagingSenderId: "352855072535",
  appId: "1:352855072535:web:e9f29072bbb2e5b751a152"
};

// Robust Firebase app initialization that handles HMR
let app;
try {
  app = getApp();
} catch (error) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };