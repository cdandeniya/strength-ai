// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6x94KHzrEOyQZuiZpEreQyCKRqmYnuLI",
  authDomain: "strength-ai.firebaseapp.com",
  projectId: "strength-ai",
  storageBucket: "strength-ai.firebasestorage.app",
  messagingSenderId: "624166614882",
  appId: "1:624166614882:web:9fe42298841f317bad9e3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);