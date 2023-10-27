// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-dc65a.firebaseapp.com",
  projectId: "mern-auth-dc65a",
  storageBucket: "mern-auth-dc65a.appspot.com",
  messagingSenderId: "1032216718024",
  appId: "1:1032216718024:web:689ae3f43457009b8353fd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);