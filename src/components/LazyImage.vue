<template>
  <div
    ref="containerRef"
    class="lazy-image-container"
    :class="className"
    :style="{ minHeight: skeletonHeight }"
  >
    <div
      v-if="!imageSrc && !hasError"
      class="image-skeleton"
      :style="{ height: skeletonHeight }"
      role="img"
      aria-live="polite"
      aria-busy="true"
    >
      <span class="sr-only">Loading image...</span>
      <slot name="placeholder">
        <div class="skeleton-shimmer">
          <div class="skeleton-content">
            <div class="skeleton-line skeleton-title" />
            <div class="skeleton-line skeleton-subtitle" />
          </div>
        </div>
      </slot>
    </div>

    <div
      v-else-if="hasError"
      class="image-error"
      :style="{ height: skeletonHeight }"
      role="img"
      aria-describedby="image-error-text"
    >
      <div class="error-content">
        <span class="error-icon" aria-hidden="true">📷</span>
        <p id="image-error-text">Image not available</p>
      </div>
    </div>

    <img
      v-else
      :src="imageSrc"
      :alt="alt"
      class="lazy-image"
      :class="isLoaded ? 'loaded' : 'loading'"
      :style="{
        transition: `opacity ${fadeInDuration}ms ease-in-out`,
        opacity: isLoaded ? 1 : 0,
      }"
      loading="lazy"
      @load="handleImageLoad"
      @error="handleImageError"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  className: { type: String, default: "" },
  threshold: { type: Number, default: 0.1 },
  skeletonHeight: { type: String, default: "200px" },
  fadeInDuration: { type: Number, default: 300 },
});

const containerRef = ref(null);
const imageSrc = ref("");
const isLoaded = ref(false);
const hasError = ref(false);
let observer = null;

function startLoading() {
  if (!props.src || imageSrc.value) return;
  imageSrc.value = props.src;
}

function handleImageLoad() {
  isLoaded.value = true;
}

function handleImageError() {
  hasError.value = true;
  isLoaded.value = false;
}

watch(
  () => props.src,
  () => {
    imageSrc.value = "";
    isLoaded.value = false;
    hasError.value = false;
    startLoading();
  }
);

onMounted(() => {
  if (!containerRef.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        startLoading();
        observer?.disconnect();
        observer = null;
      }
    },
    {
      threshold: props.threshold,
      rootMargin: "50px",
    }
  );

  observer.observe(containerRef.value);
});

onUnmounted(() => {
  observer?.disconnect();
  observer = null;
});
</script>
