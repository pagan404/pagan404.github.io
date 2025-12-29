// Navigation functionality shared across all pages
export function toggleMobileMenu() {
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("mobile-open");
}

// Close mobile menu when clicking outside
document.addEventListener("click", function (event) {
  const navLinks = document.getElementById("nav-links");
  const toggle = document.querySelector(".mobile-menu-toggle");

  if (!toggle.contains(event.target) && !navLinks.contains(event.target)) {
    navLinks.classList.remove("mobile-open");
  }
});

// Close mobile menu when window is resized to desktop
addEventListener("resize", function () {
  if (innerWidth > 768) {
    document.getElementById("nav-links").classList.remove("mobile-open");
  }
});

// Handle the mobile menu button click
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".mobile-menu-toggle");
  if (toggle) {
    toggle.addEventListener("click", toggleMobileMenu);
  }
});
