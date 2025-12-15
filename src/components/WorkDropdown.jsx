import { ChevronDown, Rocket, Apple } from "lucide-react";
import { workItems } from "../data/navigation";

const WorkDropdown = ({
  isOpen,
  isActive,
  onToggle,
  onNavClick,
  activeSection,
  dropdownRef,
}) => {
  return (
    <li role="listitem" className="nav-dropdown-wrapper" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`nav-link nav-dropdown-trigger ${isActive ? "active" : ""} ${isOpen ? "open" : ""}`}
        aria-label="View my work"
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        <span>Work</span>
        <ChevronDown
          size={16}
          className={`dropdown-chevron ${isOpen ? "rotated" : ""}`}
        />
      </button>

      <div className={`nav-dropdown ${isOpen ? "open" : ""}`}>
        <div className="nav-dropdown-content">
          {workItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`nav-dropdown-item ${activeSection === item.id ? "active" : ""}`}
              aria-label={item.ariaLabel}
              type="button"
            >
              <span className="dropdown-item-icon">
                {item.id === "projects" ? (
                  <Rocket size={18} />
                ) : (
                  <Apple size={18} />
                )}
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
  );
};

export default WorkDropdown;
