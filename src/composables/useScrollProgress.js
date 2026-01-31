import { onMounted, onUnmounted, ref } from "vue";

const scrollY = ref(0);
const progress = ref(0);

let rafId = null;
let subscribers = 0;
let isListening = false;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function update() {
  rafId = null;

  const y = window.scrollY || window.pageYOffset || 0;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;

  scrollY.value = y;
  progress.value = clamp(pct, 0, 100);
}

function onScroll() {
  if (rafId) return;
  rafId = window.requestAnimationFrame(update);
}

function ensureListener() {
  if (isListening) return;
  isListening = true;
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function cleanupListener() {
  if (!isListening) return;
  isListening = false;
  window.removeEventListener("scroll", onScroll);
  if (rafId) window.cancelAnimationFrame(rafId);
  rafId = null;
}

export function useScrollProgress() {
  onMounted(() => {
    subscribers += 1;
    ensureListener();
  });

  onUnmounted(() => {
    subscribers = Math.max(0, subscribers - 1);
    if (subscribers === 0) cleanupListener();
  });

  return { progress, scrollY };
}

