<template>
  <div class="skill-chip" :style="{ '--skill-color': skill.color }">
    <div class="skill-chip-icon">
      <TechIcon :name="skill.icon" />
    </div>
    <span class="skill-chip-name">{{ skill.name }}</span>
  </div>
</template>

<script setup>
import TechIcon from "./icons/TechIcon.vue";

defineProps({
  skill: { type: Object, required: true },
});
</script>
