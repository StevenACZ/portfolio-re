import { useRef, useEffect } from 'react';
import Typed from 'typed.js';

const Typewriter = ({ className = '', delay = 1500 }) => {
  const el = useRef(null);
  const typed = useRef(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // If reduced motion is preferred, show static text
    if (prefersReducedMotion) {
      if (el.current) {
        el.current.textContent = 'Full Stack Developer';
      }
      return;
    }

    // Initialize Typed.js with delay
    const timer = setTimeout(() => {
      if (el.current) {
        typed.current = new Typed(el.current, {
          strings: [
            'Full Stack Developer',
            'Swift Developer', 
            'Creative Problem Solver',
            'UX Enthusiast',
            'React Specialist',
            'Mobile App Creator'
          ],
          typeSpeed: 80,        // Natural typing speed
          backSpeed: 60,        // Faster backspacing
          backDelay: 2000,      // Pause between texts
          startDelay: 0,        // No additional delay (handled by setTimeout)
          loop: true,           // Infinite loop
          smartBackspace: true, // Only backspace what doesn't match
          showCursor: true,     // Show blinking cursor
          cursorChar: '|',      // Cursor character
          autoInsertCss: true,  // Auto insert cursor CSS
          contentType: 'text',  // Plain text content
        });
      }
    }, delay);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (typed.current) {
        typed.current.destroy();
      }
    };
  }, [delay]);

  return <span ref={el} className={className} />;
};

export default Typewriter;