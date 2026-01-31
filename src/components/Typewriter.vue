<template>
  <span ref="el" />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import Typed from "typed.js";

const props = defineProps({
  delay: { type: Number, default: 1500 },
});

const el = ref(null);
let typedInstance = null;
let timerId = null;

onMounted(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    if (el.value) el.value.textContent = "Full Stack Developer";
    return;
  }

  timerId = window.setTimeout(() => {
    if (!el.value) return;

    typedInstance = new Typed(el.value, {
      strings: [
        "Full Stack Developer",
        "Swift Developer",
        "Creative Problem Solver",
        "UX Enthusiast",
        "React Specialist",
        "Mobile App Creator",
      ],
      typeSpeed: 80,
      backSpeed: 60,
      backDelay: 2000,
      startDelay: 0,
      loop: true,
      smartBackspace: true,
      showCursor: true,
      cursorChar: "|",
      autoInsertCss: true,
      contentType: "text",
    });
  }, props.delay);
});

onUnmounted(() => {
  if (timerId) window.clearTimeout(timerId);
  typedInstance?.destroy();
});
</script>
