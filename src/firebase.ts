import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDr1JDluMTasyUC62_wNcI06VpMyynAjoo",
  authDomain: "probable-container-xgtt6.firebaseapp.com",
  projectId: "probable-container-xgtt6",
  storageBucket: "probable-container-xgtt6.firebasestorage.app",
  messagingSenderId: "1031901313643",
  appId: "1:1031901313643:web:2faf8348dfa933c1f40f2e"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the specific named database ID
export const db = getFirestore(app, "ai-studio-youthfootballpla-7fc029c3-baef-4c58-a4d9-e6f70dace940");
