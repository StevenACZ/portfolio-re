import React from 'react';

const Navbar = ({ activeSection, onNavClick, navbarRef }) => {
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'timeline', label: 'Experience' },
    { id: 'footer', label: 'Contact' },
  ];

  return (
    <nav ref={navbarRef} className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span onClick={() => onNavClick('hero')}>StevenACZ</span>
        </div>
        <div className="navbar-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`nav-link ${
                activeSection === item.id ? 'active' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
