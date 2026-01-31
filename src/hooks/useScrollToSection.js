import { useCallback } from "react";
import { gsap } from "gsap";

export const useScrollToSection = (heroRef, navbarRef) => {
  const scrollToSection = useCallback(
    (sectionRef) => {
      if (sectionRef.current) {
        // Usar altura del navbar desde CSS custom property
        const navbarHeight = navbarRef.current
          ? navbarRef.current.offsetHeight
          : parseInt(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--navbar-height"
              )
            ) || 80;

        // Obtener posición exacta de la sección
        const sectionRect = sectionRef.current.getBoundingClientRect();
        const currentScrollY = window.pageYOffset;
        const targetY = sectionRect.top + currentScrollY;

        if (gsap && gsap.plugins?.ScrollToPlugin) {
          gsap.to(window, {
            duration: 1.2,
            scrollTo: {
              y: targetY - (sectionRef === heroRef ? 0 : navbarHeight),
              autoKill: false,
            },
            ease: "power2.inOut",
            onComplete: () => {
              // Yield to main thread after scroll complete
              if (window.requestIdleCallback) {
                window.requestIdleCallback(() => {
                  // Refresh ScrollTrigger if available
                  if (window.ScrollTrigger) {
                    window.ScrollTrigger.refresh();
                  }
                });
              }
            },
          });
        } else {
          // eslint-disable-next-line no-console
          console.warn("GSAP ScrollTo no disponible, usando scroll nativo");

          // Fallback scroll nativo con cálculo preciso
          const finalTargetY =
            targetY - (sectionRef === heroRef ? 0 : navbarHeight);

          window.scrollTo({
            top: finalTargetY,
            behavior: "smooth",
          });
        }
      }
    },
    [heroRef, navbarRef]
  );

  return scrollToSection;
};
