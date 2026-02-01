let cachedTokens = null;

function readVar(styles, name, fallback) {
  const value = styles.getPropertyValue(name)?.trim();
  return value || fallback;
}

function parseTimeToSeconds(value) {
  if (typeof value !== "string") return 0;
  const trimmed = value.trim();
  if (!trimmed) return 0;
  if (trimmed.endsWith("ms")) return parseFloat(trimmed) / 1000;
  if (trimmed.endsWith("s")) return parseFloat(trimmed);
  return parseFloat(trimmed);
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getMotionTokens() {
  if (cachedTokens) return cachedTokens;

  if (typeof window === "undefined" || typeof document === "undefined") {
    cachedTokens = {
      ease: { out: "expo.out", inOut: "power2.inOut" },
      dur: { intro: 1.05, enter: 0.7, micro: 0.35, stagger: 0.06 },
      opacity: { boot: 0.92 },
      dist: { bootY: 14, navY: -10, ctaY: 12 },
      scale: { boot: 0.99, cta: 0.985 },
      blur: { boot: 4 },
    };
    return cachedTokens;
  }

  const styles = getComputedStyle(document.documentElement);

  cachedTokens = {
    ease: {
      out: readVar(styles, "--motion-ease-out-gsap", "expo.out"),
      inOut: readVar(styles, "--motion-ease-inout-gsap", "power2.inOut"),
    },
    dur: {
      intro: parseTimeToSeconds(readVar(styles, "--motion-dur-intro", "1.05s")),
      enter: parseTimeToSeconds(readVar(styles, "--motion-dur-enter", "0.7s")),
      micro: parseTimeToSeconds(readVar(styles, "--motion-dur-micro", "0.35s")),
      stagger: parseTimeToSeconds(
        readVar(styles, "--motion-dur-stagger", "0.06s")
      ),
    },
    opacity: {
      boot: parseFloat(readVar(styles, "--motion-opacity-boot", "0.92")),
    },
    dist: {
      bootY: parseFloat(readVar(styles, "--motion-dist-boot-y", "14px")),
      navY: parseFloat(readVar(styles, "--motion-dist-nav-y", "-10px")),
      ctaY: parseFloat(readVar(styles, "--motion-dist-cta-y", "12px")),
    },
    scale: {
      boot: parseFloat(readVar(styles, "--motion-scale-boot", "0.99")),
      cta: parseFloat(readVar(styles, "--motion-scale-cta", "0.985")),
    },
    blur: {
      boot: parseFloat(readVar(styles, "--motion-blur-boot", "4px")),
    },
  };

  return cachedTokens;
}
