import { useRef, useCallback, lazy, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { projects } from "./data/projects";
import { experiences } from "./data/experiences";
import { useScrollToSection } from "./hooks/useScrollToSection";
import { useScrollSpy } from "./hooks/useScrollSpy";
import { useHeroAnimations } from "./hooks/useHeroAnimations";
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

  // Initialize all GSAP animations
  useHeroAnimations(containerRef, heroRef, footerRef, navbarRef);

  // Handle navigation clicks
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
        {/* Navbar - Critical component */}
        <Navbar
          activeSection={activeSection}
          onNavClick={handleNavClick}
          navbarRef={navbarRef}
        />

        {/* Main Content */}
        <main id="main-content" role="main">
          {/* Hero Section - Critical component */}
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
