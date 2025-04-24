// Import Firebase core and modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    deleteUser,
    signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    getDoc,
    query, where
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyA6jaYK4e7LFtqzycT-KO5sDYi7ipWf4oA",
    authDomain: "api-verse-dc2bc.firebaseapp.com",
    projectId: "api-verse-dc2bc",
    storageBucket: "api-verse-dc2bc.appspot.com",
    messagingSenderId: "692038670622",
    appId: "1:692038670622:web:3ed37cf8f741078bb8910f",
    measurementId: "G-9YF1DR0SFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Auth & Firestore instances
const auth = getAuth(app);
const db = getFirestore(app);

// Export all necessary functions and instances
export {
    auth,
    getAuth,
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    deleteUser,
    doc,
    setDoc,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    getDoc,
    signOut,
    query, where, onAuthStateChanged,
    getFirestore
};










