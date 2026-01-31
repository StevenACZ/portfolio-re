import { onMounted, onUnmounted, unref } from "vue";

export function useIntersectionOnce(
  targetRef,
  onIntersect,
  options = { rootMargin: "0px", threshold: 0 }
) {
  let observer = null;

  onMounted(() => {
    const target = unref(targetRef);
    if (!target || typeof IntersectionObserver === "undefined") {
      onIntersect?.();
      return;
    }

    observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;

      observer?.disconnect();
      observer = null;
      onIntersect?.(entry);
    }, options);

    observer.observe(target);
  });

  onUnmounted(() => {
    observer?.disconnect();
    observer = null;
  });
}
