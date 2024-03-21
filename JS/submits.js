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

function adjustCountdownVisibility(selectedDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    const isToday = today.getTime() === selectedDate.getTime();
    const countdownElement = document.getElementById('countdown');
    countdownElement.style.visibility = isToday ? 'visible' : 'hidden';
    countdownElement.style.opacity = isToday ? '1' : '0';
    countdownElement.style.pointerEvents = isToday ? 'auto' : 'none';
}

function startCountdown() {
    function updateCountdown() {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const msLeft = tomorrow - now;

        const hours = Math.floor(msLeft / (1000 * 60 * 60));
        const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((msLeft % (1000 * 60)) / 1000);

        document.getElementById('countdown').textContent = `Time left: ${hours}h ${minutes}m ${seconds}s`;
    }

    updateCountdown(); 
    setInterval(updateCountdown, 1000); // Update the countdown every second
}

function adjustUploadButtonVisibility() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize the time portion

    // Assuming you're using a date picker or similar to select a date
    const selectedDateStr = document.getElementById('datePicker').value;
    const selectedDate = new Date(selectedDateStr);
    selectedDate.setHours(0, 0, 0, 0); // Normalize

    const isToday = today.getTime() === selectedDate.getTime();
    const uploadButton = document.querySelector('.uploadButton');
    
    if (isToday) {
        uploadButton.style.display = ""; // Show the button if it's today
    } else {
        uploadButton.style.display = "none"; // Hide the button if it's not today
    }
}


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
        formData.append("description", `${description} #design #creativity #artcrawl #designer #designcrony `);

        fetch("https://api.imgur.com/3/image/", {
            method: "POST",
            headers: { Authorization: "Client-ID bf58c0f5b4ed673" }, // Use your actual Imgur Client-ID
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            const imgUrl = result.data.link;
            // When saving to Firebase, we omit the tags
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
        startCountdown();
        initializeFlatpickr();
        initializeThemeSwitcher();
        startCountdown();
        adjustUploadButtonVisibility();
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

    function saveToFirebase(description, imgUrl) {
        const submissionRef = ref(db, 'submissions/' + Date.now());
        set(submissionRef, { description: description, imgUrl: imgUrl, timestamp: Date.now(), votes: 0 });
    }

    function initializeFlatpickr() {
        flatpickr("#datePicker", {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            defaultDate: new Date(),
            maxDate: new Date(),
            disableMobile: true,
            onChange: function(selectedDates, dateStr, instance) {
                // Convert the selected date string to a Date object
                const selectedDate = new Date(dateStr);
                // Now call adjustCountdownVisibility with the correct argument
                adjustCountdownVisibility(selectedDate);
                adjustUploadButtonVisibility(); // Check when date is changed
                fetchSubmissions(dateStr); // Continue with fetching submissions
            }
        });
    }
    
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

    
    // Reset form and modal after successful upload
    function resetForm() {
        imageInput.value = '';
        descriptionInput.value = '';
        uploadModal.style.display = "none";
        uploadSubmit.disabled = false; // Re-enable button after reset
        fetchSubmissions(); // Refresh the feed
    }

    function fetchSubmissions(selectedDateString = null) {
        const submissionsContainer = document.querySelector('.submissionsContainer');
        submissionsContainer.innerHTML = ''; // Clear existing submissions
    
        // Use today's date if no date is selected, or use the selected date
        const date = selectedDateString ? new Date(selectedDateString) : new Date();
        date.setHours(0, 0, 0, 0); // Set to start of the day for consistency
    
        // Reference to the submissions node in Firebase
        const submissionsRef = ref(db, 'submissions');
    
        // Fetch all submissions
        get(submissionsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const submissions = snapshot.val();
                // Convert submissions object to an array and filter by selected date
                const submissionsArray = Object.keys(submissions).map(key => ({
                    ...submissions[key],
                    key: key
                })).filter(submission => {
                    const submissionDate = new Date(submission.timestamp);
                    submissionDate.setHours(0, 0, 0, 0);
                    return date.getTime() === submissionDate.getTime();
                });
    
                // Sort the filtered submissions by votes in descending order
                submissionsArray.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    
                // Append sorted submissions to the DOM
                submissionsArray.forEach(submission => {
                    submissionsContainer.appendChild(createSubmissionElement(submission, submission.key));
                });
            } else {
                console.log("No submissions found for the selected date.");
            }
        }).catch((error) => {
            console.error("Error fetching submissions: ", error);
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
    