import { TechIcons } from "./icons/TechIcons";

const SkillChip = ({ skill }) => {
  return (
    <div
      className="skill-chip"
      style={{
        "--skill-color": skill.color,
      }}
    >
      <div className="skill-chip-icon">{TechIcons[skill.icon]}</div>
      <span className="skill-chip-name">{skill.name}</span>
    </div>
  );
};

export default SkillChip;
