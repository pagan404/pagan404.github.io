// Navigation functionality shared across all pages
function toggleMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('mobile-open');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navLinks = document.getElementById('nav-links');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (!toggle.contains(event.target) && !navLinks.contains(event.target)) {
        navLinks.classList.remove('mobile-open');
    }
});

// Close mobile menu when window is resized to desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.getElementById('nav-links').classList.remove('mobile-open');
    }
});
