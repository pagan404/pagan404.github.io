import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = () => setMobileOpen(!mobileOpen);

  const closeMenu = () => setMobileOpen(false);

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      const navLinks = document.querySelector(".nav-links");
      const toggle = document.querySelector(".mobile-menu-toggle");

      if (
        toggle &&
        navLinks &&
        !toggle.contains(event.target) &&
        !navLinks.contains(event.target)
      ) {
        setMobileOpen(false);
      }
    };

    // Close mobile menu when resized to desktop
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <button className="mobile-menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`nav-links ${mobileOpen ? "mobile-open" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={closeMenu}
        >
          Home
        </NavLink>
        <NavLink
          to="/encodings"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={closeMenu}
        >
          Encodings
        </NavLink>
        <NavLink
          to="/workshop"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={closeMenu}
        >
          Workshop
        </NavLink>
      </div>
    </>
  );
}

export default Navigation;
