import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "twitter-397321.firebaseapp.com",
  projectId: "twitter-397321",
  storageBucket: "twitter-397321.appspot.com",
  messagingSenderId: "407442080727",
  appId: "1:407442080727:web:abfc42ae986c0e268d4192",
  measurementId: "G-P6GRBRRP3C"
};

export const app = initializeApp(firebaseConfig);