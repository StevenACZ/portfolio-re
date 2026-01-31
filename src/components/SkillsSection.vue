<template>
  <div ref="sectionRef" class="skills-section">
    <div id="skills" class="skills-anchor" />

    <div class="skills-header">
      <h2 class="section-title">Tech Stack</h2>
      <p class="section-subtitle">Technologies I use to bring ideas to life</p>
    </div>

    <div class="skills-filter">
      <button
        v-for="cat in skillCategories"
        :key="cat.id"
        class="filter-btn"
        :class="{ active: activeCategory === cat.id }"
        type="button"
        @click="activeCategory = cat.id"
      >
        {{ cat.label }}
      </button>
    </div>

    <div ref="chipsContainerRef" class="skills-chips-grid">
      <SkillChip
        v-for="skill in filteredSkills"
        :key="skill.name"
        :skill="skill"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { gsap } from "../lib/gsap";
import { skillsData, skillCategories } from "../data/skills";
import SkillChip from "./SkillChip.vue";
import "../styles/SkillsSection.css";

const sectionRef = ref(null);
const chipsContainerRef = ref(null);
const activeCategory = ref("all");
const hasEntered = ref(false);

const filteredSkills = computed(() => {
  if (activeCategory.value === "all") return skillsData;
  return skillsData.filter((skill) => skill.category === activeCategory.value);
});

let headerTrigger = null;

function animateChips() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reducedMotion) return;

  const container = chipsContainerRef.value;
  if (!container) return;

  const chips = container.querySelectorAll(".skill-chip");
  if (!chips.length) return;
  gsap.fromTo(
    chips,
    { scale: 0.8, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: "back.out(1.7)",
      stagger: 0.03,
      overwrite: "auto",
    }
  );
}

onMounted(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reducedMotion || !sectionRef.value) return;

  const header = sectionRef.value.querySelector(".skills-header");
  const filters = sectionRef.value.querySelector(".skills-filter");

  headerTrigger = gsap.fromTo(
    [header, filters],
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: "top 80%",
        once: true,
        onEnter: () => {
          hasEntered.value = true;
          animateChips();
        },
      },
    }
  );
});

watch(activeCategory, async () => {
  if (!hasEntered.value) return;
  await nextTick();
  animateChips();
});

onUnmounted(() => {
  headerTrigger?.scrollTrigger?.kill();
  headerTrigger?.kill?.();
});
</script>
