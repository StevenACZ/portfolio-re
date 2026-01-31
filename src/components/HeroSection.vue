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
import { gsap } from "../lib/gsap";
import ErrorBoundary from "./ErrorBoundary.vue";
import Typewriter from "./Typewriter.vue";
import "../styles/HeroSection.css";

const ThreeScene = defineAsyncComponent(() => import("./ThreeScene.vue"));

const canvasRef = ref(null);
const isLoaded = ref(false);
const show3D = ref(false);

let timerId = null;
let entranceTl = null;

function getAnimationConfig() {
  const rootStyles = getComputedStyle(document.documentElement);

  return {
    duration: {
      hero:
        parseFloat(rootStyles.getPropertyValue("--animation-duration-hero")) ||
        1,
      heroLong:
        parseFloat(
          rootStyles.getPropertyValue("--animation-duration-hero-long")
        ) || 1.2,
      heroText:
        parseFloat(
          rootStyles.getPropertyValue("--animation-duration-hero-text")
        ) || 0.8,
    },
    distance: {
      medium:
        parseInt(rootStyles.getPropertyValue("--animation-distance-medium")) ||
        50,
      small:
        parseInt(rootStyles.getPropertyValue("--animation-distance-small")) ||
        30,
    },
  };
}

function animateHeroEntrance() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reducedMotion) return;

  const config = getAnimationConfig();
  const heroGreeting = document.querySelector(".hero-greeting");
  const heroName = document.querySelector(".hero-name");
  const typewriterText = document.querySelector(".hero-title");
  const heroDescription = document.querySelector(".hero-description");

  entranceTl = gsap.timeline();

  if (heroGreeting) {
    entranceTl.fromTo(
      heroGreeting,
      { y: config.distance.medium, opacity: 0 },
      { y: 0, opacity: 1, duration: config.duration.hero, ease: "power3.out" }
    );
  }

  if (heroName) {
    entranceTl.fromTo(
      heroName,
      { y: config.distance.medium, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: config.duration.heroLong,
        ease: "back.out(1.7)",
      },
      "-=0.6"
    );
  }

  if (typewriterText) {
    entranceTl.fromTo(
      typewriterText,
      { y: config.distance.small, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: config.duration.heroText,
        ease: "power3.out",
        delay: 0.5,
      },
      "-=0.5"
    );
  }

  if (heroDescription) {
    entranceTl.fromTo(
      heroDescription,
      { y: config.distance.small, opacity: 0 },
      { y: 0, opacity: 1, duration: config.duration.hero, ease: "power3.out" },
      "-=0.3"
    );
  }
}

function scrollToProjects() {
  const projectsSection = document.getElementById("projects");
  projectsSection?.scrollIntoView({ behavior: "smooth" });
}

onMounted(() => {
  timerId = window.setTimeout(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReducedMotion) show3D.value = true;
    animateHeroEntrance();
  }, 500);
});

onUnmounted(() => {
  if (timerId) window.clearTimeout(timerId);
  entranceTl?.kill?.();
});
</script>
