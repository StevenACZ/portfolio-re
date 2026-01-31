<template>
  <div v-if="hasError" class="error-boundary-fallback">
    <slot name="fallback">
      <div class="error-message">
        <div class="error-icon">⚠️</div>
        <h3>3D Graphics Error</h3>
        <p>Unable to load 3D graphics. This might be due to:</p>
        <ul>
          <li>WebGL not being supported by your browser</li>
          <li>Hardware limitations</li>
          <li>Graphics driver issues</li>
        </ul>
        <p>The website will continue to work normally without 3D effects.</p>
        <details v-if="isDev" class="error-details">
          <summary>Error Details (Development)</summary>
          <pre>{{ errorText }}</pre>
          <pre>{{ errorInfo }}</pre>
        </details>
      </div>
    </slot>
  </div>
  <slot v-else />
</template>

<script setup>
import { computed, onErrorCaptured, ref } from "vue";
import "../styles/ErrorBoundary.css";

const isDev = import.meta.env.DEV;

const hasError = ref(false);
const error = ref(null);
const errorInfo = ref("");

const errorText = computed(() => {
  if (!error.value) return "";
  return error.value instanceof Error
    ? error.value.toString()
    : String(error.value);
});

onErrorCaptured((err, _instance, info) => {
  // eslint-disable-next-line no-console
  console.error("ErrorBoundary caught an error:", err, info);
  hasError.value = true;
  error.value = err;
  errorInfo.value = info;
  return false;
});
</script>
