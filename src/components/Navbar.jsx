import { useState, useEffect } from "react";
import "../styles/Navbar.css";

const Navbar = ({ activeSection, onNavClick, navbarRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "hero", label: "Home", ariaLabel: "Go to homepage" },
    { id: "skills", label: "Skills", ariaLabel: "View my technical skills" },
    { id: "projects", label: "Projects", ariaLabel: "View my projects" },
    { id: "timeline", label: "Experience", ariaLabel: "View my experience" },
    { id: "footer", label: "Contact", ariaLabel: "Contact information" },
  ];

  // Close menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
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
  };

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
          {navItems.map((item) => (
            <li key={item.id} role="listitem">
              <button
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${
                  activeSection === item.id ? "active" : ""
                }`}
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

        {/* Mobile Menu Overlay */}
        <div
          className={`mobile-menu-overlay ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMenuOpen ? "open" : ""}`}>
          <ul className="mobile-nav-links" role="list">
            {navItems.map((item, index) => (
              <li
                key={item.id}
                role="listitem"
                style={{ "--delay": `${index * 0.05}s` }}
              >
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`mobile-nav-link ${
                    activeSection === item.id ? "active" : ""
                  }`}
                  aria-label={item.ariaLabel}
                  aria-current={activeSection === item.id ? "page" : undefined}
                  type="button"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
