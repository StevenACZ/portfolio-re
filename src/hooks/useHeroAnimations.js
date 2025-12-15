import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Get animation configuration from CSS custom properties
 */
function getAnimationConfig() {
  const rootStyles = getComputedStyle(document.documentElement);

  return {
    duration: {
      hero:
        parseFloat(rootStyles.getPropertyValue("--animation-duration-hero")) ||
        1,
      heroLong:
        parseFloat(
          rootStyles.getPropertyValue("--animation-duration-hero-long")
        ) || 1.2,
      heroText:
        parseFloat(
          rootStyles.getPropertyValue("--animation-duration-hero-text")
        ) || 0.8,
    },
    distance: {
      medium:
        parseInt(rootStyles.getPropertyValue("--animation-distance-medium")) ||
        50,
      small:
        parseInt(rootStyles.getPropertyValue("--animation-distance-small")) ||
        30,
      large:
        parseInt(rootStyles.getPropertyValue("--animation-distance-large")) ||
        60,
    },
  };
}

/**
 * Animate hero section elements
 */
function animateHeroEntrance(config) {
  const heroGreeting = document.querySelector(".hero-greeting");
  const heroName = document.querySelector(".hero-name");
  const typewriterText = document.querySelector(".hero-title");
  const heroDescription = document.querySelector(".hero-description");

  const heroTl = gsap.timeline();

  if (heroGreeting) {
    heroTl.fromTo(
      heroGreeting,
      { y: config.distance.medium, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: config.duration.hero,
        ease: "power3.out",
      }
    );
  }

  if (heroName) {
    heroTl.fromTo(
      heroName,
      { y: config.distance.medium, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: config.duration.heroLong,
        ease: "back.out(1.7)",
      },
      "-=0.6"
    );
  }

  if (typewriterText) {
    heroTl.fromTo(
      typewriterText,
      { y: config.distance.small, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: config.duration.heroText,
        ease: "power3.out",
        delay: 0.5,
      },
      "-=0.5"
    );
  }

  if (heroDescription) {
    heroTl.fromTo(
      heroDescription,
      { y: config.distance.small, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: config.duration.hero,
        ease: "power3.out",
      },
      "-=0.3"
    );
  }

  return heroTl;
}

/**
 * Setup parallax effect for gradient background
 */
function setupParallax(heroRef) {
  const isMobile = window.innerWidth <= 768;
  const gradientBg = document.querySelector(".gradient-bg");

  if (!isMobile && gradientBg && heroRef?.current) {
    gsap.to(gradientBg, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        refreshPriority: -10,
        fastScrollEnd: true,
      },
    });
  }
}

/**
 * Setup footer entrance animation
 */
function setupFooterAnimation(footerRef, config) {
  const footerContent = document.querySelector(".footer-content");

  if (footerContent && footerRef?.current) {
    gsap.fromTo(
      footerContent,
      { y: config.distance.large, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: config.duration.hero,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
          fastScrollEnd: true,
        },
      }
    );
  }
}

/**
 * Setup navbar scroll effect
 */
function setupNavbarScroll(navbarRef) {
  if (navbarRef?.current) {
    gsap.to(navbarRef.current, {
      backgroundColor: "rgba(10, 10, 10, 0.7)",
      backdropFilter: "blur(20px)",
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
      scrollTrigger: {
        trigger: "body",
        start: "top -50px",
        end: "bottom bottom",
        toggleActions: "play none none reverse",
        scrub: 1,
      },
    });
  }
}

/**
 * Custom hook for hero and page-level GSAP animations
 */
export function useHeroAnimations(containerRef, heroRef, footerRef, navbarRef) {
  // Setup animations with useGSAP
  useGSAP(
    () => {
      const timer = setTimeout(() => {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reducedMotion) return;

        const config = getAnimationConfig();

        animateHeroEntrance(config);
        setupParallax(heroRef);
        setupFooterAnimation(footerRef, config);
        setupNavbarScroll(navbarRef);
      }, 500);

      return () => clearTimeout(timer);
    },
    { scope: containerRef }
  );

  // Handle scroll restoration and resize
  useEffect(() => {
    // Prevent automatic scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Ensure scroll to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Handle resize with debounce for better INP
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => ScrollTrigger.refresh(), {
            timeout: 200,
          });
        } else {
          setTimeout(() => ScrollTrigger.refresh(), 16);
        }
      }, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}

export default useHeroAnimations;
