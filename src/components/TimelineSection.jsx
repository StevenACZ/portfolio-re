import React, { useRef } from 'react';
import { MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const TimelineSection = ({ experiences, timelineRef }) => {
  const containerRef = useRef(null);

  // useGSAP hook for timeline animations
  useGSAP(
    () => {
      const isMobile = window.innerWidth <= 768;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) {
        return;
      }

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
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
            fastScrollEnd: true,
          },
        }
      );

      // Timeline items stagger animation
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
            trigger: containerRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
            fastScrollEnd: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={timelineRef} className="timeline">
      <div ref={containerRef} className="container">
        <h2 className="section-title">Experience</h2>
        <div className="timeline-container">
          <div className="timeline-line"></div>
          {experiences.map((exp, index) => (
            <div
              key={exp.id}
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
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
  );
};

export default TimelineSection;
