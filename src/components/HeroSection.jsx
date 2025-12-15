import { useRef, useEffect, useState, lazy, Suspense } from "react";
import { ArrowRight, Mail } from "lucide-react";
import Typewriter from "./Typewriter";
import ErrorBoundary from "./ErrorBoundary";
import "../styles/ErrorBoundary.css";

// Lazy load Three.js components only when needed
const ThreeScene = lazy(() =>
  import("./ThreeScene").then((module) => ({ default: module.ThreeScene }))
);

const HeroSection = () => {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [show3D, setShow3D] = useState(false);

  // Progressive enhancement: Load 3D effects after page is interactive
  useEffect(() => {
    // Delay 3D loading until after content is rendered and page is interactive
    const timer = setTimeout(() => {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Only load 3D if user doesn't prefer reduced motion and device can handle it
      if (!prefersReducedMotion) {
        setShow3D(true);
      }
    }, 500); // Reduced delay for faster 3D loading

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleThreeLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <section className="hero-section" style={{ aspectRatio: "16/9" }}>
      {/* Canvas with reserved space to prevent CLS */}
      <canvas
        ref={canvasRef}
        className="hero-canvas"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
        aria-hidden="true"
      />

      {/* Fallback gradient background for when 3D is loading/disabled */}
      <div
        className="hero-fallback-bg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #16213e 100%)",
          opacity: isLoaded ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
          zIndex: 0,
        }}
      />

      {/* Hero Content - Loads immediately for fast FCP */}
      <div className="hero-content" style={{ zIndex: 2 }}>
        <div className="hero-text">
          <h1 className="hero-greeting">Hi, I&apos;m</h1>
          <h2
            className="hero-name"
            aria-label="Steven Coaila Zaa, Full Stack Developer"
          >
            Steven Coaila Zaa
          </h2>
          <div
            className="hero-subtitle"
            role="text"
            aria-live="polite"
            aria-label="Dynamic title showing different specializations"
          >
            <Typewriter className="hero-title" />
          </div>
          <p
            className="hero-description"
            aria-label="Professional summary and approach"
          >
            Creating innovative digital experiences with modern web
            technologies. Passionate about clean code, beautiful design, and
            exceptional user experiences.
          </p>
          <div className="hero-cta-container">
            <button
              onClick={() => {
                const projectsSection = document.getElementById("projects");
                if (projectsSection) {
                  projectsSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="hero-cta hero-cta-primary"
              aria-label="View my projects"
              type="button"
            >
              <span>View Projects</span>
              <ArrowRight className="cta-icon" size={20} strokeWidth={2} />
            </button>
            <a
              href="mailto:scoaila@proton.me"
              className="hero-cta hero-cta-secondary"
              aria-label="Send me an email"
            >
              <span>Contact Me</span>
              <Mail className="cta-icon" size={20} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>

      {/* Lazy load Three.js scene only when needed */}
      {show3D && (
        <ErrorBoundary>
          <Suspense fallback={null}>
            <ThreeScene canvasRef={canvasRef} onLoaded={handleThreeLoaded} />
          </Suspense>
        </ErrorBoundary>
      )}
    </section>
  );
};

export default HeroSection;
