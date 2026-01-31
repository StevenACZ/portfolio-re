<template>
  <section
    id="hero"
    class="hero-section"
    aria-label="Introduction and hero section"
    :style="{ aspectRatio: '16/9' }"
  >
    <canvas
      ref="canvasRef"
      class="hero-canvas"
      aria-hidden="true"
      :style="{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }"
    />

    <div
      class="hero-fallback-bg"
      :style="{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background:
          'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #16213e 100%)',
        opacity: isLoaded ? 0 : 1,
        transition: 'opacity 0.5s ease-in-out',
        zIndex: 0,
      }"
    />

    <div class="hero-content" :style="{ zIndex: 2 }">
      <div class="hero-text">
        <h1 class="hero-greeting">Hi, I&apos;m</h1>
        <h2
          class="hero-name"
          aria-label="Steven Coaila Zaa, Full Stack Developer"
        >
          Steven Coaila Zaa
        </h2>
        <div
          class="hero-subtitle"
          role="text"
          aria-live="polite"
          aria-label="Dynamic title showing different specializations"
        >
          <Typewriter class="hero-title" />
        </div>
        <p
          class="hero-description"
          aria-label="Professional summary and approach"
        >
          Creating innovative digital experiences with modern web technologies.
          Passionate about clean code, beautiful design, and exceptional user
          experiences.
        </p>
        <div class="hero-cta-container">
          <button
            class="hero-cta hero-cta-primary"
            aria-label="View my projects"
            type="button"
            @click="scrollToProjects"
          >
            <span>View Projects</span>
            <ArrowRight class="cta-icon" :size="20" :stroke-width="2" />
          </button>

          <a
            href="mailto:scoaila@proton.me"
            class="hero-cta hero-cta-secondary"
            aria-label="Send me an email"
          >
            <span>Contact Me</span>
            <Mail class="cta-icon" :size="20" :stroke-width="2" />
          </a>
        </div>
      </div>
    </div>

    <ErrorBoundary v-if="show3D">
      <Suspense>
        <template #default>
          <ThreeScene :canvas="canvasRef" @loaded="isLoaded = true" />
        </template>
        <template #fallback></template>
      </Suspense>
    </ErrorBoundary>
  </section>
</template>

<script setup>
import { defineAsyncComponent, onMounted, onUnmounted, ref } from "vue";
import { ArrowRight, Mail } from "lucide-vue-next";
import { runIdle } from "../utils/idle";
import ErrorBoundary from "./ErrorBoundary.vue";
import Typewriter from "./Typewriter.vue";
import "../styles/HeroSection.css";

const ThreeScene = defineAsyncComponent(() => import("./ThreeScene.vue"));

const canvasRef = ref(null);
const isLoaded = ref(false);
const show3D = ref(false);

let cancelIdle = null;

function shouldEnable3D() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return false;

  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  if (connection?.saveData) return false;

  const effectiveType = connection?.effectiveType;
  if (effectiveType === "slow-2g" || effectiveType === "2g") return false;

  return true;
}

function scrollToProjects() {
  const projectsSection = document.getElementById("projects");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  projectsSection?.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}

onMounted(() => {
  if (!shouldEnable3D()) return;

  cancelIdle = runIdle(
    () => {
      show3D.value = true;
    },
    { timeout: 1500 }
  );
});

onUnmounted(() => {
  cancelIdle?.();
});
</script>
