import React, { useEffect, useRef, useState } from 'react';
import Typewriter from 'typewriter-effect';
import {
  Github,
  ExternalLink,
  Linkedin,
  Mail,
  ChevronDown,
  Calendar,
  MapPin,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { projects } from './data/projects';
import { experiences } from './data/experiences';
import ProjectsSection from './components/ProjectsSection';


const Portfolio = () => {
  const heroRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const projectsRef = useRef(null);
  const timelineRef = useRef(null);
  const footerRef = useRef(null);
  const navbarRef = useRef(null);
  const [activeSection, setActiveSection] = useState('hero');

  // Configurar typewriter con palabras más impactantes
  const typewriterWords = [
    'Full Stack Developer',
    'Swift Developer', 
    'Creative Problem Solver',
    'UX Enthusiast',
    'React Specialist',
    'Mobile App Creator'
  ];

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

    // Manejar redimensionamiento de ventana
    const handleResize = () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup al desmontar
    return () => {
      clearTimeout(timer);
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
          scale: 0.9
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
          delay: 0.5  // Delay para que termine la animación del nombre
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

    // Scroll indicator bounce
    if (scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      });
    }

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

    // Scroll spy para navbar
    const sections = [
      { ref: heroRef, name: 'hero' },
      { ref: projectsRef, name: 'projects' },
      { ref: timelineRef, name: 'timeline' },
      { ref: footerRef, name: 'footer' },
    ];

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section.ref.current,
        start: 'top 20%',
        end: 'bottom 20%',
        onEnter: () => setActiveSection(section.name),
        onEnterBack: () => setActiveSection(section.name),
      });
    });

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

  };

  // Función para smooth scroll
  const scrollToSection = (sectionRef) => {

    if (sectionRef.current) {
      // Calcular altura real del navbar con margen adicional
      // const navbarHeight = navbarRef.current ? navbarRef.current.offsetHeight + 10 : 90;
      const navbarHeight = navbarRef.current
        ? navbarRef.current.offsetHeight
        : 80;

      // Obtener posición exacta de la sección
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const currentScrollY = window.pageYOffset;
      const targetY = sectionRect.top + currentScrollY;


      if (gsap && gsap.plugins?.ScrollToPlugin) {

        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: targetY - (sectionRef === heroRef ? 0 : navbarHeight),
            autoKill: false,
          },
          ease: 'power2.inOut',
        });
      } else {
        console.warn('GSAP ScrollTo no disponible, usando scroll nativo');

        // Fallback scroll nativo con cálculo preciso
        const finalTargetY =
          targetY - (sectionRef === heroRef ? 0 : navbarHeight);

        window.scrollTo({
          top: finalTargetY,
          behavior: 'smooth',
        });

      }
    }
  };

  // Función específica para el scroll indicator
  const handleScrollIndicatorClick = () => {
    scrollToSection(projectsRef);
  };


  return (
    <div className="portfolio">
      {/* Navbar */}
      <nav ref={navbarRef} className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <span onClick={() => scrollToSection(heroRef)}>StevenACZ</span>
          </div>
          <div className="navbar-links">
            <button
              onClick={() => scrollToSection(heroRef)}
              className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection(projectsRef)}
              className={`nav-link ${
                activeSection === 'projects' ? 'active' : ''
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection(timelineRef)}
              className={`nav-link ${
                activeSection === 'timeline' ? 'active' : ''
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => scrollToSection(footerRef)}
              className={`nav-link ${
                activeSection === 'footer' ? 'active' : ''
              }`}
            >
              Contact
            </button>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section ref={heroRef} className="hero">
        <div className="hero-bg">
          <div className="particles">
            {[...Array(50)].map((_, i) => (
              <div key={i} className={`particle particle-${i % 3}`}></div>
            ))}
          </div>
          <div className="gradient-bg"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-greeting">Hello, I'm</span>
            <span className="hero-name">Steven</span>
          </h1>
          <h2 className="hero-subtitle">
            <span className="typewriter-text">
              <Typewriter
                options={{
                  strings: typewriterWords,
                  autoStart: true,
                  loop: true,
                  delay: 80,
                  deleteSpeed: 30,
                  pauseFor: 3000,
                }}
              />
            </span>
          </h2>
          <p className="hero-description">
            Creating innovative digital experiences with cutting-edge technology
          </p>
        </div>
        <div
          ref={scrollIndicatorRef}
          className="scroll-indicator"
          onClick={handleScrollIndicatorClick}
        >
          <ChevronDown size={24} />
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="projects">
        <ProjectsSection projects={projects} />
      </section>

      {/* Timeline Section */}
      <section ref={timelineRef} className="timeline">
        <div className="container">
          <h2 className="section-title">Experience</h2>
          <div className="timeline-container">
            <div className="timeline-line"></div>
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`timeline-item ${
                  index % 2 === 0 ? 'left' : 'right'
                }`}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-date">{exp.period}</div>
                  <h3 className="timeline-title">{exp.title}</h3>
                  <h4 className="timeline-company">{exp.company}</h4>
                  <div className="timeline-location">
                    <MapPin size={14} />
                    <span>{exp.location}</span>
                  </div>
                  <p className="timeline-description">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={footerRef} className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-info">
              <h3>Let's work together!</h3>
              <p>
                I'm always open to new projects and interesting opportunities.
              </p>
            </div>
            <div className="footer-links">
              <a href="mailto:scoaila@proton.me" className="footer-link">
                <Mail size={20} />
                <span>scoaila@proton.me</span>
              </a>
              <a
                href="https://linkedin.com/in/steven-coaila"
                className="footer-link"
              >
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com/stevencoaila" className="footer-link">
                <Github size={20} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Steven Coaila Zaa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
