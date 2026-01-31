<template>
  <div class="scroll-progress-container" aria-hidden="true">
    <div class="scroll-progress-bar" :style="{ width: `${progress}%` }" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import "../styles/ScrollProgress.css";

const progress = ref(0);

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = (scrollTop / docHeight) * 100;
}

onMounted(() => {
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateProgress);
});
</script>
