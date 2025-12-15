import { useRef, memo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Github, ExternalLink, Apple } from "lucide-react";
import { macosApps } from "../data/macosApps";
import "../styles/MacOSAppsSection.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AppCard = memo(({ app, index }) => {
  return (
    <div
      className="macos-app-card"
      data-app={index}
      style={{ "--delay": `${index * 0.1}s` }}
    >
      <div className="app-icon-wrapper">
        {app.icon ? (
          <img
            src={app.icon}
            alt={`${app.name} icon`}
            className="app-icon"
            loading="lazy"
          />
        ) : (
          <div className="app-icon-placeholder">
            <Apple size={32} />
          </div>
        )}
      </div>
      <h3 className="app-name">{app.name}</h3>
      <p className="app-description">{app.description}</p>
      <div className="app-links">
        {app.github && (
          <a
            href={app.github}
            target="_blank"
            rel="noopener noreferrer"
            className="app-link app-github-link"
            aria-label={`View ${app.name} on GitHub`}
          >
            <Github size={16} />
            <span>Source</span>
          </a>
        )}
        {app.demo && (
          <a
            href={app.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="app-link app-demo-link"
            aria-label={`View ${app.name} website`}
          >
            <ExternalLink size={16} />
            <span>Website</span>
          </a>
        )}
      </div>
    </div>
  );
});

AppCard.displayName = "AppCard";

const MacOSAppsSection = () => {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const header = section.querySelector(".macos-apps-header");
      const cards = section.querySelectorAll(".macos-app-card");
      const cta = section.querySelector(".macos-apps-cta");

      // Header animation
      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Cards staggered animation
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // CTA animation
      gsap.fromTo(
        cta,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="macos-apps-section">
      <div className="macos-apps-container">
        <div className="macos-apps-header">
          <div className="macos-badge">
            <Apple size={18} />
            <span>macOS Native</span>
          </div>
          <h2 className="macos-apps-title">Apps Collection</h2>
          <p className="macos-apps-subtitle">
            Free & open source productivity tools for Mac
          </p>
        </div>

        <div className="macos-apps-grid">
          {macosApps.map((app, index) => (
            <AppCard key={app.id} app={app} index={index} />
          ))}
        </div>

        <div className="macos-apps-cta">
          <a
            href="https://apps.stevenacz.com"
            target="_blank"
            rel="noopener noreferrer"
            className="macos-apps-link"
          >
            <span>Explore all apps</span>
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Background decoration */}
      <div className="macos-apps-bg">
        <div className="macos-glow macos-glow-1"></div>
        <div className="macos-glow macos-glow-2"></div>
      </div>
    </section>
  );
};

export default MacOSAppsSection;
