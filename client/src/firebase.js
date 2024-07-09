// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realstate-61095.firebaseapp.com",
  projectId: "realstate-61095",
  storageBucket: "realstate-61095.appspot.com",
  messagingSenderId: "450206731398",
  appId: "1:450206731398:web:e03adabb0664a6e1989507"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { app, auth };
