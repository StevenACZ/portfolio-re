<template>
  <div ref="sectionRef" class="projects-section">
    <div v-if="!projects.length" class="projects-empty">
      <p>No projects to display</p>
    </div>

    <template v-else>
      <div class="projects-header">
        <h2 class="section-title">Featured Projects</h2>
        <p class="section-subtitle">Here are some of my recent works</p>
      </div>

      <div class="projects-grid">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.id"
          :project="project"
          :index="index"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { gsap, ScrollTrigger } from "../lib/gsap";
import ProjectCard from "./ProjectCard.vue";
import "../styles/ProjectsSection.css";

const props = defineProps({
  projects: { type: Array, default: () => [] },
});

const sectionRef = ref(null);
let trigger = null;

function animateTitlePhase(header, section, phaseLocalProgress, totalProjects) {
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
    opacity,
    y: -titleMaxDistance * phaseLocalProgress,
    duration: 0.2,
    ease: "power2.out",
  });

  header.classList.toggle("hidden", opacity < 0.1);

  for (let index = 0; index < totalProjects; index++) {
    const card = section.querySelector(`[data-project="${index}"]`);
    if (!card) continue;
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
}

function animateCurrentProject(card, index, totalProjects, phaseLocalProgress) {
  const isLastProject = index === totalProjects - 1;

  if (isLastProject) {
    const easedProgress =
      phaseLocalProgress <= 0.5
        ? gsap.utils.mapRange(0, 0.5, 0, 1, phaseLocalProgress)
        : 1;

    gsap.to(card, {
      opacity: easedProgress,
      y: 0,
      duration: 0.3,
      ease: "power3.out",
    });

    card.classList.toggle("hidden", easedProgress <= 0.1);
    return;
  }

  let easedOpacity = 1;
  let yPosition = 0;

  if (phaseLocalProgress <= 0.3) {
    easedOpacity = gsap.utils.mapRange(0, 0.3, 0, 1, phaseLocalProgress);
    yPosition = 0;
  } else if (phaseLocalProgress <= 0.7) {
    easedOpacity = 1;
    yPosition = 0;
  } else {
    const exitProgress = gsap.utils.mapRange(0.8, 1, 0, 1, phaseLocalProgress);
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

  card.classList.toggle("hidden", easedOpacity <= 0.05);
}

function animateProjectPhases(
  header,
  section,
  currentPhase,
  phaseLocalProgress,
  totalProjects
) {
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

  for (let index = 0; index < totalProjects; index++) {
    const card = section.querySelector(`[data-project="${index}"]`);
    if (!card) continue;

    if (index === projectIndex) {
      animateCurrentProject(card, index, totalProjects, phaseLocalProgress);
      continue;
    }

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
}

onMounted(() => {
  if (!props.projects.length) return;
  const section = sectionRef.value;
  if (!section) return;

  const header = section.querySelector(".projects-header");
  if (!header) return;

  gsap.set(header, { opacity: 1, y: 0 });

  props.projects.forEach((_, index) => {
    const card = section.querySelector(`[data-project="${index}"]`);
    if (!card) return;
    gsap.set(card, { opacity: 0, y: 0 });
    card.classList.add("hidden");
  });

  const totalPhases = 1 + props.projects.length;

  trigger = ScrollTrigger.create({
    trigger: section,
    start: "top+=6rem top",
    end: () => `+=${totalPhases * 1.8 * window.innerHeight}`,
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

      if (phaseLocalProgress > 0.2 && phaseLocalProgress < 0.8) {
        const normalizedMiddle = (phaseLocalProgress - 0.2) / 0.6;
        const slowProgress = normalizedMiddle * 0.3;
        phaseLocalProgress = 0.2 + slowProgress;
      }

      if (currentPhase === 0) {
        animateTitlePhase(
          header,
          section,
          phaseLocalProgress,
          props.projects.length
        );
      } else if (currentPhase >= 1 && currentPhase <= props.projects.length) {
        animateProjectPhases(
          header,
          section,
          currentPhase,
          phaseLocalProgress,
          props.projects.length
        );
      }
    },
  });
});

onUnmounted(() => {
  trigger?.kill();
  trigger = null;
});
</script>
