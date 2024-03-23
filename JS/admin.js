// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCn9OwLaTiuMBQg5VcBqIZe1TuU_J_yZh0",
  authDomain: "submit-cronies.firebaseapp.com",
  databaseURL: "https://submit-cronies-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "submit-cronies",
  storageBucket: "submit-cronies.appspot.com",
  messagingSenderId: "6576848992",
  appId: "1:6576848992:web:afcabfac033ee76fec4305",
  measurementId: "G-ZPLQ97XYTK"
};

// Initialize Firebase and services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app); // Ensure auth is initialized with the app instance
auth.languageCode = 'en'; // Set default language for auth

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  client_id: '6576848992-tfjhi3b4bgq8dn5qd2ataeepdd51cgcp.apps.googleusercontent.com' // Replace with your actual web client ID
});

// Function to handle Google sign-in
function googleSignIn() {
    signInWithPopup(auth, provider)
    .then((result) => {
        // Handle the signed-in user information
        console.log('Sign-in successful.');
    }).catch((error) => {
        // Handle errors here
        console.error('SignIn error', error);
    });
}

// Auth state change listener to toggle .voteUp, .voteDown, .uploadButton visibility
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        const actionElements = document.querySelectorAll('.voteUp, .voteDown, .uploadButton');
      
        if (user) {
            // User is signed in, show the buttons
            actionElements.forEach(element => element.style.display = '');
        } else {
            // No user is signed in, keep the buttons hidden
            actionElements.forEach(element => element.style.display = 'none');
        }
    });

    const googleLoginButton = document.getElementById('google-login');
    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', googleSignIn);
    }
});
