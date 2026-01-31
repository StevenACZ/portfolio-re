<template>
  <div ref="rootRef" class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-info">
          <h3 id="contact-heading">Let&apos;s work together!</h3>
          <p aria-describedby="contact-heading">
            I&apos;m always open to new projects and interesting opportunities.
          </p>
        </div>

        <nav
          class="footer-links"
          role="navigation"
          aria-label="Social media and contact links"
        >
          <a
            v-for="link in socialLinks"
            :key="link.href"
            :href="link.href"
            class="footer-link"
            :target="link.isExternal ? '_blank' : undefined"
            :rel="link.isExternal ? 'noopener noreferrer' : undefined"
            :aria-label="`Contact via ${link.label}${link.isExternal ? ' (opens in new tab)' : ''}`"
          >
            <component
              :is="link.icon"
              :size="20"
              aria-hidden="true"
              focusable="false"
            />
            <span>{{ link.label }}</span>
          </a>
        </nav>
      </div>

      <div class="footer-bottom">
        <p
          role="contentinfo"
          :aria-label="`Copyright ${currentYear} Steven Coaila Zaa`"
        >
          &copy; {{ currentYear }} Steven Coaila Zaa. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { Github, Linkedin, Mail } from "lucide-vue-next";
import { gsap } from "../lib/gsap";
import { onAppReady } from "../lib/appState";
import { getMotionTokens, prefersReducedMotion } from "../lib/motion";
import "../styles/Footer.css";

const rootRef = ref(null);
const currentYear = computed(() => new Date().getFullYear());

const socialLinks = [
  {
    href: "mailto:scoaila@proton.me",
    icon: Mail,
    label: "scoaila@proton.me",
    isExternal: false,
  },
  {
    href: "https://www.linkedin.com/in/stevenacz/",
    icon: Linkedin,
    label: "LinkedIn",
    isExternal: true,
  },
  {
    href: "https://github.com/StevenACZ",
    icon: Github,
    label: "GitHub",
    isExternal: true,
  },
];

let footerTween = null;
let stopReadyListener = null;

onMounted(() => {
  stopReadyListener = onAppReady(() => {
    if (prefersReducedMotion() || !rootRef.value) return;
    const { ease } = getMotionTokens();

    const content = rootRef.value.querySelector(".footer-content");
    if (!content) return;

    footerTween = gsap.fromTo(
      content,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: ease.out,
        scrollTrigger: {
          trigger: rootRef.value,
          start: "top 90%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
        },
      }
    );
  });
});

onUnmounted(() => {
  stopReadyListener?.();
  stopReadyListener = null;
  footerTween?.scrollTrigger?.kill();
  footerTween?.kill?.();
});
</script>
