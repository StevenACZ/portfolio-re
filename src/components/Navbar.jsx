import React from 'react';
import '../styles/Navbar.css';

const Navbar = ({ activeSection, onNavClick, navbarRef, isPending }) => {
  const navItems = [
    { id: 'hero', label: 'Home', ariaLabel: 'Go to homepage' },
    { id: 'projects', label: 'Projects', ariaLabel: 'View my projects' },
    { id: 'timeline', label: 'Experience', ariaLabel: 'View my experience' },
    { id: 'footer', label: 'Contact', ariaLabel: 'Contact information' },
  ];

  return (
    <nav 
      ref={navbarRef} 
      className={`navbar ${isPending ? 'navbar-pending' : ''}`}
      role="navigation" 
      aria-label="Main navigation"
    >
      
      <div className="navbar-container">
        <div className="navbar-logo">
          <button 
            onClick={() => onNavClick('hero')}
            aria-label="Steven ACZ - Go to homepage"
            className="logo-button"
          >
            StevenACZ
          </button>
        </div>
        <ul className="navbar-links" role="list">
          {navItems.map((item) => (
            <li key={item.id} role="listitem">
              <button
                onClick={() => onNavClick(item.id)}
                className={`nav-link ${
                  activeSection === item.id ? 'active' : ''
                } ${isPending ? 'pending' : ''}`}
                aria-label={item.ariaLabel}
                aria-current={activeSection === item.id ? 'page' : undefined}
                type="button"
                disabled={isPending}
              >
                {item.label}
                {isPending && <span className="nav-loading" aria-hidden="true">…</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
