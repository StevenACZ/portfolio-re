export const projects = [
  {
    id: 1,
    title: 'PesoTracker',
    description: 'macOS application for weight tracking with JWT authentication, intelligent cache, progress photos, and Cloudflare-optimized API. MVVM architecture with SwiftUI.',
    tech: ['Swift', 'SwiftUI', 'JWT', 'Cloudflare', 'Combine', 'Core Graphics'],
    image: '/peso-tracker.webp',
    github: '#',
    demo: '#',
    features: [
      'JWT authentication with automatic refresh tokens',
      'LRU cache system with intelligent photo expiration',
      'Universal drag & drop for image uploads',
      'Dashboard with charts and progress metrics',
      'Real-time validation with Combine',
      'Complete password recovery system'
    ]
  },
  {
    id: 2,
    title: 'BuenMouse',
    description: 'Productivity application for macOS that enhances mouse/trackpad functionality through system event interception and custom gesture recognition.',
    tech: ['Swift', 'SwiftUI', 'CGEvent', 'AppleScript', 'Accessibility APIs', 'UserDefaults'],
    image: '/buen-mouse.jpg',
    github: '#',
    demo: '#',
    features: [
      'System-level event interception with CGEventTap',
      'Custom gesture recognition and space navigation',
      'Zoom control and inverted scrolling for mouse',
      'Menu bar application with real-time configuration',
      'Automatic accessibility permissions management',
      'Optimized architecture for performance and low consumption'
    ]
  }
];