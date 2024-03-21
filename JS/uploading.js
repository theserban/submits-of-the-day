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



    document.addEventListener('DOMContentLoaded', () => {
        // Adjust to use local date components
        const today = new Date();
        initializeFlatpickr();
        initializeThemeSwitcher();
        startCountdown();
        const localDateStr = today.getFullYear() +  '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
        document.getElementById('currentDate').textContent = today.toLocaleDateString();
        document.getElementById('datePicker').max = localDateStr;
        document.getElementById('datePicker').value = localDateStr;
        changeDate(localDateStr); // Initialize with stored or new colors for today
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.checked = savedTheme === 'dark';
        themeToggle.addEventListener('click', toggleTheme);
    });
    
    function initializeFlatpickr() {
        flatpickr("#datePicker", {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            defaultDate: new Date(),
            maxDate: new Date(),
            disableMobile: true,
            onChange: function(selectedDates, dateStr, instance) {
                fetchSubmissions(dateStr); // Call the updated fetch function
                adjustUploadAvailability(dateStr);
            }
        });
        document.querySelector("#datePicker").setAttribute("autocomplete", "nope");
    }
    
    function initializeThemeSwitcher() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.checked = savedTheme === 'dark';
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        const today = new Date();
        const localDateStr = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
        document.getElementById('currentDate').textContent = today.toLocaleDateString();
        document.getElementById('datePicker').max = localDateStr;
        document.getElementById('datePicker').value = localDateStr;
        changeDate(localDateStr);
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.checked = savedTheme === 'dark';
        themeToggle.addEventListener('click', toggleTheme);
    });
    
    document.addEventListener('DOMContentLoaded', function() {
        // Get the modal
        var modal = document.getElementById('uploadModal');
      
        // Get the button that opens the modal
        var btn = document.querySelector('.uploadButton');
      
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
      
        // When the user clicks the button, open the modal 
        btn.onclick = function() {
          modal.style.display = "block";
        }
      
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
          modal.style.display = "none";
        }
      
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        }
      });

    function saveToFirebase(description, imgUrl) {
        const submissionRef = ref(db, 'submissions/' + Date.now());
        set(submissionRef, { description: description, imgUrl: imgUrl, timestamp: Date.now(), votes: 0 });
    }
    
    // Reset form and modal after successful upload
    function resetForm() {
        imageInput.value = '';
        descriptionInput.value = '';
        uploadModal.style.display = "none";
        uploadSubmit.disabled = false; // Re-enable button after reset
        fetchSubmissions(); // Refresh the feed
    }

    function fetchSubmissions() {
        const submissionsRef = ref(db, 'submissions');
        get(submissionsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const submissionsContainer = document.querySelector('.submissionsContainer');
                submissionsContainer.innerHTML = '';
                const submissions = snapshot.val();
                const sortedKeys = Object.keys(submissions).sort((a, b) => (submissions[b].votes || 0) - (submissions[a].votes || 0));
                sortedKeys.forEach(key => {
                    const submission = submissions[key];
                    submissionsContainer.appendChild(createSubmissionElement(submission, key));
                });
            } else {
                console.log("No submissions found");
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    
    // Create submission element for display
    function createSubmissionElement(submission, key) {
        const submitContainer = document.createElement('div');
        submitContainer.classList.add('submitContainer');
        submitContainer.innerHTML = `
            <p class="submitDescription">${submission.description} <a href="${submission.imgUrl}" target="_blank" class="imgurLink">#view</a></p>
            <div class="submitItem">
                <img src="${submission.imgUrl}" alt="Uploaded Image" class="submitImage">
            </div>
    <div class="voteButtons">
    <button class="voteUp" id="voteUp-${key}">
            <svg class="feather" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
        </button>
        <span class="voteCount" id="voteCount-${key}">${submission.votes || 0}</span>
        <button class="voteDown" id="voteDown-${key}">
            <svg class="feather" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
        </button>
    </div>
        `;
        setTimeout(() => {
            document.getElementById(`voteUp-${key}`).addEventListener('click', () => updateVotes(key, true));
            document.getElementById(`voteDown-${key}`).addEventListener('click', () => updateVotes(key, false));
        }, 0);
    
        return submitContainer;
    }

    fetchSubmissions(); // Initial fetch to display existing submissions

    function updateVotes(key, isUpvote) {
        const previousVote = sessionStorage.getItem(`vote-${key}`);
        const newVote = isUpvote ? 'up' : 'down';
    
        // Determine the vote increment or decrement based on the new and previous votes
        let voteIncrement = 0;
        if (previousVote === 'up' && newVote === 'down') {
            // If they previously voted up and now vote down, decrement by 2
            voteIncrement = -2;
        } else if (previousVote === 'down' && newVote === 'up') {
            // If they previously voted down and now vote up, increment by 2
            voteIncrement = 2;
        } else if (!previousVote) {
            // If they haven't voted before, increment or decrement by 1
            voteIncrement = isUpvote ? 1 : -1;
        }
    
        if (voteIncrement !== 0) {
            const voteRef = ref(db, 'submissions/' + key + '/votes');
            get(voteRef).then((snapshot) => {
                if (snapshot.exists()) {
                    let currentVotes = snapshot.val() || 0;
                    currentVotes += voteIncrement;
                    set(voteRef, currentVotes);
    
                    // Update UI
                    document.getElementById(`voteCount-${key}`).innerText = currentVotes;
    
                    // Update session storage to reflect the new vote direction
                    sessionStorage.setItem(`vote-${key}`, newVote);
                }
            });
        } else {
            console.log('You are trying to vote the same way as before.');
        }
    }
    