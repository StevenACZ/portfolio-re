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
import './styles/HeroSection.css';

// Lazy load components
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const HeroSection = lazy(() => import('./components/HeroSection'));
const Navbar = lazy(() => import('./components/Navbar'));
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
      }, 100);

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
    }, 100);

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

    // Hero entrance animation con mejor coordinación
    const heroTl = gsap.timeline();

    heroTl
      .fromTo(
        '.hero-greeting',
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
      )
      .fromTo(
        '.hero-name',
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
      )
      .fromTo(
        '.typewriter-text',
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
      )
      .fromTo(
        '.hero-description',
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

    // Scroll indicator bounce moved to CSS for better performance

    // Parallax effect mejorado (solo en desktop)
    if (!isMobile) {
      gsap.to('.gradient-bg', {
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

    // Project presentation handled by ImmersiveProjectScroll component

    // Timeline line draw animation
    gsap.fromTo(
      '.timeline-line',
      {
        scaleY: 0,
        transformOrigin: 'top center',
      },
      {
        scaleY: 1,
        duration: 2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
          fastScrollEnd: true, // Better mobile performance
        },
      }
    );

    // Timeline items stagger
    gsap.fromTo(
      '.timeline-item',
      {
        x: -80,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
          fastScrollEnd: true, // Better mobile performance
        },
      }
    );

    // Footer entrance
    gsap.fromTo(
      '.footer-content',
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

    // Navbar scroll effect
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

    // ScrollTrigger se actualizará automáticamente con las configuraciones de performance
  };

  // Función específica para el scroll indicator
  const handleScrollIndicatorClick = useCallback(() => {
    scrollToSection(projectsRef);
  }, [scrollToSection, projectsRef]);

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
        {/* Navbar */}
        <Suspense
          fallback={<div className="loading">Loading navigation...</div>}
        >
          <Navbar
            activeSection={activeSection}
            onNavClick={handleNavClick}
            navbarRef={navbarRef}
          />
        </Suspense>

        {/* Hero Section */}
        <div ref={heroRef}>
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <HeroSection onScrollIndicatorClick={handleScrollIndicatorClick} />
          </Suspense>
        </div>

        {/* Projects Section */}
        <section ref={projectsRef} className="projects">
          <Suspense
            fallback={<div className="loading">Loading projects...</div>}
          >
            <ProjectsSection projects={projects} />
          </Suspense>
        </section>

        {/* Timeline Section */}
        <Suspense
          fallback={<div className="loading">Loading experience...</div>}
        >
          <TimelineSection
            experiences={experiences}
            timelineRef={timelineRef}
          />
        </Suspense>

        {/* Footer */}
        <Suspense fallback={<div className="loading">Loading contact...</div>}>
          <Footer footerRef={footerRef} />
        </Suspense>
      </div>
    </>
  );
};

export default Portfolio;
