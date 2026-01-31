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
import { runIdle } from "./utils/idle";
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
let resizeTimeout = null;
let sectionObserver = null;

function refreshScrollTriggerSoon() {
  runIdle(() => ScrollTrigger.refresh(), { timeout: 200 });
}

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
      refreshScrollTriggerSoon();
    },
  });
}

function handleResize() {
  if (resizeTimeout) window.clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    refreshScrollTriggerSoon();
  }, 100);
}

onMounted(() => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const sectionIds = [
    "hero",
    "skills",
    "projects",
    "macos-apps",
    "timeline",
    "footer",
  ];

  if (typeof IntersectionObserver !== "undefined") {
    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (!entry.target?.id) return;
          activeSection.value = entry.target.id;
        });
      },
      { rootMargin: "-20% 0px -79% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      sectionObserver.observe(el);
    });
  }

  window.addEventListener("resize", handleResize, { passive: true });
});

onUnmounted(() => {
  sectionObserver?.disconnect();
  sectionObserver = null;
  window.removeEventListener("resize", handleResize);
  if (resizeTimeout) window.clearTimeout(resizeTimeout);
});
</script>
