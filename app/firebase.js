import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAqcCPrJjrie4VKGQUsn3YBwpFCMjTmyUE",
  authDomain: "tabadol-4a980.firebaseapp.com",
  projectId: "tabadol-4a980",
  storageBucket: "tabadol-4a980.firebasestorage.app",
  messagingSenderId: "715596728770",
  appId: "1:715596728770:web:13e583dd93c8637cb86e5b",
  measurementId: "G-FRNN1073D3"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير الأدوات لاستخدامها في مشروعك
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
