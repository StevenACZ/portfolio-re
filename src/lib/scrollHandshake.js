import { gsap } from "./gsap";
import { prefersReducedMotion } from "./motion";

export function startScrollHandshake() {
  if (typeof window === "undefined") return () => {};
  if (prefersReducedMotion()) return () => {};

  const hero = document.getElementById("hero");
  if (!hero) return () => {};

  const nav = document.querySelector(".navbar");
  const heroContent = hero.querySelector(".hero-content");
  if (!heroContent) return () => {};

  const endDistance = 320;

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: `+=${endDistance}`,
      scrub: 0.9,
      fastScrollEnd: true,
    },
  });

  tl.to(
    heroContent,
    {
      y: -28,
      scale: 0.975,
      opacity: 0.62,
      transformOrigin: "50% 50%",
    },
    0
  );

  if (nav) {
    tl.to(
      nav,
      {
        "--nav-bg-alpha": 0.7,
        "--nav-border-alpha": 0.1,
        "--nav-blur": "20px",
      },
      0
    );
  }

  // Keep the timeline for cleanup
  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
  };
}
