import { Github, Linkedin, Mail } from 'lucide-react';
import '../styles/Footer.css';

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
    <div ref={footerRef} className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3 id="contact-heading">Let&apos;s work together!</h3>
            <p aria-describedby="contact-heading">
              I&apos;m always open to new projects and interesting
              opportunities.
            </p>
          </div>
          <nav 
            className="footer-links"
            role="navigation"
            aria-label="Social media and contact links"
          >
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  className="footer-link"
                  target={link.isExternal ? '_blank' : undefined}
                  rel={link.isExternal ? 'noopener noreferrer' : undefined}
                  aria-label={`Contact via ${link.label}${link.isExternal ? ' (opens in new tab)' : ''}`}
                >
                  <IconComponent 
                    size={20} 
                    aria-hidden="true"
                    focusable="false"
                  />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
        <div className="footer-bottom">
          <p 
            role="contentinfo"
            aria-label={`Copyright ${currentYear} Steven Coaila Zaa`}
          >
            &copy; {currentYear} Steven Coaila Zaa. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
