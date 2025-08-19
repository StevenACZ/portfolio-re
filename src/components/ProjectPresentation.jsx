import React, { useRef, useEffect, useState } from 'react';
import ProjectSlide from './ProjectSlide';

const ProjectPresentation = ({ projects }) => {
  const containerRef = useRef(null);
  const pinContainerRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
      const { gsap, ScrollTrigger } = window;

      // Calculate total scroll distance needed (more height for smoother transitions)
      const totalHeight = window.innerHeight * projects.length * 1.5;

      // Create the pinned scroll experience
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: pinContainerRef.current,
          start: "top top",
          end: `+=${totalHeight}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Calculate which slide should be active based on scroll progress
            const progress = self.progress;
            const slideProgress = progress * projects.length;
            const currentSlide = Math.floor(slideProgress);
            
            if (currentSlide !== activeSlide && currentSlide < projects.length) {
              setActiveSlide(currentSlide);
            }

            // Linear interpolation helper
            const lerp = (start, end, progress) => start + (end - start) * progress;
            
            // Smooth easing function
            const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

            // Animate each project with smooth vertical transitions
            projects.forEach((_, index) => {
              const slideElement = pinContainerRef.current?.querySelector(`[data-slide="${index}"]`);
              if (!slideElement) return;

              // Calculate this slide's individual progress (0 to 1)
              const slideStart = index / projects.length;
              const slideEnd = (index + 1) / projects.length;
              const slideLocalProgress = Math.max(0, Math.min(1, (progress - slideStart) / (slideEnd - slideStart)));

              const isLastSlide = index === projects.length - 1;
              const isFirstSlide = index === 0;
              
              // Determine if this slide or the next should be visible
              const nextSlideStart = (index + 1) / projects.length;
              const showCurrentSlide = progress >= slideStart && progress <= slideEnd;
              const showAsNext = index > 0 && progress >= slideStart - (1/projects.length) && progress < slideStart;

              if (showCurrentSlide || showAsNext) {
                gsap.set(slideElement, {
                  opacity: 1,
                  visibility: 'visible'
                });

                let yPosition = 0;
                let scale = 1;
                let opacity = 1;

                if (showAsNext) {
                  // This slide is coming up from below
                  const prevSlideProgress = (progress - (slideStart - (1/projects.length))) * projects.length;
                  const transitionStart = 0.4;
                  const transitionEnd = 0.9;
                  
                  if (prevSlideProgress >= transitionStart) {
                    const transitionProgress = Math.min(1, (prevSlideProgress - transitionStart) / (transitionEnd - transitionStart));
                    const easedProgress = easeInOutCubic(transitionProgress);
                    yPosition = lerp(100, 0, easedProgress); // Coming from below
                    opacity = easedProgress;
                  } else {
                    yPosition = 100; // Start below viewport
                    opacity = 0;
                  }
                } else {
                  // This is the current slide
                  const transitionStart = 0.4;
                  const transitionEnd = 0.9;
                  
                  if (!isLastSlide && slideLocalProgress >= transitionStart) {
                    // Start transitioning out (going up and scaling down)
                    const transitionProgress = Math.min(1, (slideLocalProgress - transitionStart) / (transitionEnd - transitionStart));
                    const easedProgress = easeInOutCubic(transitionProgress);
                    
                    yPosition = lerp(0, -50, easedProgress); // Moving up slightly
                    scale = lerp(1, 0.7, easedProgress); // Scaling down
                    opacity = lerp(1, 0.3, easedProgress); // Fading out
                  } else {
                    // Normal state
                    yPosition = 0;
                    scale = 1;
                    opacity = 1;
                  }
                }

                gsap.set(slideElement, {
                  y: yPosition + '%',
                  scale: scale,
                  opacity: opacity,
                  transformOrigin: "center center"
                });
              } else {
                // This slide is not visible
                gsap.set(slideElement, {
                  opacity: 0,
                  visibility: 'hidden',
                  y: index < Math.floor(progress * projects.length) ? '-100%' : '100%'
                });
              }
            });
          }
        }
      });

      // Initial setup - position all slides correctly
      projects.forEach((_, index) => {
        const slideElement = pinContainerRef.current?.querySelector(`[data-slide="${index}"]`);
        if (slideElement) {
          gsap.set(slideElement, {
            opacity: index === 0 ? 1 : 0,
            visibility: index === 0 ? 'visible' : 'hidden',
            scale: 1,
            y: index === 0 ? '0%' : '100%',
            transformOrigin: "center center"
          });
        }
      });

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === pinContainerRef.current) {
            st.kill();
          }
        });
        masterTimeline.kill();
      };
    }
  }, [projects, activeSlide]);

  return (
    <div ref={containerRef} className="project-presentation">
      <div className="project-presentation-header">
        <h2 className="section-title">Featured Projects</h2>
      </div>
      
      <div ref={pinContainerRef} className="project-presentation-pin-container">
        <div className="project-presentation-container">
          {projects.map((project, index) => (
            <ProjectSlide
              key={project.id}
              project={project}
              index={index}
              isActive={activeSlide === index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectPresentation;