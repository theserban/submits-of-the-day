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
            loadSubmissionsForDate(dateStr); // Function to load submissions
            adjustUploadAvailability(dateStr); // Adjust upload availability based on selected date
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

function startCountdown() {
    function updateCountdown() {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const msLeft = tomorrow - now; // Milliseconds until midnight

        const hours = Math.floor(msLeft / (1000 * 60 * 60));
        const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((msLeft % (1000 * 60)) / 1000);

        document.getElementById('countdown').textContent = `Time left: ${hours}h ${minutes}m ${seconds}s`;
        if (msLeft <= 1000) {
            clearInterval(countdownInterval); // Stop the countdown
            changeDate(tomorrow.toISOString().split('T')[0]); // Update colors for the new day
        }
    }

    const countdownInterval = setInterval(updateCountdown, 1000); // Update countdown every second
    updateCountdown(); // Initialize countdown immediately
}

document.addEventListener('DOMContentLoaded', startCountdown);

function updateCountdown() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msLeft = tomorrow - now; // Milliseconds until midnight

    const hours = Math.floor(msLeft / (1000 * 60 * 60));
    const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((msLeft % (1000 * 60)) / 1000);

    document.getElementById('countdown').textContent = `Time left: ${hours}h ${minutes}m ${seconds}s`;

    // Check if it's time to update to a new day
    if (msLeft <= 1000) {
        clearInterval(countdownInterval); // Stop the countdown
        // Recalculate the date to ensure it's the next day
        const nextDay = new Date();
        nextDay.setDate(now.getDate() + 1); // Increment the day
        const localDateStr = nextDay.getFullYear() + '-' + (nextDay.getMonth() + 1).toString().padStart(2, '0') + '-' + nextDay.getDate().toString().padStart(2, '0');
        changeDate(localDateStr); // Update colors for the new day
    }
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

function loadSubmissionsForDate(dateStr) {
    const appContainer = document.querySelector('.submissionsContainer');
    appContainer.innerHTML = '';

    const submissionsQuery = collection(db, 'submissions');
    const filteredSubmissions = query(submissionsQuery, where('date', '==', dateStr));

    getDocs(filteredSubmissions)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const submission = doc.data();
                const submitContainer = createSubmissionElement(submission, doc.id);
                appContainer.appendChild(submitContainer);
            });
        })
        .catch((error) => {
            console.error('Error fetching submissions: ', error);
        });
}

function adjustUploadAvailability(dateStr) {
    const today = new Date().toISOString().slice(0, 10); // Format today's date as 'YYYY-MM-DD'
    const uploadButton = document.getElementById('uploadSubmit');
    uploadButton.disabled = dateStr !== today;
}

document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const uploadSubmit = document.getElementById('uploadSubmit');
    const uploadModal = document.getElementById('uploadModal');

    // Function to check input states and toggle the button's disabled state
    function toggleUploadButtonState() {
        const file = imageInput.files[0];
        const description = descriptionInput.value.trim();
        uploadSubmit.disabled = !(file && description);
    
        // Create image preview
        const imagePreviewElement = document.getElementById('imagePreview');
        imagePreviewElement.innerHTML = '';
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const previewImage = document.createElement('img');
            previewImage.src = imageUrl;
            previewImage.classList.add('previewImage');
            imagePreviewElement.appendChild(previewImage);
        }
    }

    imageInput.addEventListener('change', toggleUploadButtonState);
    descriptionInput.addEventListener('input', toggleUploadButtonState);

    uploadSubmit.addEventListener('click', function() {
        const file = imageInput.files[0];
        const description = descriptionInput.value.trim();
    
        if (file && description) {
            // Disable the upload button to prevent multiple clicks
            uploadSubmit.disabled = true;
    
            const formData = new FormData();
            formData.append("image", file);
            formData.append("description", `${description} #testeeen`);
    
            fetch("https://api.imgur.com/3/image/", {
                method: "POST",
                headers: {
                    Authorization: "Client-ID bf58c0f5b4ed673"
                },
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                const imgUrl = result.data.link;
                const descriptionWithLink = `${description} <a href="${imgUrl}" target="_blank" class="imgurLink" id="links">#testeen</a>`;
                const appContainer = document.querySelector('.submissionsContainer');
                const submitContainer = createSubmissionElement(result.data, descriptionWithLink);
                appContainer.appendChild(submitContainer);
    
                // Reset and close modal
                imageInput.value = '';
                descriptionInput.value = '';
                const imagePreviewElement = document.getElementById('imagePreview');
                imagePreviewElement.innerHTML = '';
                uploadModal.style.display = "none";
            })
            .catch(error => {
                console.error('Error uploading image to Imgur:', error);
            })
            .finally(() => {
                // Re-enable the upload button after the upload is complete or encounters an error
                uploadSubmit.disabled = false;
            });
        }
    });
});

