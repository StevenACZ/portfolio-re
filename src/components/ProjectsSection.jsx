import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/ProjectsSection.css';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, index }) => {
  const isEven = index % 2 === 0;

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

          <div className="project-links">
            {project.github && project.github !== '#' && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                GitHub
              </a>
            )}
            {project.demo && project.demo !== '#' && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
              >
                Demo
              </a>
            )}
          </div>
        </div>

        <div className="project-visual">
          <div className="project-image">
            {project.image ? (
              <img src={project.image} alt={project.title} />
            ) : (
              <div className="project-placeholder">
                <span>{project.title}</span>
              </div>
            )}
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
      gsap.set(card, { opacity: 0, y: 0 }); // Iniciar en centro, no en posición 50px abajo
    });

    // Sección pinned principal
    const totalPhases = 1 + projects.length;
    const totalHeight = (totalPhases - 0.5) * window.innerHeight; // Reducir ligeramente para mejor control

    ScrollTrigger.create({
      trigger: section,
      start: 'top top', // Inicio directo sin gap
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

        // Fase 0: Título visible inmediatamente, luego se desvanece hacia arriba
        if (currentPhase === 0) {
          gsap.to(header, {
            opacity: Math.max(0, 1 - phaseLocalProgress * 1.8), // Desvanecimiento más rápido
            y: -350 * phaseLocalProgress, // Movimiento hacia arriba mientras desaparece
            duration: 0.2, // Animación más rápida
            ease: 'power2.out', // Cambio a power2.out para mejor efecto de salida
          });

          // Ocultar proyectos - mantenerlos en centro
          projects.forEach((_, index) => {
            const card = section.querySelector(`[data-project="${index}"]`);
            if (card) {
              gsap.to(card, {
                opacity: 0,
                y: 0, // Mantener en centro, no mover hacia abajo
                duration: 0.4,
                ease: 'power2.inOut',
                overwrite: true, // Prevenir conflictos
              });
            }
          });
        }

        // Fases de proyectos
        else if (currentPhase >= 1 && currentPhase <= projects.length) {
          // Título completamente oculto
          gsap.to(header, {
            opacity: 0,
            y: -30,
            duration: 0.4,
            ease: 'power2.inOut',
          });

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
              } else {
                // Proyectos anteriores: aparecen en centro y desaparecen hacia arriba
                const easedOpacity = Math.sin(phaseLocalProgress * Math.PI);
                const yPosition =
                  phaseLocalProgress <= 0.5
                    ? 0 // Primera mitad: mantener en centro mientras aparece
                    : -150 * ((phaseLocalProgress - 0.5) * 2); // Segunda mitad: mover hacia arriba mientras desaparece

                gsap.to(card, {
                  opacity: easedOpacity,
                  y: yPosition,
                  duration: 0.4,
                  ease: 'power3.out',
                  overwrite: true, // Prevenir conflictos de animaciones
                });
              }
            } else {
              // Otros proyectos ocultos - mantener en centro, no mover hacia abajo
              gsap.to(card, {
                opacity: 0,
                y: 0, // Mantener en centro en lugar de mover a 50px abajo
                duration: 0.4,
                ease: 'power2.inOut',
                overwrite: true, // Prevenir conflictos
              });
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
