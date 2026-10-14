// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtcpFhboycc3C_ezCcx6GZ6P_axqcjqqE",
  authDomain: "fashion-fusion-ai.firebaseapp.com",
  projectId: "fashion-fusion-ai",
  storageBucket: "fashion-fusion-ai.appspot.com",
  messagingSenderId: "110401753147",
  appId: "1:110401753147:web:718303a24a5e7317c68c1e",
  measurementId: "G-4CY6PZPYQ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the initialized services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
