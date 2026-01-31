<template>
  <span class="tech-icon" aria-hidden="true">
    <svg v-bind="icon.svgAttrs" focusable="false">
      <component
        v-for="(node, index) in icon.nodes"
        :is="node.tag"
        :key="index"
        v-bind="node.attrs"
      />
    </svg>
  </span>
</template>

<script setup>
import { computed } from "vue";
import { DEFAULT_TECH_ICON, TECH_ICON_DEFS } from "../../icons/techIcons";

const props = defineProps({
  name: { type: String, required: true },
});

const icon = computed(() => {
  const key = String(props.name || "").toLowerCase();
  return TECH_ICON_DEFS[key] ?? DEFAULT_TECH_ICON;
});
</script>

