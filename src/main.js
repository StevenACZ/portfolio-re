import { createApp } from "vue";
import App from "./App.vue";
import "./styles/globals.css";
import "./styles/motion.css";
import "./styles/utilities.css";
import "./styles/animations.css";

const html = document.documentElement;
html.dataset.appState = "boot";
delete html.dataset.threeLoaded;

const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);
html.dataset.reduceMotion = reducedMotionQuery.matches ? "true" : "false";
if (typeof reducedMotionQuery.addEventListener === "function") {
  reducedMotionQuery.addEventListener("change", (event) => {
    html.dataset.reduceMotion = event.matches ? "true" : "false";
  });
}

createApp(App).mount("#app");
