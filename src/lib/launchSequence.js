import { gsap, ScrollTrigger } from "./gsap";
import { setAppState } from "./appState";
import { getMotionTokens, prefersReducedMotion } from "./motion";
import { runIdle } from "../utils/idle";

const THREE_LOADED_EVENT = "three:loaded";

function nextFrame() {
  return new Promise((resolve) => window.requestAnimationFrame(resolve));
}

function listen(target, event, handler, options) {
  target.addEventListener(event, handler, options);
  return () => target.removeEventListener(event, handler, options);
}

function crossfadeThree({ instant = false } = {}) {
  const canvas = document.querySelector(".hero-canvas");
  const fallback = document.querySelector(".hero-fallback-bg");
  if (!canvas || !fallback) return;

  const tokens = getMotionTokens();
  const duration = instant ? 0.001 : tokens.dur.enter;

  gsap.to(canvas, {
    opacity: 1,
    duration,
    ease: tokens.ease.out,
    overwrite: "auto",
  });
  gsap.to(fallback, {
    opacity: 0,
    duration,
    ease: tokens.ease.out,
    overwrite: "auto",
  });
}

export function startLaunchSequence() {
  if (typeof window === "undefined") return () => {};

  const reducedMotion = prefersReducedMotion();
  const tokens = getMotionTokens();

  const html = document.documentElement;
  let timeline = null;
  let didFinish = false;
  let cancelled = false;

  const cleanupFns = [];
  const interruptCleanupFns = [];

  const onThreeLoaded = () => {
    html.dataset.threeLoaded = "true";
    crossfadeThree({ instant: reducedMotion });
  };

  cleanupFns.push(
    listen(window, THREE_LOADED_EVENT, onThreeLoaded, { once: true })
  );
  if (html.dataset.threeLoaded === "true") onThreeLoaded();

  const finish = () => {
    if (didFinish) return;
    didFinish = true;

    interruptCleanupFns.splice(0).forEach((fn) => fn?.());

    timeline?.kill();
    timeline = null;

    setAppState("ready");

    const nav = document.querySelector(".navbar");
    const heroGreeting = document.querySelector(".hero-greeting");
    const heroName = document.querySelector(".hero-name");
    const heroSubtitle = document.querySelector(".hero-subtitle");
    const heroDescription = document.querySelector(".hero-description");
    const heroCtas = document.querySelector(".hero-cta-container");

    gsap.set(
      [
        nav,
        heroGreeting,
        heroName,
        heroSubtitle,
        heroDescription,
        heroCtas,
      ].filter(Boolean),
      { clearProps: "transform,opacity,filter" }
    );

    runIdle(() => ScrollTrigger.refresh(), { timeout: 250 });
  };

  const interrupt = () => {
    if (didFinish) return;
    timeline?.progress(1);
    finish();
  };

  interruptCleanupFns.push(
    listen(window, "wheel", interrupt, { passive: true })
  );
  interruptCleanupFns.push(
    listen(window, "touchstart", interrupt, { passive: true })
  );
  interruptCleanupFns.push(
    listen(window, "touchmove", interrupt, { passive: true })
  );
  interruptCleanupFns.push(
    listen(window, "pointerdown", interrupt, { passive: true })
  );
  interruptCleanupFns.push(listen(window, "keydown", interrupt));

  if (reducedMotion) {
    setAppState("ready");
    interruptCleanupFns.splice(0).forEach((fn) => fn?.());
    runIdle(() => ScrollTrigger.refresh(), { timeout: 250 });
    return () => {
      cancelled = true;
      cleanupFns.splice(0).forEach((fn) => fn?.());
      timeline?.kill();
      timeline = null;
    };
  }

  (async () => {
    await nextFrame();
    await nextFrame();
    if (cancelled || didFinish) return;

    setAppState("enter");

    const nav = document.querySelector(".navbar");
    const heroGreeting = document.querySelector(".hero-greeting");
    const heroName = document.querySelector(".hero-name");
    const heroSubtitle = document.querySelector(".hero-subtitle");
    const heroDescription = document.querySelector(".hero-description");
    const heroCtas = document.querySelector(".hero-cta-container");

    if (!nav || !heroName) {
      finish();
      return;
    }

    timeline = gsap.timeline({
      defaults: { ease: tokens.ease.out },
      onComplete: finish,
    });

    timeline.to(nav, { y: 0, opacity: 1, duration: tokens.dur.enter }, 0);

    const heroTextTargets = [
      heroGreeting,
      heroName,
      heroSubtitle,
      heroDescription,
    ].filter(Boolean);

    timeline.to(
      heroTextTargets,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: tokens.dur.enter,
        stagger: tokens.dur.stagger,
      },
      0.05
    );

    if (heroCtas) {
      timeline.to(
        heroCtas,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: tokens.dur.micro,
        },
        ">-0.1"
      );
    }
  })();

  return () => {
    cancelled = true;
    interruptCleanupFns.splice(0).forEach((fn) => fn?.());
    cleanupFns.splice(0).forEach((fn) => fn?.());
    timeline?.kill();
    timeline = null;
  };
}
