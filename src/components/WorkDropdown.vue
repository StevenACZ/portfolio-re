<template>
  <li ref="rootRef" role="listitem" class="nav-dropdown-wrapper">
    <button
      ref="triggerRef"
      class="nav-link nav-dropdown-trigger"
      :class="{
        active: isActive,
        open: isOpen,
      }"
      aria-label="View my work"
      :aria-expanded="isOpen"
      :aria-controls="menuId"
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

    <div :id="menuId" class="nav-dropdown" :class="{ open: isOpen }">
      <div
        class="nav-dropdown-content"
        role="menu"
        aria-label="Work menu"
        @keydown="onMenuKeydown"
      >
        <button
          v-for="(item, index) in workItems"
          :key="item.id"
          :ref="(el) => setItemRef(el, index)"
          class="nav-dropdown-item"
          :class="{ active: activeSection === item.id }"
          :aria-label="item.ariaLabel"
          :tabindex="isOpen ? 0 : -1"
          role="menuitem"
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
import { nextTick, onUnmounted, ref, watch } from "vue";
import { Apple, ChevronDown, Rocket } from "lucide-vue-next";
import { workItems } from "../data/navigation";

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  isActive: { type: Boolean, required: true },
  activeSection: { type: String, required: true },
});

const emit = defineEmits(["toggle", "close", "navClick"]);
const rootRef = ref(null);
const triggerRef = ref(null);
const itemRefs = ref([]);
const menuId = "work-menu";

function setItemRef(el, index) {
  if (!el) return;
  itemRefs.value[index] = el;
}

function handleClickOutside(e) {
  if (!props.isOpen) return;
  if (!rootRef.value) return;
  if (!rootRef.value.contains(e.target)) emit("close");
}

function focusFirstItem() {
  const first = itemRefs.value.find(Boolean);
  first?.focus?.();
}

function focusTrigger() {
  triggerRef.value?.focus?.();
}

function onMenuKeydown(e) {
  if (!props.isOpen) return;

  if (e.key === "Escape") {
    e.preventDefault();
    emit("close");
    return;
  }

  const items = itemRefs.value.filter(Boolean);
  if (!items.length) return;

  const currentIndex = items.indexOf(document.activeElement);
  const lastIndex = items.length - 1;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
    items[nextIndex]?.focus?.();
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    const nextIndex =
      currentIndex === -1
        ? lastIndex
        : (currentIndex - 1 + items.length) % items.length;
    items[nextIndex]?.focus?.();
    return;
  }

  if (e.key === "Home") {
    e.preventDefault();
    items[0]?.focus?.();
    return;
  }

  if (e.key === "End") {
    e.preventDefault();
    items[lastIndex]?.focus?.();
  }
}

function handleEscape(e) {
  if (e.key !== "Escape") return;
  emit("close");
}

watch(
  () => props.isOpen,
  async (open, wasOpen) => {
    itemRefs.value = [];

    if (open) {
      document.addEventListener("pointerdown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      await nextTick();
      focusFirstItem();
      return;
    }

    document.removeEventListener("pointerdown", handleClickOutside);
    document.removeEventListener("keydown", handleEscape);

    if (wasOpen) {
      await nextTick();
      focusTrigger();
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  document.removeEventListener("pointerdown", handleClickOutside);
  document.removeEventListener("keydown", handleEscape);
});
</script>
