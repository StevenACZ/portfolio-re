import { useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { projects } from "./data/projects";
import { experiences } from "./data/experiences";
import { useScrollToSection } from "./hooks/useScrollToSection";
import { useScrollSpy } from "./hooks/useScrollSpy";
import SEOHead from "./components/SEOHead";
import {
  ProjectsSkeleton,
  TimelineSkeleton,
  FooterSkeleton,
} from "./components/SkeletonLoader";
import BackToTop from "./components/BackToTop";
import ScrollProgress from "./components/ScrollProgress";
import "./styles/HeroSection.css";

// Critical components - load immediately for better FCP
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";

// Lazy load non-critical components
const SkillsSection = lazy(() => import("./components/SkillsSection"));
const ProjectsSection = lazy(() => import("./components/ProjectsSection"));
const MacOSAppsSection = lazy(() => import("./components/MacOSAppsSection"));
const TimelineSection = lazy(() => import("./components/TimelineSection"));
const Footer = lazy(() => import("./components/Footer"));

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

const Portfolio = () => {
  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const macosAppsRef = useRef(null);
  const timelineRef = useRef(null);
  const footerRef = useRef(null);
  const navbarRef = useRef(null);
  const containerRef = useRef(null);

  // Custom hooks
  const scrollToSection = useScrollToSection(heroRef, navbarRef);
  const sections = [
    { ref: heroRef, name: "hero" },
    { ref: skillsRef, name: "skills" },
    { ref: projectsRef, name: "projects" },
    { ref: macosAppsRef, name: "macos-apps" },
    { ref: timelineRef, name: "timeline" },
    { ref: footerRef, name: "footer" },
  ];
  const activeSection = useScrollSpy(sections);

  // useGSAP hook for modern React GSAP integration
  useGSAP(
    () => {
      // Initialize animations when DOM is ready
      const timer = setTimeout(() => {
        initializeAnimations();
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    },
    { scope: containerRef }
  );

  useEffect(() => {
    // Prevenir restauración automática del scroll del navegador
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Asegurar scroll al top
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();

    // Manejar redimensionamiento de ventana con debounce optimizado para INP
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Use requestIdleCallback for better INP and Core Web Vitals
        if (window.requestIdleCallback) {
          window.requestIdleCallback(
            () => {
              ScrollTrigger.refresh();
            },
            { timeout: 200 }
          ); // Add timeout fallback
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 16); // ~1 frame delay
        }
      }, 100); // Reduced for better responsiveness
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Cleanup al desmontar
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const initializeAnimations = () => {
    // Configurar performance para mobile
    const isMobile = window.innerWidth <= 768;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      // Desactivar animaciones si el usuario prefiere movimiento reducido
      return;
    }

    // Get CSS custom properties for animation values
    const rootStyles = getComputedStyle(document.documentElement);
    const animationDuration = {
      hero:
        parseFloat(rootStyles.getPropertyValue("--animation-duration-hero")) ||
        1,
      heroLong:
        parseFloat(
          rootStyles.getPropertyValue("--animation-duration-hero-long")
        ) || 1.2,
      heroText:
        parseFloat(
          rootStyles.getPropertyValue("--animation-duration-hero-text")
        ) || 0.8,
    };
    const animationDistance = {
      medium:
        parseInt(rootStyles.getPropertyValue("--animation-distance-medium")) ||
        50,
      small:
        parseInt(rootStyles.getPropertyValue("--animation-distance-small")) ||
        30,
      large:
        parseInt(rootStyles.getPropertyValue("--animation-distance-large")) ||
        60,
    };

    // Check if elements exist before animating
    const heroGreeting = document.querySelector(".hero-greeting");
    const heroName = document.querySelector(".hero-name");
    const typewriterText = document.querySelector(".hero-title");
    const heroDescription = document.querySelector(".hero-description");
    const gradientBg = document.querySelector(".gradient-bg");
    const footerContent = document.querySelector(".footer-content");

    // Hero entrance animation con mejor coordinación
    const heroTl = gsap.timeline();

    if (heroGreeting) {
      heroTl.fromTo(
        heroGreeting,
        {
          y: animationDistance.medium,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: animationDuration.hero,
          ease: "power3.out",
        }
      );
    }

    if (heroName) {
      heroTl.fromTo(
        heroName,
        {
          y: animationDistance.medium,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: animationDuration.heroLong,
          ease: "back.out(1.7)",
        },
        "-=0.6"
      );
    }

    if (typewriterText) {
      heroTl.fromTo(
        typewriterText,
        {
          y: animationDistance.small,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: animationDuration.heroText,
          ease: "power3.out",
          delay: 0.5, // Delay para que termine la animación del nombre
        },
        "-=0.5"
      );
    }

    if (heroDescription) {
      heroTl.fromTo(
        heroDescription,
        {
          y: animationDistance.small,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: animationDuration.hero,
          ease: "power3.out",
        },
        "-=0.3"
      );
    }

    // Parallax effect mejorado (solo en desktop)
    if (!isMobile && gradientBg && heroRef.current) {
      gsap.to(gradientBg, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          refreshPriority: -10,
          fastScrollEnd: true, // Better mobile performance
        },
      });
    }

    // Footer entrance
    if (footerContent && footerRef.current) {
      gsap.fromTo(
        footerContent,
        {
          y: animationDistance.large,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: animationDuration.hero,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
            fastScrollEnd: true, // Better mobile performance
          },
        }
      );
    }

    // Navbar scroll effect
    if (navbarRef.current) {
      gsap.to(navbarRef.current, {
        backgroundColor: "rgba(10, 10, 10, 0.7)",
        backdropFilter: "blur(20px)",
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
        scrollTrigger: {
          trigger: "body",
          start: "top -50px",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
          scrub: 1,
        },
      });
    }

    // ScrollTrigger se actualizará automáticamente con las configuraciones de performance
  };

  // Función para manejar clicks de navegación
  const handleNavClick = useCallback(
    (sectionName) => {
      const sectionMap = {
        hero: heroRef,
        skills: skillsRef,
        projects: projectsRef,
        "macos-apps": macosAppsRef,
        timeline: timelineRef,
        footer: footerRef,
      };
      const targetRef = sectionMap[sectionName];
      if (targetRef) {
        scrollToSection(targetRef);
      }
    },
    [scrollToSection]
  );

  return (
    <>
      <SEOHead />
      <ScrollProgress />
      <div ref={containerRef} className="portfolio">
        {/* Navbar - Critical component, load immediately */}
        <Navbar
          activeSection={activeSection}
          onNavClick={handleNavClick}
          navbarRef={navbarRef}
        />

        {/* Hero Section - Critical component, load immediately */}
        <main id="main-content" role="main">
          <section ref={heroRef} aria-label="Introduction and hero section">
            <HeroSection />
          </section>

          {/* Skills Section */}
          <section id="skills" aria-label="Technical skills and technologies">
            <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
              <SkillsSection skillsRef={skillsRef} />
            </Suspense>
          </section>

          {/* Projects Section */}
          <section
            id="projects"
            ref={projectsRef}
            className="projects"
            aria-label="Featured projects and portfolio"
          >
            <Suspense fallback={<ProjectsSkeleton />}>
              <ProjectsSection projects={projects} />
            </Suspense>
          </section>

          {/* macOS Apps Section */}
          <section
            id="macos-apps"
            ref={macosAppsRef}
            aria-label="macOS native applications"
          >
            <Suspense fallback={<div style={{ minHeight: "50vh" }} />}>
              <MacOSAppsSection />
            </Suspense>
          </section>

          {/* Timeline Section */}
          <section aria-label="Professional experience and timeline">
            <Suspense fallback={<TimelineSkeleton />}>
              <TimelineSection
                experiences={experiences}
                timelineRef={timelineRef}
              />
            </Suspense>
          </section>
        </main>

        {/* Footer */}
        <footer
          role="contentinfo"
          aria-label="Contact information and site footer"
        >
          <Suspense fallback={<FooterSkeleton />}>
            <Footer footerRef={footerRef} />
          </Suspense>
        </footer>

        {/* Back to Top Button */}
        <BackToTop />
      </div>
    </>
  );
};

export default Portfolio;
