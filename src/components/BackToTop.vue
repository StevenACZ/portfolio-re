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
import { onMounted, onUnmounted, ref } from "vue";
import "../styles/BackToTop.css";

const isVisible = ref(false);
const scrollProgress = ref(0);

function updateState() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = (scrollTop / docHeight) * 100;
  isVisible.value = scrollTop > 400;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  updateState();
  window.addEventListener("scroll", updateState, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateState);
});
</script>
