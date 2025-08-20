export const projects = [
  {
    id: 1,
    title: 'PesoTracker',
    description: 'macOS application for weight tracking with JWT authentication, intelligent cache, progress photos, and Cloudflare-optimized API. MVVM architecture with SwiftUI.',
    tech: ['Swift', 'SwiftUI', 'JWT', 'Cloudflare', 'Combine', 'Core Graphics'],
    image: '/peso-tracker.webp',
    github: 'https://github.com/StevenACZ/PesoTracker',
    demo: 'https://pesotracker.stevenacz.com',
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
    github: 'https://github.com/StevenACZ/BuenMouse',
    features: [
      'System-level event interception with CGEventTap',
      'Custom gesture recognition and space navigation',
      'Zoom control and inverted scrolling for mouse',
      'Menu bar application with real-time configuration',
      'Automatic accessibility permissions management',
      'Optimized architecture for performance and low consumption'
    ]
  },
  {
    id: 3,
    title: 'TaskFlow',
    description: 'Modern task management application with real-time collaboration, advanced filtering, and cloud synchronization. Built with React and Firebase.',
    tech: ['React', 'Firebase', 'Material-UI', 'PWA', 'TypeScript', 'Firestore'],
    image: '/taskflow.webp',
    github: 'https://github.com/StevenACZ/TaskFlow',
    demo: 'https://taskflow.stevenacz.com',
    features: [
      'Real-time collaboration with multiple users',
      'Advanced filtering and search capabilities',
      'Progressive Web App with offline functionality',
      'Cloud synchronization across devices',
      'Customizable workspace layouts',
      'Integrated time tracking and analytics'
    ]
  }
];