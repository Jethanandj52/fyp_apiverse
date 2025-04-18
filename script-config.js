// Import Firebase core and authentication
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  
 } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6jaYK4e7LFtqzycT-KO5sDYi7ipWf4oA",
  authDomain: "api-verse-dc2bc.firebaseapp.com",
  projectId: "api-verse-dc2bc",
  storageBucket: "api-verse-dc2bc.appspot.com",  // corrected from firebasestorage.app
  messagingSenderId: "692038670622",
  appId: "1:692038670622:web:3ed37cf8f741078bb8910f",
  measurementId: "G-9YF1DR0SFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Authentication
const auth = getAuth(app);

 export {
    getAuth,
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
 }
