<template>
  <li ref="rootRef" role="listitem" class="nav-dropdown-wrapper">
    <button
      class="nav-link nav-dropdown-trigger"
      :class="{
        active: isActive,
        open: isOpen,
      }"
      aria-label="View my work"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      type="button"
      @click="$emit('toggle')"
    >
      <span>Work</span>
      <ChevronDown
        :size="16"
        class="dropdown-chevron"
        :class="{ rotated: isOpen }"
      />
    </button>

    <div class="nav-dropdown" :class="{ open: isOpen }">
      <div class="nav-dropdown-content">
        <button
          v-for="item in workItems"
          :key="item.id"
          class="nav-dropdown-item"
          :class="{ active: activeSection === item.id }"
          :aria-label="item.ariaLabel"
          type="button"
          @click="$emit('navClick', item.id)"
        >
          <span class="dropdown-item-icon">
            <Rocket v-if="item.id === 'projects'" :size="18" />
            <Apple v-else :size="18" />
          </span>
          <span class="dropdown-item-text">
            <span class="dropdown-item-label">{{ item.label }}</span>
            <span class="dropdown-item-desc">
              {{
                item.id === "projects" ? "Featured projects" : "Native Mac apps"
              }}
            </span>
          </span>
        </button>
      </div>
    </div>
  </li>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { Apple, ChevronDown, Rocket } from "lucide-vue-next";
import { workItems } from "../data/navigation";

defineProps({
  isOpen: { type: Boolean, required: true },
  isActive: { type: Boolean, required: true },
  activeSection: { type: String, required: true },
});

const emit = defineEmits(["toggle", "close", "navClick"]);
const rootRef = ref(null);

function handleClickOutside(e) {
  if (!rootRef.value) return;
  if (!rootRef.value.contains(e.target)) emit("close");
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>
