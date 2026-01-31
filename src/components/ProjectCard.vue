<template>
  <article
    class="project-card"
    :class="isEven ? 'image-right' : 'image-left'"
    :data-project="index"
    role="article"
    :aria-labelledby="`project-title-${project.id}`"
    :aria-describedby="`project-description-${project.id}`"
  >
    <div class="project-content">
      <div class="project-info">
        <div
          class="project-number"
          :aria-label="`Project ${index + 1} of ${index + 1}`"
        >
          {{ String(index + 1).padStart(2, "0") }}
        </div>
        <h3 :id="`project-title-${project.id}`" class="project-title">
          {{ project.title }}
        </h3>
        <p
          :id="`project-description-${project.id}`"
          class="project-description"
        >
          {{ project.description }}
        </p>

        <div
          class="project-tech"
          role="list"
          :aria-label="`Technologies used in ${project.title}`"
        >
          <span
            v-for="(tech, techIndex) in project.tech"
            :key="techIndex"
            class="tech-tag"
            role="listitem"
            :aria-label="`Technology: ${tech}`"
          >
            {{ tech }}
          </span>
        </div>

        <div v-if="project.features" class="project-features">
          <h4 class="features-title">Key Features:</h4>
          <ul class="features-list">
            <li
              v-for="(feature, featureIndex) in project.features.slice(0, 3)"
              :key="featureIndex"
              class="feature-item"
            >
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>

      <div class="project-visual">
        <div class="project-showcase">
          <div
            class="project-image"
            :class="{
              interactive: hasValidLinks,
              'overlay-active': overlayActive,
            }"
            :tabindex="hasValidLinks ? 0 : -1"
            :role="hasValidLinks ? 'button' : 'img'"
            :aria-label="
              hasValidLinks
                ? `${overlayActive ? 'Hide' : 'Show'} project links for ${project.title}`
                : `Screenshot of ${project.title} project`
            "
            :aria-expanded="hasValidLinks ? overlayActive : undefined"
            @click="onImageClick"
            @keydown="onImageKeyDown"
          >
            <LazyImage
              v-if="project.image"
              :src="project.image"
              :alt="project.alt || project.title"
              class-name="project-lazy-image"
              skeleton-height="300px"
              :threshold="0.2"
              :fade-in-duration="400"
            />
            <div v-else class="project-placeholder">
              <span>{{ project.title }}</span>
            </div>

            <div v-if="hasValidLinks" class="project-overlay">
              <div class="overlay-links">
                <a
                  v-if="project.github && project.github !== '#'"
                  :href="project.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="overlay-link"
                  :aria-label="`View ${project.title} source code on GitHub`"
                  @click="onOverlayLinkClick"
                >
                  <Github :size="24" aria-hidden="true" />
                  <span class="sr-only">
                    View {{ project.title }} source code on GitHub
                  </span>
                </a>
                <a
                  v-if="project.demo && project.demo !== '#'"
                  :href="project.demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="overlay-link"
                  :aria-label="`View ${project.title} live demo`"
                  @click="onOverlayLinkClick"
                >
                  <ExternalLink :size="24" aria-hidden="true" />
                  <span class="sr-only"
                    >View {{ project.title }} live demo</span
                  >
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from "vue";
import { ExternalLink, Github } from "lucide-vue-next";
import LazyImage from "./LazyImage.vue";

const props = defineProps({
  project: { type: Object, required: true },
  index: { type: Number, required: true },
});

const overlayActive = ref(false);

const isEven = computed(() => props.index % 2 === 0);

const hasValidLinks = computed(() => {
  return (
    (props.project.github && props.project.github !== "#") ||
    (props.project.demo && props.project.demo !== "#")
  );
});

function toggleOverlay() {
  overlayActive.value = !overlayActive.value;
}

function onImageClick() {
  if (!hasValidLinks.value) return;
  toggleOverlay();
}

function onImageKeyDown(e) {
  if (!hasValidLinks.value) return;
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  toggleOverlay();
}

function onOverlayLinkClick(e) {
  e.stopPropagation();
  if (window.innerWidth <= 768 && !overlayActive.value) {
    e.preventDefault();
  }
}
</script>
