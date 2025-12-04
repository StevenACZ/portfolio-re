import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const useScrollSpy = (sections) => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    if (!sections || sections.length === 0) return;

    // Crear ScrollTriggers para cada sección
    const scrollTriggers = sections.map((section) => {
      return ScrollTrigger.create({
        trigger: section.ref.current,
        start: 'top 20%',
        end: 'bottom 20%',
        onEnter: () => setActiveSection(section.name),
        onEnterBack: () => setActiveSection(section.name),
      });
    });

    // Cleanup function
    return () => {
      scrollTriggers.forEach((st) => st.kill());
    };
  }, [sections]);

  return activeSection;
};
