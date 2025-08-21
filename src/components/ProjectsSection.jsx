import React, { useRef, useState, memo, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Github, ExternalLink } from 'lucide-react';
import '../styles/ProjectsSection.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const ProjectCard = memo(({ project, index }) => {
  const isEven = useMemo(() => index % 2 === 0, [index]);
  const [overlayActive, setOverlayActive] = useState(false);

  const handleImageClick = () => {
    setOverlayActive(!overlayActive);
  };

  const hasValidLinks = useMemo(() => 
    (project.github && project.github !== '#') || (project.demo && project.demo !== '#'),
    [project.github, project.demo]
  );

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
                <img 
                  src={project.image} 
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                />
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
});

ProjectCard.displayName = 'ProjectCard';

const ProjectsSection = ({ projects = [] }) => {
  const sectionRef = useRef(null);

  // Memoize calculations that don't change between renders
  const totalPhases = useMemo(() => 1 + projects.length, [projects.length]);
  const totalHeight = useMemo(() => totalPhases * 1.8 * window.innerHeight, [totalPhases]);

  useGSAP(() => {
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

    // Main pinned section with extended height for scroll snap behavior
    // Use memoized values for performance

    ScrollTrigger.create({
      trigger: section,
      start: 'top+=6rem top', // Pin starts when header reaches top (accounting for header height)
      end: `+=${totalHeight}`,
      pin: true,
      pinSpacing: true, // Restaurar el pin spacing para que funcione el scroll fijo
      scrub: 1,
      anticipatePin: 1,
      refreshPriority: -1,
      fastScrollEnd: true, // Better mobile performance
      invalidateOnRefresh: true, // Refresh calculations on resize
      onUpdate: (self) => {
        const progress = self.progress;
        const phaseProgress = progress * totalPhases;
        const currentPhase = Math.floor(phaseProgress);
        let phaseLocalProgress = phaseProgress - currentPhase;
        
        // Create magnetic zones: each project stays visible longer
        // Map linear progress to a curve that creates "snap zones"
        if (phaseLocalProgress > 0.2 && phaseLocalProgress < 0.8) {
          // In the middle 60% of each phase, slow down the progress significantly
          const normalizedMiddle = (phaseLocalProgress - 0.2) / 0.6; // Map 0.2-0.8 to 0-1
          const slowProgress = normalizedMiddle * 0.3; // Compress to 30% of normal speed
          phaseLocalProgress = 0.2 + slowProgress; // Remap back to phase space
        }

        // Phase 0: Title visible immediately, then fades upward
        if (currentPhase === 0) {
          // Calculate dynamic distance for title (slightly more dramatic)
          const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 80;
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
                duration: 0.25, // Synchronized duration
                ease: 'power2.out', // Consistent easing
                overwrite: 'auto',
                immediateRender: false,
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
            duration: 0.25, // Synchronized duration
            ease: 'power2.out', // Consistent easing
            overwrite: 'auto',
            immediateRender: false,
          });

          // Ensure header has no pointer events during project phases
          header.classList.add('hidden');

          const projectIndex = currentPhase - 1;

          projects.forEach((_, index) => {
            const card = section.querySelector(`[data-project="${index}"]`);
            if (!card) return;

            if (index === projectIndex) {
              if (index === projects.length - 1) {
                // Último proyecto: aparece y se mantiene con zona magnética
                let easedProgress;
                if (phaseLocalProgress <= 0.5) {
                  // Primera mitad: aparece gradualmente
                  easedProgress = gsap.utils.mapRange(0, 0.5, 0, 1, phaseLocalProgress);
                } else {
                  // Segunda mitad: permanece visible (zona magnética)
                  easedProgress = 1;
                }
                
                gsap.to(card, {
                  opacity: easedProgress,
                  y: 0, // Último proyecto se mantiene en centro
                  duration: 0.3,
                  ease: 'power3.out',
                });

                // Enable interactions for visible project
                if (easedProgress > 0.1) {
                  card.classList.remove('hidden');
                } else {
                  card.classList.add('hidden');
                }
              } else {
                // Previous projects: appear in center with extended visible zone
                let easedOpacity, yPosition;
                
                if (phaseLocalProgress <= 0.3) {
                  // First 30%: appearing
                  easedOpacity = gsap.utils.mapRange(0, 0.3, 0, 1, phaseLocalProgress);
                  yPosition = 0;
                } else if (phaseLocalProgress <= 0.7) {
                  // Middle 40%: fully visible (magnetic zone)
                  easedOpacity = 1;
                  yPosition = 0;
                } else {
                  // Last 20%: disappearing upward (reduced overlap)
                  const exitProgress = gsap.utils.mapRange(0.8, 1, 0, 1, phaseLocalProgress);
                  easedOpacity = Math.max(0, 1 - exitProgress);
                  
                  // Calculate dynamic distance based on viewport
                  const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 80;
                  const buffer = 20;
                  const maxDistance = window.innerHeight / 2 + navbarHeight + buffer;
                  yPosition = -maxDistance * exitProgress;
                }

                gsap.to(card, {
                  opacity: easedOpacity,
                  y: yPosition,
                  duration: 0.25, // Synchronized duration
                  ease: 'power2.out', // Consistent easing
                  overwrite: 'auto',
                  immediateRender: false,
                });

                // Enable interactions based on opacity (more aggressive threshold)
                if (easedOpacity > 0.05) {
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
                duration: 0.25, // Synchronized duration
                ease: 'power2.out', // Consistent easing
                overwrite: 'auto',
                immediateRender: false,
              });

              // Disable interactions for hidden projects
              card.classList.add('hidden');
            }
          });
        }
      },
    });

    // Cleanup handled automatically by useGSAP
  }, { dependencies: [projects, totalPhases, totalHeight] });

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
