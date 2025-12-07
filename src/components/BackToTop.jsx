import { useState, useEffect, useCallback } from "react";
import "../styles/BackToTop.css";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setScrollProgress(progress);
      setIsVisible(scrollTop > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <button
      className={`back-to-top ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to top"
    >
      <svg className="progress-ring" viewBox="0 0 48 48">
        <circle
          className="progress-ring-bg"
          cx="24"
          cy="24"
          r="20"
          fill="none"
          strokeWidth="3"
        />
        <circle
          className="progress-ring-fill"
          cx="24"
          cy="24"
          r="20"
          fill="none"
          strokeWidth="3"
          strokeDasharray={`${scrollProgress * 1.257} 125.7`}
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="arrow-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
};

export default BackToTop;
