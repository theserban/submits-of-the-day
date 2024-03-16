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