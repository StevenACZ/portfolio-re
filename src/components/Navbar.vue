<template>
  <nav
    ref="navRef"
    class="navbar"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="navbar-container">
      <div class="navbar-logo">
        <button
          class="logo-button"
          aria-label="Steven ACZ - Go to homepage"
          type="button"
          @click="handleNavClick('hero')"
        >
          StevenACZ
        </button>
      </div>

      <ul class="navbar-links desktop-nav" role="list">
        <li v-for="item in navItems.slice(0, 2)" :key="item.id" role="listitem">
          <button
            class="nav-link"
            :class="{ active: activeSection === item.id }"
            :aria-label="item.ariaLabel"
            :aria-current="activeSection === item.id ? 'page' : undefined"
            type="button"
            @click="handleNavClick(item.id)"
          >
            {{ item.label }}
          </button>
        </li>

        <WorkDropdown
          :is-open="isDropdownOpen"
          :is-active="isWorkActive"
          :active-section="activeSection"
          @toggle="isDropdownOpen = !isDropdownOpen"
          @close="isDropdownOpen = false"
          @nav-click="handleNavClick"
        />

        <li v-for="item in navItems.slice(2)" :key="item.id" role="listitem">
          <button
            class="nav-link"
            :class="{ active: activeSection === item.id }"
            :aria-label="item.ariaLabel"
            :aria-current="activeSection === item.id ? 'page' : undefined"
            type="button"
            @click="handleNavClick(item.id)"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>

      <button
        class="hamburger-btn"
        :class="{ open: isMenuOpen }"
        :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="isMenuOpen"
        type="button"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <MobileNav
        :is-open="isMenuOpen"
        :active-section="activeSection"
        @nav-click="handleNavClick"
        @close="isMenuOpen = false"
      />
    </div>
  </nav>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { ScrollTrigger } from "../lib/gsap";
import { navItems } from "../data/navigation";
import MobileNav from "./MobileNav.vue";
import WorkDropdown from "./WorkDropdown.vue";
import "../styles/Navbar.css";

const props = defineProps({
  activeSection: { type: String, default: "hero" },
});

const emit = defineEmits(["navClick"]);

const navRef = ref(null);
const isMenuOpen = ref(false);
const isDropdownOpen = ref(false);

const isWorkActive = computed(() => {
  return (
    props.activeSection === "projects" || props.activeSection === "macos-apps"
  );
});

function handleNavClick(id) {
  emit("navClick", id);
  isMenuOpen.value = false;
  isDropdownOpen.value = false;
}

function handleEscape(e) {
  if (e.key === "Escape") {
    isMenuOpen.value = false;
    isDropdownOpen.value = false;
  }
}

watch(isMenuOpen, (open) => {
  if (open) {
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
  } else {
    document.removeEventListener("keydown", handleEscape);
    document.body.style.overflow = "";
  }
});

let navbarScrollTrigger = null;

onMounted(() => {
  if (!navRef.value) return;

  navbarScrollTrigger = ScrollTrigger.create({
    trigger: document.body,
    start: "top -50px",
    end: "bottom bottom",
    toggleClass: { targets: navRef.value, className: "scrolled" },
  });
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "";
  navbarScrollTrigger?.kill();
  navbarScrollTrigger = null;
});
</script>
