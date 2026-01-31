const APP_STATE_EVENT = "app:state";
const APP_READY_EVENT = "app:ready";

export function getAppState() {
  if (typeof document === "undefined") return "boot";
  return document.documentElement.dataset.appState || "boot";
}

export function setAppState(nextState) {
  if (typeof document === "undefined") return;

  const html = document.documentElement;
  if (html.dataset.appState === nextState) return;

  html.dataset.appState = nextState;
  window.dispatchEvent(new CustomEvent(APP_STATE_EVENT, { detail: nextState }));
  if (nextState === "ready") window.dispatchEvent(new Event(APP_READY_EVENT));
}

export function onAppState(callback) {
  if (typeof window === "undefined") return () => {};
  if (typeof callback !== "function") return () => {};

  const handler = (event) => callback(event?.detail);
  window.addEventListener(APP_STATE_EVENT, handler);
  return () => window.removeEventListener(APP_STATE_EVENT, handler);
}

export function onAppReady(callback) {
  if (typeof window === "undefined") return () => {};
  if (typeof callback !== "function") return () => {};
  if (getAppState() === "ready") {
    callback();
    return () => {};
  }

  const handler = () => {
    callback();
    window.removeEventListener(APP_READY_EVENT, handler);
  };
  window.addEventListener(APP_READY_EVENT, handler);
  return () => window.removeEventListener(APP_READY_EVENT, handler);
}
