import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = ({ footerRef }) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: 'mailto:scoaila@proton.me',
      icon: Mail,
      label: 'scoaila@proton.me',
      isEmail: true,
    },
    {
      href: 'https://www.linkedin.com/in/stevenacz/',
      icon: Linkedin,
      label: 'LinkedIn',
      isExternal: true,
    },
    {
      href: 'https://github.com/StevenACZ',
      icon: Github,
      label: 'GitHub',
      isExternal: true,
    },
  ];

  return (
    <footer ref={footerRef} className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3>Let&apos;s work together!</h3>
            <p>
              I&apos;m always open to new projects and interesting
              opportunities.
            </p>
          </div>
          <div className="footer-links">
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  className="footer-link"
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noreferrer' : undefined}
                >
                  <IconComponent size={20} />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Steven Coaila Zaa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
