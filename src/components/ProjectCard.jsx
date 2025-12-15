import { useState, memo, useMemo } from "react";
import { Github, ExternalLink } from "lucide-react";
import LazyImage from "./LazyImage";

const ProjectCard = memo(({ project, index, contextSafe }) => {
  const isEven = useMemo(() => index % 2 === 0, [index]);
  const [overlayActive, setOverlayActive] = useState(false);

  const handleImageClick = contextSafe(() => {
    setOverlayActive(!overlayActive);
  });

  const hasValidLinks = useMemo(
    () =>
      (project.github && project.github !== "#") ||
      (project.demo && project.demo !== "#"),
    [project.github, project.demo]
  );

  return (
    <article
      className={`project-card ${isEven ? "image-right" : "image-left"}`}
      data-project={index}
      role="article"
      aria-labelledby={`project-title-${project.id}`}
      aria-describedby={`project-description-${project.id}`}
    >
      <div className="project-content">
        <div className="project-info">
          <div
            className="project-number"
            aria-label={`Project ${index + 1} of ${index + 1}`}
          >
            {String(index + 1).padStart(2, "0")}
          </div>
          <h3 id={`project-title-${project.id}`} className="project-title">
            {project.title}
          </h3>
          <p
            id={`project-description-${project.id}`}
            className="project-description"
          >
            {project.description}
          </p>

          <div
            className="project-tech"
            role="list"
            aria-label={`Technologies used in ${project.title}`}
          >
            {project.tech.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="tech-tag"
                role="listitem"
                aria-label={`Technology: ${tech}`}
              >
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
              className={`project-image ${hasValidLinks ? "interactive" : ""} ${overlayActive ? "overlay-active" : ""}`}
              onClick={hasValidLinks ? handleImageClick : undefined}
              onKeyDown={
                hasValidLinks
                  ? contextSafe((e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOverlayActive(!overlayActive);
                      }
                    })
                  : undefined
              }
              tabIndex={hasValidLinks ? 0 : -1}
              role={hasValidLinks ? "button" : "img"}
              aria-label={
                hasValidLinks
                  ? `${overlayActive ? "Hide" : "Show"} project links for ${project.title}`
                  : `Screenshot of ${project.title} project`
              }
              aria-expanded={hasValidLinks ? overlayActive : undefined}
            >
              {project.image ? (
                <LazyImage
                  src={project.image}
                  alt={project.alt || project.title}
                  className="project-lazy-image"
                  skeletonHeight="300px"
                  threshold={0.2}
                  fadeInDuration={400}
                />
              ) : (
                <div className="project-placeholder">
                  <span>{project.title}</span>
                </div>
              )}

              {hasValidLinks && (
                <div className="project-overlay">
                  <div className="overlay-links">
                    {project.github && project.github !== "#" && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="overlay-link"
                        aria-label={`View ${project.title} source code on GitHub`}
                        onClick={contextSafe((e) => {
                          e.stopPropagation();
                          if (window.innerWidth <= 768 && !overlayActive) {
                            e.preventDefault();
                          }
                        })}
                      >
                        <Github size={24} aria-hidden="true" />
                        <span className="sr-only">
                          View {project.title} source code on GitHub
                        </span>
                      </a>
                    )}
                    {project.demo && project.demo !== "#" && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="overlay-link"
                        aria-label={`View ${project.title} live demo`}
                        onClick={contextSafe((e) => {
                          e.stopPropagation();
                          if (window.innerWidth <= 768 && !overlayActive) {
                            e.preventDefault();
                          }
                        })}
                      >
                        <ExternalLink size={24} aria-hidden="true" />
                        <span className="sr-only">
                          View {project.title} live demo
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
