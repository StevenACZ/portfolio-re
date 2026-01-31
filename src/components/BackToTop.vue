<template>
  <button
    class="back-to-top"
    :class="{ visible: isVisible }"
    aria-label="Scroll back to top"
    title="Back to top"
    type="button"
    @click="scrollToTop"
  >
    <svg class="progress-ring" viewBox="0 0 48 48">
      <circle
        class="progress-ring-bg"
        cx="24"
        cy="24"
        r="20"
        fill="none"
        stroke-width="3"
      />
      <circle
        class="progress-ring-fill"
        cx="24"
        cy="24"
        r="20"
        fill="none"
        stroke-width="3"
        :stroke-dasharray="`${scrollProgress * 1.257} 125.7`"
        stroke-linecap="round"
      />
    </svg>
    <svg
      class="arrow-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  </button>
</template>

<script setup>
import { computed } from "vue";
import { useScrollProgress } from "../composables/useScrollProgress";
import "../styles/BackToTop.css";

const { progress: scrollProgress, scrollY } = useScrollProgress();
const isVisible = computed(() => scrollY.value > 400);

function scrollToTop() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}
</script>
