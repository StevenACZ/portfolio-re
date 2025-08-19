export const projects = [
  {
    id: 1,
    title: 'PesoTracker',
    description: 'Aplicación macOS para seguimiento de peso con autenticación JWT, caché inteligente, fotos de progreso y API optimizada con Cloudflare. Arquitectura MVVM con SwiftUI.',
    tech: ['Swift', 'SwiftUI', 'JWT', 'Cloudflare', 'Combine', 'Core Graphics'],
    image: '/peso-tracker.webp',
    github: '#',
    demo: '#',
    features: [
      'Autenticación JWT con refresh tokens automáticos',
      'Sistema de caché LRU con expiración inteligente de fotos',
      'Drag & drop universal para subida de imágenes',
      'Dashboard con gráficos y métricas de progreso',
      'Validación en tiempo real con Combine',
      'Sistema de recuperación de contraseña completo'
    ]
  },
  {
    id: 2,
    title: 'BuenMouse',
    description: 'Aplicación de productividad para macOS que mejora la funcionalidad del mouse/trackpad mediante interceptación de eventos del sistema y reconocimiento de gestos personalizados.',
    tech: ['Swift', 'SwiftUI', 'CGEvent', 'AppleScript', 'Accessibility APIs', 'UserDefaults'],
    image: '/buen-mouse.jpg',
    github: '#',
    demo: '#',
    features: [
      'Interceptación de eventos a nivel de sistema con CGEventTap',
      'Reconocimiento de gestos personalizados y navegación por espacios',
      'Control de zoom y scroll invertido para mouse',
      'Aplicación de barra de menú con configuración en tiempo real',
      'Gestión de permisos de accesibilidad automática',
      'Arquitectura optimizada para rendimiento y bajo consumo'
    ]
  }
];