// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8gVCBuREFQHQxruTBiAvMNSO8a6hH84Q",
  authDomain: "pokemon-card-collection-bbfc4.firebaseapp.com",
  projectId: "pokemon-card-collection-bbfc4",
  storageBucket: "pokemon-card-collection-bbfc4.firebasestorage.app",
  messagingSenderId: "935678885059",
  appId: "1:935678885059:web:c7b8fa1a5d7dc648287676"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);