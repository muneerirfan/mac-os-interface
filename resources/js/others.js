// Toggle dropdown visibility
function toggleDropdown(id) {
    // Close all other dropdowns first
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        if (dropdown.id !== id) {
            dropdown.classList.remove('active');
        }
    });
    
    // Toggle the clicked dropdown
    const dropdown = document.getElementById(id);
    dropdown.classList.toggle('active');
}

// Close dropdowns when clicking elsewhere
document.addEventListener('click', function(event) {
    if (!event.target.closest('.menu-item') && !event.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Update time and date
function updateTimeDate() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const dateStr = now.toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'});
    
    document.getElementById('time-display').textContent = timeStr;
    document.getElementById('date-display').textContent = dateStr;
}

// Update time every minute
updateTimeDate();
setInterval(updateTimeDate, 60000);