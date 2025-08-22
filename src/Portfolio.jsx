import React, { useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { projects } from './data/projects';
import { experiences } from './data/experiences';
import { useScrollToSection } from './hooks/useScrollToSection';
import { useScrollSpy } from './hooks/useScrollSpy';
import SEOHead from './components/SEOHead';
import { ProjectsSkeleton, TimelineSkeleton, FooterSkeleton } from './components/SkeletonLoader';
import './styles/HeroSection.css';

// Critical components - load immediately for better FCP
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';

// Lazy load non-critical components
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const TimelineSection = lazy(() => import('./components/TimelineSection'));
const Footer = lazy(() => import('./components/Footer'));

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

const Portfolio = () => {
  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const timelineRef = useRef(null);
  const footerRef = useRef(null);
  const navbarRef = useRef(null);
  const containerRef = useRef(null);

  // Custom hooks
  const scrollToSection = useScrollToSection(heroRef, navbarRef);
  const sections = [
    { ref: heroRef, name: 'hero' },
    { ref: projectsRef, name: 'projects' },
    { ref: timelineRef, name: 'timeline' },
    { ref: footerRef, name: 'footer' },
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
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Asegurar scroll al top
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();

    // Registrar plugins GSAP
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Inicializar animaciones cuando DOM esté listo
    const timer = setTimeout(() => {
      initializeAnimations();
    }, 500);

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

    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup al desmontar
    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const initializeAnimations = () => {
    // Configurar performance para mobile
    const isMobile = window.innerWidth <= 768;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reducedMotion) {
      // Desactivar animaciones si el usuario prefiere movimiento reducido
      return;
    }

    // Check if elements exist before animating
    const heroGreeting = document.querySelector('.hero-greeting');
    const heroName = document.querySelector('.hero-name');
    const typewriterText = document.querySelector('.typewriter-text');
    const heroDescription = document.querySelector('.hero-description');
    const gradientBg = document.querySelector('.gradient-bg');
    const footerContent = document.querySelector('.footer-content');

    // Hero entrance animation con mejor coordinación
    const heroTl = gsap.timeline();

    if (heroGreeting) {
      heroTl.fromTo(
        heroGreeting,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
        }
      );
    }

    if (heroName) {
      heroTl.fromTo(
        heroName,
        {
          y: 50,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'back.out(1.7)',
        },
        '-=0.6'
      );
    }

    if (typewriterText) {
      heroTl.fromTo(
        typewriterText,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.5, // Delay para que termine la animación del nombre
        },
        '-=0.5'
      );
    }

    if (heroDescription) {
      heroTl.fromTo(
        heroDescription,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
        },
        '-=0.3'
      );
    }

    // Parallax effect mejorado (solo en desktop)
    if (!isMobile && gradientBg && heroRef.current) {
      gsap.to(gradientBg, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top bottom',
          end: 'bottom top',
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
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
            fastScrollEnd: true, // Better mobile performance
          },
        }
      );
    }

    // Navbar scroll effect
    if (navbarRef.current) {
      gsap.to(navbarRef.current, {
        backgroundColor: 'rgba(10, 10, 10, 0.7)',
        backdropFilter: 'blur(20px)',
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        scrollTrigger: {
          trigger: 'body',
          start: 'top -50px',
          end: 'bottom bottom',
          toggleActions: 'play none none reverse',
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
        projects: projectsRef,
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
      <div ref={containerRef} className="portfolio">
        {/* Navbar - Critical component, load immediately */}
        <Navbar
          activeSection={activeSection}
          onNavClick={handleNavClick}
          navbarRef={navbarRef}
        />

        {/* Hero Section - Critical component, load immediately */}
        <div ref={heroRef}>
          <HeroSection />
        </div>

        {/* Projects Section */}
        <section ref={projectsRef} className="projects">
          <Suspense fallback={<ProjectsSkeleton />}>
            <ProjectsSection projects={projects} />
          </Suspense>
        </section>

        {/* Timeline Section */}
        <Suspense fallback={<TimelineSkeleton />}>
          <TimelineSection
            experiences={experiences}
            timelineRef={timelineRef}
          />
        </Suspense>

        {/* Footer */}
        <Suspense fallback={<FooterSkeleton />}>
          <Footer footerRef={footerRef} />
        </Suspense>
      </div>
    </>
  );
};

export default Portfolio;
