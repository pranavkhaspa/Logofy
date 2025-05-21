// Import Firebase & Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCXGsjgLZUgxGluGT1GNMFCCekavLT2PWQ",
    authDomain: "notes-da49c.firebaseapp.com",
    projectId: "notes-da49c",
    storageBucket: "notes-da49c.appspot.com",
    messagingSenderId: "647168311224",
    appId: "1:647168311224:web:16003f12896a82f43c994d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
