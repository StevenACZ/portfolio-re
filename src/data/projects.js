export const projects = [
  {
    id: 1,
    title: "PesoTracker",
    description:
      "macOS application for weight tracking with JWT authentication, intelligent cache, progress photos, and Cloudflare-optimized API. MVVM architecture with SwiftUI.",
    tech: ["Swift", "SwiftUI", "JWT", "Cloudflare", "Combine", "Core Graphics"],
    image: "/peso-tracker.webp",
    alt: "PesoTracker macOS application interface showing weight tracking dashboard with charts, progress photos, and Swift SwiftUI design by Steven Coaila Zaa",
    github: "https://github.com/StevenACZ/peso-tracker",
    demo: "https://peso.stevenacz.com",
    features: [
      "JWT authentication with automatic refresh tokens",
      "LRU cache system with intelligent photo expiration",
      "Universal drag & drop for image uploads",
      "Dashboard with charts and progress metrics",
      "Real-time validation with Combine",
      "Complete password recovery system",
    ],
  },
  {
    id: 2,
    title: "BuenMouse",
    description:
      "Productivity application for macOS that enhances mouse/trackpad functionality through system event interception and custom gesture recognition.",
    tech: [
      "Swift",
      "SwiftUI",
      "CGEvent",
      "AppleScript",
      "Accessibility APIs",
      "UserDefaults",
    ],
    image: "/buen-mouse.webp",
    alt: "BuenMouse macOS productivity app interface showing mouse enhancement settings and gesture recognition features built with Swift by Steven Coaila Zaa",
    github: "https://github.com/StevenACZ/BuenMouse",
    features: [
      "System-level event interception with CGEventTap",
      "Custom gesture recognition and space navigation",
      "Zoom control and inverted scrolling for mouse",
      "Menu bar application with real-time configuration",
      "Automatic accessibility permissions management",
      "Optimized architecture for performance and low consumption",
    ],
  },
  {
    id: 3,
    title: "WW2 MAP Films",
    description:
      "Interactive web experience that maps iconic WW2 films to their historical locations and timelines. Explore World War II through the lens of cinema with a curated collection of masterpieces.",
    tech: ["Nuxt", "Vue.js", "TypeScript", "Leaflet", "Sass"],
    image: "/ww2-map-films.webp",
    alt: "WW2 MAP Films interactive map application showing World War II movie locations and historical battlefields by Steven Coaila Zaa",
    github: "https://github.com/StevenACZ/ww2-movie-map",
    demo: "https://ww2.stevenacz.com",
    features: [
      "Interactive map with film locations and historical battlefields",
      "Dynamic timeline visualizing war progression and films",
      "Curated library of WW2 masterpieces like Saving Private Ryan and Dunkirk",
      "Fully responsive design for desktop, tablet, and mobile",
      "SEO optimized with modern web standards",
    ],
  },
];
