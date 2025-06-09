import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD618XZZNEkEHlbgCZ_dWbPn3DAG6hxjKc",
  authDomain: "examprep-aea73.firebaseapp.com",
  projectId: "examprep-aea73",
  storageBucket: "examprep-aea73.firebasestorage.app",
  messagingSenderId: "352855072535",
  appId: "1:352855072535:web:e9f29072bbb2e5b751a152"
};

// Only initialize the app if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();