// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA8gVCBuREFQHQxruTBiAvMNSO8a6hH84Q",
    authDomain: "pokemon-card-collection-bbfc4.firebaseapp.com",
    projectId: "pokemon-card-collection-bbfc4",
    storageBucket: "pokemon-card-collection-bbfc4.firebasestorage.app",
    messagingSenderId: "935678885059",
    appId: "1:935678885059:web:c7b8fa1a5d7dc648287676"
};

// ✅ Inizializza Firebase PRIMA di esportare
const app = initializeApp(firebaseConfig);

// ✅ Esporta le istanze, non le funzioni
export const auth = getAuth(app);
export const db = getFirestore(app);

// ✅ NON importare altri file del progetto qui
