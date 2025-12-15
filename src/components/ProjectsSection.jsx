import { useRef } from "react";
import { useProjectsScroll } from "../hooks/useProjectsScroll";
import ProjectCard from "./ProjectCard";
import "../styles/ProjectsSection.css";

const ProjectsSection = ({ projects = [] }) => {
  const sectionRef = useRef(null);
  const { contextSafe } = useProjectsScroll(sectionRef, projects);

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
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            contextSafe={contextSafe}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
