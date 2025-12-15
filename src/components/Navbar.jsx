import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import "../styles/Navbar.css";

const Navbar = ({ activeSection, onNavClick, navbarRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { id: "hero", label: "Home", ariaLabel: "Go to homepage" },
    { id: "skills", label: "Skills", ariaLabel: "View my technical skills" },
    { id: "timeline", label: "Experience", ariaLabel: "View my experience" },
    { id: "footer", label: "Contact", ariaLabel: "Contact information" },
  ];

  const workItems = [
    { id: "projects", label: "Projects", ariaLabel: "View my projects" },
    {
      id: "macos-apps",
      label: "macOS Apps",
      ariaLabel: "View my macOS applications",
    },
  ];

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

          {/* Work Dropdown */}
          <li
            role="listitem"
            className="nav-dropdown-wrapper"
            ref={dropdownRef}
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`nav-link nav-dropdown-trigger ${
                isWorkActive ? "active" : ""
              } ${isDropdownOpen ? "open" : ""}`}
              aria-label="View my work"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              type="button"
            >
              <span>Work</span>
              <ChevronDown
                size={16}
                className={`dropdown-chevron ${
                  isDropdownOpen ? "rotated" : ""
                }`}
              />
            </button>

            <div className={`nav-dropdown ${isDropdownOpen ? "open" : ""}`}>
              <div className="nav-dropdown-content">
                {workItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`nav-dropdown-item ${
                      activeSection === item.id ? "active" : ""
                    }`}
                    aria-label={item.ariaLabel}
                    type="button"
                  >
                    <span className="dropdown-item-icon">
                      {item.id === "projects" ? "🚀" : "🍎"}
                    </span>
                    <span className="dropdown-item-text">
                      <span className="dropdown-item-label">{item.label}</span>
                      <span className="dropdown-item-desc">
                        {item.id === "projects"
                          ? "Featured projects"
                          : "Native Mac apps"}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </li>

          {navItems.slice(2).map((item) => (
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
            {navItems.slice(0, 2).map((item, index) => (
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

            {/* Mobile Work Section */}
            <li
              role="listitem"
              className="mobile-work-section"
              style={{ "--delay": "0.1s" }}
            >
              <span className="mobile-section-label">Work</span>
              <div className="mobile-work-items">
                {workItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`mobile-nav-link mobile-work-link ${
                      activeSection === item.id ? "active" : ""
                    }`}
                    aria-label={item.ariaLabel}
                    type="button"
                  >
                    <span className="mobile-work-icon">
                      {item.id === "projects" ? "🚀" : "🍎"}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </li>

            {navItems.slice(2).map((item, index) => (
              <li
                key={item.id}
                role="listitem"
                style={{ "--delay": `${(index + 3) * 0.05}s` }}
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