function createSubmissionElement(submission, descriptionWithLink) {
    const submitContainer = document.createElement('div');
    submitContainer.classList.add('submitContainer');

    submitContainer.innerHTML = `
    <p class="submitDescription">${descriptionWithLink}</p>
    <div class="submitItem">
        <img src="${submission.link}" alt="Uploaded Image" class="submitImage">
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

    // Handle vote buttons
    const voteUpButton = submitContainer.querySelector('.voteUp');
    const voteDownButton = submitContainer.querySelector('.voteDown');
    const voteCountElement = submitContainer.querySelector('.voteCount');

    let voteCount = 0;
    let userVotes = {};
    voteCountElement.textContent = voteCount;

    const submissionId = Date.now(); // Use a unique identifier for each submission
    submitContainer.setAttribute('data-id', submissionId);
    votes[submissionId] = 0; // Initialize the vote count for this submission to 0

    voteUpButton.addEventListener('click', () => {
        const submissionId = submitContainer.getAttribute('data-id');
        if (userVotes[submissionId] !== 1) { // Check if the user hasn't already upvoted
            const previousVoteCount = votes[submissionId] || 0;
            if (userVotes[submissionId] === -1) { // If the user has previously downvoted, undo the downvote
                voteCount += 2; // Increment by 2 since we're undoing a downvote
                votes[submissionId] += 2;
            } else {
                voteCount++;
                votes[submissionId]++;
            }
            userVotes[submissionId] = 1; // Set the user's vote to upvote
            voteCountElement.textContent = voteCount;
            if (votes[submissionId] !== previousVoteCount) {
                sortPosts();
            }
        }
    });

    voteDownButton.addEventListener('click', () => {
        const submissionId = submitContainer.getAttribute('data-id');
        if (userVotes[submissionId] !== -1) { // Check if the user hasn't already downvoted
            const previousVoteCount = votes[submissionId] || 0;
            if (userVotes[submissionId] === 1) { // If the user has previously upvoted, undo the upvote
                voteCount -= 2; // Decrement by 2 since we're undoing an upvote
                votes[submissionId] -= 2;
            } else {
                voteCount--;
                votes[submissionId]--;
            }
            userVotes[submissionId] = -1; // Set the user's vote to downvote
            voteCountElement.textContent = voteCount;
            if (votes[submissionId] !== previousVoteCount) {
                sortPosts();
            }
        }
    });

    return submitContainer;
}

let votes = {};

function sortPosts() {
    const appContainer = document.querySelector('.submissionsContainer');
    const submitContainers = Array.from(appContainer.querySelectorAll('.submitContainer'));

    // Sort the posts based on their vote counts
    submitContainers.sort((a, b) => {
        const aVotes = votes[a.getAttribute('data-id')] || 0;
        const bVotes = votes[b.getAttribute('data-id')] || 0;
        return bVotes - aVotes; // Descending order (highest votes first)
    });

    // Check if the order has changed before animating
    const hasOrderChanged = !submitContainers.every((container, index) => {
        return container === appContainer.children[index];
    });

    if (hasOrderChanged) {
        // Reorder the posts in the DOM with animations
        submitContainers.forEach((container, index) => {
            container.style.transform = `translateY(${index * 100}%)`;
            setTimeout(() => {
                appContainer.appendChild(container);
                container.style.transform = '';
            }, 0); // Set a minimal delay to trigger the animation
        });
    }
} 