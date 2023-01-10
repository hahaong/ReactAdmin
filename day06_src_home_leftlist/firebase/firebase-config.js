// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyA0PUcQLghoJFx4umTe5nhK7oHNb_7nPCM",
  authDomain: "alpr-d98ed.firebaseapp.com",
  projectId: "alpr-d98ed",
  storageBucket: "alpr-d98ed.appspot.com",
  messagingSenderId: "782106956013",
  appId: "1:782106956013:web:39334c2373ee4e4872bce4",
  measurementId: "G-WH5C6ZC8VG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


export const authentication = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

