<template>
  <ScrollProgress />

  <div class="portfolio">
    <Navbar :active-section="activeSection" @nav-click="handleNavClick" />

    <main id="main-content" role="main">
      <HeroSection />

      <section aria-label="Technical skills and technologies">
        <SkillsSection />
      </section>

      <section
        id="projects"
        class="projects"
        aria-label="Featured projects and portfolio"
      >
        <ProjectsSection :projects="projects" />
      </section>

      <MacOSAppsSection />

      <TimelineSection :experiences="experiences" />
    </main>

    <footer
      id="footer"
      role="contentinfo"
      aria-label="Contact information and site footer"
    >
      <Footer />
    </footer>

    <BackToTop />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { gsap, ScrollTrigger } from "./lib/gsap";
import BackToTop from "./components/BackToTop.vue";
import Footer from "./components/Footer.vue";
import HeroSection from "./components/HeroSection.vue";
import MacOSAppsSection from "./components/MacOSAppsSection.vue";
import Navbar from "./components/Navbar.vue";
import ProjectsSection from "./components/ProjectsSection.vue";
import ScrollProgress from "./components/ScrollProgress.vue";
import SkillsSection from "./components/SkillsSection.vue";
import TimelineSection from "./components/TimelineSection.vue";
import { experiences } from "./data/experiences";
import { projects } from "./data/projects";

const activeSection = ref("hero");
let sectionTriggers = [];
let resizeTimeout = null;

function getNavbarHeight() {
  const nav = document.querySelector(".navbar");
  if (nav && nav instanceof HTMLElement) return nav.offsetHeight;

  return (
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--navbar-height"
      )
    ) || 80
  );
}

function handleNavClick(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  const navbarHeight = getNavbarHeight();
  const targetY = target.getBoundingClientRect().top + window.pageYOffset;
  const y = targetY - (sectionId === "hero" ? 0 : navbarHeight);

  gsap.to(window, {
    duration: 1.2,
    scrollTo: { y, autoKill: false },
    ease: "power2.inOut",
    onComplete: () => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => ScrollTrigger.refresh(), {
          timeout: 200,
        });
      } else {
        window.setTimeout(() => ScrollTrigger.refresh(), 16);
      }
    },
  });
}

function handleResize() {
  if (resizeTimeout) window.clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => ScrollTrigger.refresh(), {
        timeout: 200,
      });
    } else {
      window.setTimeout(() => ScrollTrigger.refresh(), 16);
    }
  }, 100);
}

onMounted(() => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const sections = [
    { id: "hero", name: "hero" },
    { id: "skills", name: "skills" },
    { id: "projects", name: "projects" },
    { id: "macos-apps", name: "macos-apps" },
    { id: "timeline", name: "timeline" },
    { id: "footer", name: "footer" },
  ];

  sectionTriggers = sections
    .map((section) => {
      const el = document.getElementById(section.id);
      if (!el) return null;

      return ScrollTrigger.create({
        trigger: el,
        start: "top 20%",
        end: "bottom 20%",
        onEnter: () => (activeSection.value = section.name),
        onEnterBack: () => (activeSection.value = section.name),
      });
    })
    .filter(Boolean);

  window.addEventListener("resize", handleResize, { passive: true });
});

onUnmounted(() => {
  sectionTriggers.forEach((st) => st.kill());
  sectionTriggers = [];
  window.removeEventListener("resize", handleResize);
  if (resizeTimeout) window.clearTimeout(resizeTimeout);
});
</script>
