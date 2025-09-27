// Get the main container element
const toggleElement = document.getElementById('ourStoryToggle');

// Add a click listener to the element
toggleElement.addEventListener('click', function() {
    // Toggles the 'active' class on the '.our-story' div
    // If 'active' is present, it removes it (collapse).
    // If 'active' is absent, it adds it (expand).
    this.classList.toggle('active');
});





