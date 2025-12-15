import { Rocket, Apple } from "lucide-react";
import { navItems, workItems } from "../data/navigation";

const MobileNav = ({ isOpen, activeSection, onNavClick, onClose }) => {
  const handleNavClick = (id) => {
    onNavClick(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isOpen ? "open" : ""}`}>
        <ul className="mobile-nav-links" role="list">
          {navItems.slice(0, 2).map((item, index) => (
            <li
              key={item.id}
              role="listitem"
              style={{ "--delay": `${index * 0.05}s` }}
            >
              <button
                onClick={() => handleNavClick(item.id)}
                className={`mobile-nav-link ${activeSection === item.id ? "active" : ""}`}
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
                  className={`mobile-nav-link mobile-work-link ${activeSection === item.id ? "active" : ""}`}
                  aria-label={item.ariaLabel}
                  type="button"
                >
                  <span className="mobile-work-icon">
                    {item.id === "projects" ? (
                      <Rocket size={18} />
                    ) : (
                      <Apple size={18} />
                    )}
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
                className={`mobile-nav-link ${activeSection === item.id ? "active" : ""}`}
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
    </>
  );
};

export default MobileNav;
