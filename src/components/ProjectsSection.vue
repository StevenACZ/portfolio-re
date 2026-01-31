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
          :total="projects.length"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { onUnmounted, ref } from "vue";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useIntersectionOnce } from "../composables/useIntersectionOnce";
import { runIdle } from "../utils/idle";
import ProjectCard from "./ProjectCard.vue";
import "../styles/ProjectsSection.css";

const props = defineProps({
  projects: { type: Array, default: () => [] },
});

const sectionRef = ref(null);
let trigger = null;
let cancelIdle = null;
let headerEl = null;
let cardEls = [];

function initPinnedScroll() {
  if (!props.projects.length) return;
  const section = sectionRef.value;
  if (!section) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reducedMotion) return;

  headerEl = section.querySelector(".projects-header");
  if (!headerEl) return;

  cardEls = props.projects
    .map((_, index) => section.querySelector(`[data-project="${index}"]`))
    .filter(Boolean);

  const getNavbarHeight = () =>
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--navbar-height"
      )
    ) || 80;

  const headerOpacityTo = gsap.quickTo(headerEl, "opacity", {
    duration: 0.2,
    ease: "power2.out",
    overwrite: "auto",
  });
  const headerYTo = gsap.quickTo(headerEl, "y", {
    duration: 0.2,
    ease: "power2.out",
    overwrite: "auto",
  });

  const cardOpacityTo = cardEls.map((card) =>
    gsap.quickTo(card, "opacity", {
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
    })
  );
  const cardYTo = cardEls.map((card) =>
    gsap.quickTo(card, "y", {
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
    })
  );

  gsap.set(headerEl, { opacity: 1, y: 0 });
  cardEls.forEach((card) => {
    gsap.set(card, { opacity: 0, y: 0 });
    card.classList.add("hidden");
  });

  const totalPhases = 1 + props.projects.length;
  let navbarHeight = getNavbarHeight();
  let visibleIndex = null;

  const setVisibleIndex = (nextIndex) => {
    if (visibleIndex === nextIndex) return;
    visibleIndex = nextIndex;

    cardEls.forEach((card, index) => {
      const isVisible = nextIndex === index;
      card.classList.toggle("hidden", !isVisible);
      if (!isVisible) {
        cardOpacityTo[index](0);
        cardYTo[index](0);
      }
    });
  };

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
    onRefresh: () => {
      navbarHeight = getNavbarHeight();
    },
    onUpdate: (self) => {
      const progress = self.progress;
      const phaseProgress = progress * totalPhases;
      const currentPhase = Math.min(totalPhases - 1, Math.floor(phaseProgress));
      let phaseLocalProgress = phaseProgress - currentPhase;

      if (phaseLocalProgress > 0.2 && phaseLocalProgress < 0.8) {
        const normalizedMiddle = (phaseLocalProgress - 0.2) / 0.6;
        const slowProgress = normalizedMiddle * 0.3;
        phaseLocalProgress = 0.2 + slowProgress;
      }

      if (currentPhase === 0) {
        setVisibleIndex(null);

        const titleMaxDistance = window.innerHeight / 2 + navbarHeight + 150;
        const headerOpacity = Math.max(0, 1 - phaseLocalProgress * 1.8);

        headerOpacityTo(headerOpacity);
        headerYTo(-titleMaxDistance * phaseLocalProgress);
        headerEl.classList.toggle("hidden", headerOpacity < 0.1);
        return;
      }

      const projectIndex = currentPhase - 1;
      setVisibleIndex(projectIndex);

      headerOpacityTo(0);
      headerYTo(-30);
      headerEl.classList.add("hidden");

      const isLastProject = projectIndex === cardEls.length - 1;
      let opacity = 1;
      let y = 0;

      if (isLastProject) {
        opacity =
          phaseLocalProgress <= 0.5
            ? gsap.utils.mapRange(0, 0.5, 0, 1, phaseLocalProgress)
            : 1;
      } else if (phaseLocalProgress <= 0.3) {
        opacity = gsap.utils.mapRange(0, 0.3, 0, 1, phaseLocalProgress);
      } else if (phaseLocalProgress > 0.7) {
        const exitProgress = Math.min(
          1,
          Math.max(0, gsap.utils.mapRange(0.8, 1, 0, 1, phaseLocalProgress))
        );
        opacity = Math.max(0, 1 - exitProgress);

        const maxDistance = window.innerHeight / 2 + navbarHeight + 20;
        y = -maxDistance * exitProgress;
      }

      const activeIndex = Math.min(
        cardEls.length - 1,
        Math.max(0, projectIndex)
      );
      cardOpacityTo[activeIndex](opacity);
      cardYTo[activeIndex](y);
      cardEls[activeIndex]?.classList.toggle("hidden", opacity <= 0.05);
    },
  });
}

useIntersectionOnce(
  sectionRef,
  () => {
    cancelIdle = runIdle(() => initPinnedScroll(), { timeout: 500 });
  },
  { rootMargin: "800px 0px", threshold: 0.01 }
);

onUnmounted(() => {
  cancelIdle?.();
  if (headerEl) gsap.killTweensOf(headerEl);
  if (cardEls.length) gsap.killTweensOf(cardEls);
  trigger?.kill();
  trigger = null;
});
</script>
