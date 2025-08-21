import React from 'react';
import { MapPin } from 'lucide-react';

const TimelineSection = ({ experiences, timelineRef }) => {
  return (
    <section ref={timelineRef} className="timeline">
      <div className="container">
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
