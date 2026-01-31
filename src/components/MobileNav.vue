<template>
  <div
    class="mobile-menu-overlay"
    :class="{ open: isOpen }"
    @click="$emit('close')"
  />

  <div class="mobile-nav" :class="{ open: isOpen }">
    <ul class="mobile-nav-links" role="list">
      <li
        v-for="(item, index) in navItems.slice(0, 2)"
        :key="item.id"
        role="listitem"
        :style="{ '--delay': `${index * 0.05}s` }"
      >
        <button
          class="mobile-nav-link"
          :class="{ active: activeSection === item.id }"
          :aria-label="item.ariaLabel"
          :aria-current="activeSection === item.id ? 'page' : undefined"
          type="button"
          @click="handleNavClick(item.id)"
        >
          {{ item.label }}
        </button>
      </li>

      <li
        role="listitem"
        class="mobile-work-section"
        :style="{ '--delay': '0.1s' }"
      >
        <span class="mobile-section-label">Work</span>
        <div class="mobile-work-items">
          <button
            v-for="item in workItems"
            :key="item.id"
            class="mobile-nav-link mobile-work-link"
            :class="{ active: activeSection === item.id }"
            :aria-label="item.ariaLabel"
            type="button"
            @click="handleNavClick(item.id)"
          >
            <span class="mobile-work-icon">
              <Rocket v-if="item.id === 'projects'" :size="18" />
              <Apple v-else :size="18" />
            </span>
            {{ item.label }}
          </button>
        </div>
      </li>

      <li
        v-for="(item, index) in navItems.slice(2)"
        :key="item.id"
        role="listitem"
        :style="{ '--delay': `${(index + 3) * 0.05}s` }"
      >
        <button
          class="mobile-nav-link"
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
  </div>
</template>

<script setup>
import { Apple, Rocket } from "lucide-vue-next";
import { navItems, workItems } from "../data/navigation";

defineProps({
  isOpen: { type: Boolean, required: true },
  activeSection: { type: String, required: true },
});

const emit = defineEmits(["close", "navClick"]);

function handleNavClick(id) {
  emit("navClick", id);
  emit("close");
}
</script>
