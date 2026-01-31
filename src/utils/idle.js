export function runIdle(callback, { timeout = 200 } = {}) {
  if (typeof window === "undefined") return () => {};
  if (typeof callback !== "function") return () => {};

  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback?.(id);
  }

  const id = window.setTimeout(callback, 0);
  return () => window.clearTimeout(id);
}

