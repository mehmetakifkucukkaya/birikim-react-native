import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase yapılandırma nesnesi
const firebaseConfig = {
    projectId: "birikim-bf2ed",
    appId: "1:482363885754:web:709a44b0ad6fcdf8e1da83",
    storageBucket: "birikim-bf2ed.firebasestorage.app",
    apiKey: "AIzaSyC7nSMvD7cbHGr0EmnX5uI0PpCvj72wLok",
    authDomain: "birikim-bf2ed.firebaseapp.com",
    messagingSenderId: "482363885754",
    measurementId: "G-R01DZYG0ZZ"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firestore database referansını al
const db = getFirestore(app);

export { db };

