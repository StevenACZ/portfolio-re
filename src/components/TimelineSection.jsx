import React, { useRef } from 'react';
import { MapPin } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import '../styles/Timeline.css';

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

      // Wait for elements to be rendered
      const timer = setTimeout(() => {
        // Force initial state for timeline line
        const timelineLine = containerRef.current?.querySelector('.timeline-line');
        if (timelineLine) {
          gsap.set(timelineLine, {
            scaleY: 0,
            transformOrigin: 'top center',
            visibility: 'visible',
          });

          // Timeline line draw animation - scroll-linked
          gsap.to(timelineLine, {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              end: 'bottom 100%', // Complete the animation when timeline section fully exits viewport
              scrub: 1.5,
              markers: false, // Set to true for debugging
            },
          });
        }

        // Force initial state for timeline items
        const timelineItems = containerRef.current?.querySelectorAll('.timeline-item');
        if (timelineItems && timelineItems.length > 0) {
          timelineItems.forEach((item, index) => {
            gsap.set(item, {
              y: 50,
              opacity: 0,
              visibility: 'visible',
            });

            // Individual animation for each timeline item
            gsap.to(item, {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                fastScrollEnd: true,
              },
            });
          });
        }
      }, 100);

      return () => {
        clearTimeout(timer);
      };
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
