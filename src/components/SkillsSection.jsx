import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { skillsData, skillCategories } from "../data/skills";
import SkillChip from "./SkillChip";
import "../styles/SkillsSection.css";

const SkillsSection = ({ skillsRef }) => {
  const sectionRef = useRef(null);
  const chipsContainerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [hasAnimatedHeader, setHasAnimatedHeader] = useState(false);

  const filteredSkills =
    activeCategory === "all"
      ? skillsData
      : skillsData.filter((skill) => skill.category === activeCategory);

  // Header animation - only once on scroll
  useGSAP(
    () => {
      if (hasAnimatedHeader) return;

      const section = sectionRef.current;
      const header = section.querySelector(".skills-header");
      const filters = section.querySelector(".skills-filter");

      gsap.fromTo(
        [header, filters],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
            onEnter: () => setHasAnimatedHeader(true),
          },
        }
      );
    },
    { scope: sectionRef }
  );

  // Chips animation - on category change
  useEffect(() => {
    const container = chipsContainerRef.current;
    if (!container) return;

    const chips = container.querySelectorAll(".skill-chip");

    gsap.fromTo(
      chips,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
        stagger: 0.03,
      }
    );
  }, [activeCategory]);

  return (
    <div ref={sectionRef} className="skills-section">
      <div ref={skillsRef} className="skills-anchor" />
      <div className="skills-header">
        <h2 className="section-title">Tech Stack</h2>
        <p className="section-subtitle">
          Technologies I use to bring ideas to life
        </p>
      </div>

      {/* Category Filter */}
      <div className="skills-filter">
        {skillCategories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-btn ${
              activeCategory === cat.id ? "active" : ""
            }`}
            onClick={() => setActiveCategory(cat.id)}
            type="button"
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div ref={chipsContainerRef} className="skills-chips-grid">
        {filteredSkills.map((skill) => (
          <SkillChip key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
