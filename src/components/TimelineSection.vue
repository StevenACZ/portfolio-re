<template>
  <section
    id="timeline"
    ref="sectionRef"
    class="timeline"
    aria-label="Professional experience and timeline"
  >
    <div ref="containerRef" class="container">
      <h2 class="section-title">Experience</h2>
      <div class="timeline-container">
        <div class="timeline-line"></div>
        <div
          v-for="(exp, index) in experiences"
          :key="exp.id"
          class="timeline-item"
          :class="index % 2 === 0 ? 'left' : 'right'"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-card">
            <div class="timeline-date">{{ exp.period }}</div>
            <h3 class="timeline-title">{{ exp.title }}</h3>
            <h4 class="timeline-company">{{ exp.company }}</h4>
            <div class="timeline-location">
              <MapPin :size="14" />
              <span>{{ exp.location }}</span>
            </div>
            <p class="timeline-description">{{ exp.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { MapPin } from "lucide-vue-next";
import { gsap } from "../lib/gsap";
import "../styles/Timeline.css";

defineProps({
  experiences: { type: Array, required: true },
});

const sectionRef = ref(null);
const containerRef = ref(null);
const animations = [];
let timerId = null;

onMounted(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reducedMotion) return;

  timerId = window.setTimeout(() => {
    const container = containerRef.value;
    if (!container) return;

    const timelineLine = container.querySelector(".timeline-line");
    if (timelineLine) {
      gsap.set(timelineLine, {
        scaleY: 0,
        transformOrigin: "top center",
        visibility: "visible",
      });

      animations.push(
        gsap.to(timelineLine, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 100%",
            scrub: 1.5,
          },
        })
      );
    }

    const timelineItems = container.querySelectorAll(".timeline-item");
    timelineItems.forEach((item) => {
      gsap.set(item, { y: 50, opacity: 0, visibility: "visible" });
      animations.push(
        gsap.to(item, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
            fastScrollEnd: true,
          },
        })
      );
    });
  }, 100);
});

onUnmounted(() => {
  if (timerId) window.clearTimeout(timerId);
  animations.forEach((a) => {
    a?.scrollTrigger?.kill();
    a?.kill?.();
  });
});
</script>
