// Get theme toggle button and icons
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Check local storage for theme preference
let currentTheme = localStorage.getItem('theme');

// If no theme preference exists, set default to light
if (!currentTheme) {
    currentTheme = 'light';
    localStorage.setItem('theme', 'light');
}

// Apply stored theme
if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
    themeToggleLightIcon.classList.remove('hidden');
    themeToggleDarkIcon.classList.add('hidden');
} else {
    document.documentElement.classList.remove('dark');
    themeToggleDarkIcon.classList.remove('hidden');
    themeToggleLightIcon.classList.add('hidden');
}

// Theme toggle button click handler
themeToggleBtn.addEventListener('click', function() {
    // Toggle icons
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // Toggle dark class on html element
    document.documentElement.classList.toggle('dark');

    // Update local storage
    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});
