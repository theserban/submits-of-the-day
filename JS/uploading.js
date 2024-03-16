// Initialize Firebase and Firebase services
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import { getDatabase, set, ref, get } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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

// Firebase app initialization
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
auth.languageCode = 'en'
const googleLogin = document.getElementById("google-login");


// DOMContentLoaded to ensure the DOM is fully loaded before interacting with itdocument.addEventListener('DOMContentLoaded', function() {
    // Modal setup
    var modal = document.getElementById('uploadModal');
    var btn = document.querySelector('.uploadButton');
    var span = document.getElementsByClassName("close")[0];

    // Open and close modal logic
    btn.onclick = function() { modal.style.display = "block"; }
    span.onclick = function() { modal.style.display = "none"; }
    window.onclick = function(event) { if (event.target == modal) { modal.style.display = "none"; } }

    // Upload form elements
    const imageInput = document.getElementById('imageInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const uploadSubmit = document.getElementById('uploadSubmit');
    
    // Enable upload button only if a file is selected and description is not empty
    function toggleUploadButtonState() {
        const file = imageInput.files[0];
        const description = descriptionInput.value.trim();
        uploadSubmit.disabled = !(file && description);
    }
    
    // Preview image logic
    imageInput.addEventListener('change', toggleUploadButtonState);
    descriptionInput.addEventListener('input', toggleUploadButtonState);

    // Handle upload submission
    uploadSubmit.addEventListener('click', function() {
        const file = imageInput.files[0];
        const description = descriptionInput.value.trim();
        
        if (file && description) {
            uploadSubmit.disabled = true; // Disable button to prevent multiple uploads
            
            const formData = new FormData();
            formData.append("image", file);
            formData.append("description", description);

            // Imgur API call
            fetch("https://api.imgur.com/3/image/", {
                method: "POST",
                headers: { Authorization: "Client-ID bf58c0f5b4ed673" }, // Replace with your actual Imgur Client-ID
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                const imgUrl = result.data.link;
                saveToFirebase(description, imgUrl);
                resetForm();
            })
            .catch(error => {
                console.error('Error uploading image to Imgur:', error);
                uploadSubmit.disabled = false; // Re-enable button on error
            });
        }
    });

    // Save upload details to Firebase
    function saveToFirebase(description, imgUrl) {
        const submissionRef = ref(db, 'submissions/' + Date.now());
        set(submissionRef, { description: description, imgUrl: imgUrl, timestamp: Date.now() });
    }

    // Reset form and modal after successful upload
    function resetForm() {
        imageInput.value = '';
        descriptionInput.value = '';
        uploadModal.style.display = "none";
        uploadSubmit.disabled = false; // Re-enable button after reset
        fetchSubmissions(); // Refresh the feed
    }

    // Fetch and display submissions from Firebase
    function fetchSubmissions() {
        const submissionsRef = ref(db, 'submissions');
        get(submissionsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const submissionsContainer = document.querySelector('.submissionsContainer');
                submissionsContainer.innerHTML = ''; // Clear previous submissions
                
                const submissions = snapshot.val();
                Object.keys(submissions).forEach(key => {
                    const submission = submissions[key];
                    submissionsContainer.appendChild(createSubmissionElement(submission));
                });
            } else {
                console.log("No submissions found");
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    // Create submission element for display
    function createSubmissionElement(submission) {
        const submitContainer = document.createElement('div');
        submitContainer.classList.add('submitContainer');
        submitContainer.innerHTML = `
            <p class="submitDescription">${submission.description} <a href="${submission.imgUrl}" target="_blank" class="imgurLink">#view</a></p>
            <div class="submitItem">
                <img src="${submission.imgUrl}" alt="Uploaded Image" class="submitImage">
            </div>
    <div class="voteButtons">
        <button class="voteUp">
            <svg class="feather" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
        </button>
        <span class="voteCount">0</span>
        <button class="voteDown">
            <svg class="feather" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
        </button>
    </div>
        `;
        return submitContainer;
    }

    fetchSubmissions(); // Initial fetch to display existing submissions