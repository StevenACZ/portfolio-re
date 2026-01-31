<template>
  <div class="scroll-progress-container" aria-hidden="true">
    <div class="scroll-progress-bar" :style="{ width: `${progress}%` }" />
  </div>
</template>

<script setup>
import { useScrollProgress } from "../composables/useScrollProgress";
import "../styles/ScrollProgress.css";

const { progress } = useScrollProgress();
</script>
