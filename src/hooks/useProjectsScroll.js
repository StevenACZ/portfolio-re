import { useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Custom hook for managing magnetic scroll animations in ProjectsSection
 * Handles pinned scrolling with Apple-style magnetic zones
 */
export function useProjectsScroll(sectionRef, projects) {
  // Memoize calculations that don't change between renders
  const totalPhases = useMemo(() => 1 + projects.length, [projects.length]);
  const totalHeight = useMemo(
    () => totalPhases * 1.8 * window.innerHeight,
    [totalPhases]
  );

  const { contextSafe } = useGSAP(
    () => {
      if (!projects.length) return;

      const section = sectionRef.current;
      if (!section) return;

      const header = section.querySelector(".projects-header");

      // Set initial states
      gsap.set(header, { opacity: 1, y: 0 });

      projects.forEach((_, index) => {
        const card = section.querySelector(`[data-project="${index}"]`);
        if (!card) return;
        gsap.set(card, { opacity: 0, y: 0 });
        card.classList.add("hidden");
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top+=6rem top",
        end: `+=${totalHeight}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
        refreshPriority: -1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const phaseProgress = progress * totalPhases;
          const currentPhase = Math.floor(phaseProgress);
          let phaseLocalProgress = phaseProgress - currentPhase;

          // Create magnetic zones: each project stays visible longer
          if (phaseLocalProgress > 0.2 && phaseLocalProgress < 0.8) {
            const normalizedMiddle = (phaseLocalProgress - 0.2) / 0.6;
            const slowProgress = normalizedMiddle * 0.3;
            phaseLocalProgress = 0.2 + slowProgress;
          }

          // Phase 0: Title visible, then fades upward
          if (currentPhase === 0) {
            animateTitlePhase(
              header,
              section,
              projects,
              phaseLocalProgress,
              gsap
            );
          }
          // Project phases
          else if (currentPhase >= 1 && currentPhase <= projects.length) {
            animateProjectPhases(
              header,
              section,
              projects,
              currentPhase,
              phaseLocalProgress,
              gsap
            );
          }
        },
      });
    },
    { dependencies: [projects, totalPhases, totalHeight] }
  );

  return { contextSafe };
}

// Helper: Animate title phase (phase 0)
function animateTitlePhase(header, section, projects, phaseLocalProgress, gsap) {
  const navbarHeight =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--navbar-height"
      )
    ) || 80;
  const buffer = 150;
  const titleMaxDistance = window.innerHeight / 2 + navbarHeight + buffer;
  const opacity = Math.max(0, 1 - phaseLocalProgress * 1.8);

  gsap.to(header, {
    opacity: opacity,
    y: -titleMaxDistance * phaseLocalProgress,
    duration: 0.2,
    ease: "power2.out",
  });

  if (opacity < 0.1) {
    header.classList.add("hidden");
  } else {
    header.classList.remove("hidden");
  }

  // Hide all projects during title phase
  projects.forEach((_, index) => {
    const card = section.querySelector(`[data-project="${index}"]`);
    if (card) {
      const currentY = gsap.getProperty(card, "y");
      gsap.to(card, {
        opacity: 0,
        y: currentY,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
        immediateRender: false,
      });
      card.classList.add("hidden");
    }
  });
}

// Helper: Animate project phases
function animateProjectPhases(
  header,
  section,
  projects,
  currentPhase,
  phaseLocalProgress,
  gsap
) {
  // Hide title completely
  gsap.to(header, {
    opacity: 0,
    y: -30,
    duration: 0.25,
    ease: "power2.out",
    overwrite: "auto",
    immediateRender: false,
  });
  header.classList.add("hidden");

  const projectIndex = currentPhase - 1;

  projects.forEach((_, index) => {
    const card = section.querySelector(`[data-project="${index}"]`);
    if (!card) return;

    if (index === projectIndex) {
      animateCurrentProject(
        card,
        index,
        projects.length,
        phaseLocalProgress,
        gsap
      );
    } else {
      // Hide other projects
      const currentY = gsap.getProperty(card, "y");
      gsap.to(card, {
        opacity: 0,
        y: currentY,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
        immediateRender: false,
      });
      card.classList.add("hidden");
    }
  });
}

// Helper: Animate the current visible project
function animateCurrentProject(
  card,
  index,
  totalProjects,
  phaseLocalProgress,
  gsap
) {
  const isLastProject = index === totalProjects - 1;

  if (isLastProject) {
    // Last project: appears and stays with magnetic zone
    let easedProgress;
    if (phaseLocalProgress <= 0.5) {
      easedProgress = gsap.utils.mapRange(0, 0.5, 0, 1, phaseLocalProgress);
    } else {
      easedProgress = 1;
    }

    gsap.to(card, {
      opacity: easedProgress,
      y: 0,
      duration: 0.3,
      ease: "power3.out",
    });

    if (easedProgress > 0.1) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  } else {
    // Other projects: appear, stay visible, then exit upward
    let easedOpacity, yPosition;

    if (phaseLocalProgress <= 0.3) {
      easedOpacity = gsap.utils.mapRange(0, 0.3, 0, 1, phaseLocalProgress);
      yPosition = 0;
    } else if (phaseLocalProgress <= 0.7) {
      easedOpacity = 1;
      yPosition = 0;
    } else {
      const exitProgress = gsap.utils.mapRange(
        0.8,
        1,
        0,
        1,
        phaseLocalProgress
      );
      easedOpacity = Math.max(0, 1 - exitProgress);

      const navbarHeight =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--navbar-height"
          )
        ) || 80;
      const buffer = 20;
      const maxDistance = window.innerHeight / 2 + navbarHeight + buffer;
      yPosition = -maxDistance * exitProgress;
    }

    gsap.to(card, {
      opacity: easedOpacity,
      y: yPosition,
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
      immediateRender: false,
    });

    if (easedOpacity > 0.05) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  }
}

export default useProjectsScroll;
