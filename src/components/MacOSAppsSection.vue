<template>
  <section
    id="macos-apps"
    ref="sectionRef"
    class="macos-apps-section"
    aria-label="macOS native applications"
  >
    <div class="macos-apps-container">
      <div class="macos-apps-header">
        <div class="macos-badge">
          <Apple :size="18" />
          <span>macOS Native</span>
        </div>
        <h2 class="macos-apps-title">Apps Collection</h2>
        <p class="macos-apps-subtitle">
          Free &amp; open source productivity tools for Mac
        </p>
      </div>

      <div class="macos-apps-grid">
        <div
          v-for="(app, index) in macosApps"
          :key="app.id"
          class="macos-app-card"
          :data-app="index"
          :style="{ '--delay': `${index * 0.1}s` }"
        >
          <div class="app-icon-wrapper">
            <img
              v-if="app.icon"
              :src="app.icon"
              :alt="`${app.name} icon`"
              class="app-icon"
              loading="lazy"
            />
            <div v-else class="app-icon-placeholder">
              <Apple :size="32" />
            </div>
          </div>
          <h3 class="app-name">{{ app.name }}</h3>
          <p class="app-description">{{ app.description }}</p>

          <div class="app-links">
            <a
              v-if="app.github"
              :href="app.github"
              target="_blank"
              rel="noopener noreferrer"
              class="app-link app-github-link"
              :aria-label="`View ${app.name} on GitHub`"
            >
              <Github :size="16" />
              <span>Source</span>
            </a>
            <a
              v-if="app.demo"
              :href="app.demo"
              target="_blank"
              rel="noopener noreferrer"
              class="app-link app-demo-link"
              :aria-label="`View ${app.name} website`"
            >
              <ExternalLink :size="16" />
              <span>Website</span>
            </a>
          </div>
        </div>
      </div>

      <div class="macos-apps-cta">
        <a
          href="https://apps.stevenacz.com"
          target="_blank"
          rel="noopener noreferrer"
          class="macos-apps-link"
        >
          <span>Explore all apps</span>
          <ExternalLink :size="18" />
        </a>
      </div>
    </div>

    <div class="macos-apps-bg">
      <div class="macos-glow macos-glow-1"></div>
      <div class="macos-glow macos-glow-2"></div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { Apple, ExternalLink, Github } from "lucide-vue-next";
import { gsap } from "../lib/gsap";
import { onAppReady } from "../lib/appState";
import { getMotionTokens, prefersReducedMotion } from "../lib/motion";
import { macosApps } from "../data/macosApps";
import "../styles/MacOSAppsSection.css";

const sectionRef = ref(null);
const animations = [];
let stopReadyListener = null;

onMounted(() => {
  stopReadyListener = onAppReady(() => {
    const section = sectionRef.value;
    if (!section) return;

    if (prefersReducedMotion()) return;
    const { ease } = getMotionTokens();

    const header = section.querySelector(".macos-apps-header");
    const cards = section.querySelectorAll(".macos-app-card");
    const cta = section.querySelector(".macos-apps-cta");

    animations.push(
      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: ease.out,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      )
    );

    animations.push(
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: ease.out,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      )
    );

    animations.push(
      gsap.fromTo(
        cta,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: ease.out,
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      )
    );
  });
});

onUnmounted(() => {
  stopReadyListener?.();
  stopReadyListener = null;
  animations.forEach((a) => {
    a?.scrollTrigger?.kill();
    a?.kill?.();
  });
});
</script>
