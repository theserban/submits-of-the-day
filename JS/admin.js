// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  //Your Firebase Config
};

// Initialize Firebase and services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app); // Ensure auth is initialized with the app instance
auth.languageCode = 'en'; // Set default language for auth

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  client_id: '' // Replace with your actual web client ID
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

function googleSignOut() {
    signOut(auth).then(() => {
        console.log('Sign-out successful.');
        // Refresh the page after successful sign-out
        window.location.reload();
    }).catch((error) => {
        console.error('Sign-out error', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const googleLoginButton = document.getElementById('google-login');
    const googleLogoutButton = document.getElementById('google-logout'); 
    const loginDescription = document.querySelector('.description.login');
    const logoutDescription = document.querySelector('.description.logout');


    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', googleSignIn);
    }
    
    if (googleLogoutButton) {
        googleLogoutButton.addEventListener('click', googleSignOut);
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            
            logoutDescription.style.display = 'block'; 
            loginDescription.style.display = 'none';
        } else {
           
            logoutDescription.style.display = 'none';
            loginDescription.style.display = 'block'; 
        }
        
    });
});

onAuthStateChanged(auth, (user) => {
    const uploadButton = document.querySelector('.uploadButton');
    if (user) {
      // User is logged in
      uploadButton.style.display = ''; // Show the button
    } else {
      // User is not logged in
      uploadButton.style.display = 'none'; // Hide the button
    }
  });