import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ExternalLink } from 'lucide-react';
import '../styles/ProjectsSection.css';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, index }) => {
  const isEven = index % 2 === 0;
  const [overlayActive, setOverlayActive] = useState(false);

  const handleImageClick = () => {
    setOverlayActive(!overlayActive);
  };

  const hasValidLinks = (project.github && project.github !== '#') || (project.demo && project.demo !== '#');

  return (
    <div
      className={`project-card ${isEven ? 'image-right' : 'image-left'}`}
      data-project={index}
    >
      <div className="project-content">
        <div className="project-info">
          <div className="project-number">
            {String(index + 1).padStart(2, '0')}
          </div>
          <h3 className="project-title">{project.title}</h3>
          <p className="project-description">{project.description}</p>

          <div className="project-tech">
            {project.tech.map((tech, techIndex) => (
              <span key={techIndex} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>

          {project.features && (
            <div className="project-features">
              <h4 className="features-title">Key Features:</h4>
              <ul className="features-list">
                {project.features.slice(0, 3).map((feature, featureIndex) => (
                  <li key={featureIndex} className="feature-item">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        <div className="project-visual">
          <div className="project-showcase">
            <div 
              className={`project-image ${hasValidLinks ? 'interactive' : ''} ${overlayActive ? 'overlay-active' : ''}`}
              onClick={hasValidLinks ? handleImageClick : undefined}
            >
              {project.image ? (
                <img src={project.image} alt={project.title} />
              ) : (
                <div className="project-placeholder">
                  <span>{project.title}</span>
                </div>
              )}
              
              {hasValidLinks && (
                <div className="project-overlay">
                  <div className="overlay-links">
                    {project.github && project.github !== '#' && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="overlay-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          // On mobile, prevent navigation if overlay is not active
                          if (window.innerWidth <= 768 && !overlayActive) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <Github size={24} />
                      </a>
                    )}
                    {project.demo && project.demo !== '#' && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="overlay-link"
                        onClick={(e) => {
                          e.stopPropagation();
                          // On mobile, prevent navigation if overlay is not active
                          if (window.innerWidth <= 768 && !overlayActive) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <ExternalLink size={24} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsSection = ({ projects = [] }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!projects.length) return;

    const section = sectionRef.current;
    if (!section) return;

    const header = section.querySelector('.projects-header');

    // Set initial states
    gsap.set(header, { opacity: 1, y: 0 });

    projects.forEach((_, index) => {
      const card = section.querySelector(`[data-project="${index}"]`);
      if (!card) return;
      gsap.set(card, { opacity: 0, y: 0 }); // Start at center, not at 50px below position
      card.classList.add('hidden'); // Initially all projects are hidden
    });

    // Main pinned section
    const totalPhases = 1 + projects.length;
    const totalHeight = (totalPhases - 0.5) * window.innerHeight; // Reducir ligeramente para mejor control

    const projectsHeader = section.querySelector('.projects-header');

    ScrollTrigger.create({
      trigger: section,
      start: 'top+=6rem top', // Pin starts when header reaches top (accounting for header height)
      end: `+=${totalHeight}`,
      pin: true,
      pinSpacing: true, // Restaurar el pin spacing para que funcione el scroll fijo
      scrub: 1,
      anticipatePin: 1,
      refreshPriority: -1,
      onUpdate: (self) => {
        const progress = self.progress;
        const phaseProgress = progress * totalPhases;
        const currentPhase = Math.floor(phaseProgress);
        const phaseLocalProgress = phaseProgress - currentPhase;

        // Phase 0: Title visible immediately, then fades upward
        if (currentPhase === 0) {
          // Calculate dynamic distance for title (slightly more dramatic)
          const navbarHeight = 80;
          const buffer = 150; // Larger buffer for title, more dramatic
          const titleMaxDistance =
            window.innerHeight / 2 + navbarHeight + buffer;

          const opacity = Math.max(0, 1 - phaseLocalProgress * 1.8);
          
          gsap.to(header, {
            opacity: opacity,
            y: -titleMaxDistance * phaseLocalProgress, // Dynamic upward movement
            duration: 0.2, // Faster animation
            ease: 'power2.out',
          });

          // Toggle pointer-events based on opacity
          if (opacity < 0.1) {
            header.classList.add('hidden');
          } else {
            header.classList.remove('hidden');
          }

          // Hide projects - maintain current position
          projects.forEach((_, index) => {
            const card = section.querySelector(`[data-project="${index}"]`);
            if (card) {
              const currentY = gsap.getProperty(card, 'y');
              gsap.to(card, {
                opacity: 0,
                y: currentY, // Maintain current position, don't reset
                duration: 0.4,
                ease: 'power2.inOut',
                overwrite: true, // Prevenir conflictos
              });

              // Disable interactions during phase 0
              card.classList.add('hidden');
            }
          });
        }

        // Project phases
        else if (currentPhase >= 1 && currentPhase <= projects.length) {
          // Title completely hidden
          gsap.to(header, {
            opacity: 0,
            y: -30,
            duration: 0.4,
            ease: 'power2.inOut',
          });

          // Ensure header has no pointer events during project phases
          header.classList.add('hidden');

          const projectIndex = currentPhase - 1;

          projects.forEach((_, index) => {
            const card = section.querySelector(`[data-project="${index}"]`);
            if (!card) return;

            if (index === projectIndex) {
              if (index === projects.length - 1) {
                // Último proyecto: aparece y se mantiene
                const easedProgress = gsap.utils.mapRange(
                  0,
                  1,
                  0,
                  1,
                  phaseLocalProgress
                );
                gsap.to(card, {
                  opacity: easedProgress,
                  y: 0, // Último proyecto se mantiene en centro
                  duration: 0.5,
                  ease: 'power3.out',
                });

                // Enable interactions for visible project
                if (easedProgress > 0.1) {
                  card.classList.remove('hidden');
                } else {
                  card.classList.add('hidden');
                }
              } else {
                // Previous projects: appear in center and disappear upward
                const easedOpacity = Math.sin(phaseLocalProgress * Math.PI);

                // Calculate dynamic distance based on viewport
                const navbarHeight = 80; // Altura del navbar
                const buffer = 20; // Buffer to ensure disappearance before navbar
                const maxDistance =
                  window.innerHeight / 2 + navbarHeight + buffer;

                const yPosition =
                  phaseLocalProgress <= 0.5
                    ? 0 // Primera mitad: mantener en centro mientras aparece
                    : -maxDistance * ((phaseLocalProgress - 0.5) * 2); // Second half: move upward dynamically

                gsap.to(card, {
                  opacity: easedOpacity,
                  y: yPosition,
                  duration: 0.4,
                  ease: 'power3.out',
                  overwrite: true, // Prevenir conflictos de animaciones
                });

                // Enable interactions based on opacity
                if (easedOpacity > 0.1) {
                  card.classList.remove('hidden');
                } else {
                  card.classList.add('hidden');
                }
              }
            } else {
              // Other hidden projects - maintain current position, don't reset
              const currentY = gsap.getProperty(card, 'y');
              gsap.to(card, {
                opacity: 0,
                y: currentY, // Maintain current Y position, don't move to another position
                duration: 0.4,
                ease: 'power2.inOut',
                overwrite: true, // Prevenir conflictos
              });

              // Disable interactions for hidden projects
              card.classList.add('hidden');
            }
          });
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger && section.contains(st.trigger)) {
          st.kill();
        }
      });
    };
  }, [projects]);

  if (!projects.length) {
    return (
      <div className="projects-empty">
        <p>No projects to display</p>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="projects-section">
      <div className="projects-header">
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-subtitle">Here are some of my recent works</p>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
