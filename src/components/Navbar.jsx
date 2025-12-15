import { useState, useEffect, useRef } from "react";
import { navItems } from "../data/navigation";
import WorkDropdown from "./WorkDropdown";
import MobileNav from "./MobileNav";
import "../styles/Navbar.css";

const Navbar = ({ activeSection, onNavClick, navbarRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleNavClick = (id) => {
    onNavClick(id);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const isWorkActive =
    activeSection === "projects" || activeSection === "macos-apps";

  return (
    <nav
      ref={navbarRef}
      className="navbar"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="navbar-container">
        <div className="navbar-logo">
          <button
            onClick={() => handleNavClick("hero")}
            aria-label="Steven ACZ - Go to homepage"
            className="logo-button"
          >
            StevenACZ
          </button>
        </div>

        {/* Desktop Navigation */}
        <ul className="navbar-links desktop-nav" role="list">
          {navItems.slice(0, 2).map((item) => (
            <li key={item.id} role="listitem">
              <button
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                aria-label={item.ariaLabel}
                aria-current={activeSection === item.id ? "page" : undefined}
                type="button"
              >
                {item.label}
              </button>
            </li>
          ))}

          <WorkDropdown
            isOpen={isDropdownOpen}
            isActive={isWorkActive}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
            onNavClick={handleNavClick}
            activeSection={activeSection}
            dropdownRef={dropdownRef}
          />

          {navItems.slice(2).map((item) => (
            <li key={item.id} role="listitem">
              <button
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                aria-label={item.ariaLabel}
                aria-current={activeSection === item.id ? "page" : undefined}
                type="button"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Hamburger Button */}
        <button
          className={`hamburger-btn ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          type="button"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <MobileNav
          isOpen={isMenuOpen}
          activeSection={activeSection}
          onNavClick={onNavClick}
          onClose={() => setIsMenuOpen(false)}
        />
      </div>
    </nav>
  );
};

export default Navbar;
