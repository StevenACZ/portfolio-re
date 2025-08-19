import React from 'react';

const ProjectSlide = ({ project, index, isActive }) => {
  return (
    <div 
      className={`project-slide-simple ${isActive ? 'active' : ''}`}
      data-slide={index}
    >
      <div className="project-simple-card">
        <h3 className="project-simple-title">{project.title}</h3>
      </div>
    </div>
  );
};

export default ProjectSlide;