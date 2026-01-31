<template>
  <div class="three-scene" aria-hidden="true" />
</template>

<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import { runThreeScene } from "../lib/threeScene/runThreeScene";

const props = defineProps({
  canvas: { type: Object, default: null },
});

const emit = defineEmits(["loaded"]);

let cleanup = null;

onMounted(() => {
  if (!props.canvas) return;
  cleanup = runThreeScene(props.canvas, { onLoaded: () => emit("loaded") });
});

watch(
  () => props.canvas,
  (nextCanvas) => {
    if (!nextCanvas || cleanup) return;
    cleanup = runThreeScene(nextCanvas, { onLoaded: () => emit("loaded") });
  }
);

onUnmounted(() => {
  cleanup?.();
  cleanup = null;
});
</script>
