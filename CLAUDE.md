# Steven Portfolio - Developer Documentation

## Overview

Modern portfolio website showcasing Steven Coaila Zaa's work as a Full Stack Developer. Features 3D interactive hero section, smooth animations, and optimized performance with cutting-edge web technologies.

**Live Site**: https://stevenacz.com

## Technology Stack

### Core Framework
- **React 19.1.1** - Latest React with concurrent features
- **Vite 7.1.3** - Modern build tool and dev server
- **JavaScript ES2020+** - Modern syntax with latest features

### Animation & 3D Graphics
- **GSAP 3.13.0** with @gsap/react 2.1.2 - Professional animations
- **Three.js 0.179.1** - WebGL-based 3D particle system
- **Typed.js 2.1.0** - Typewriter effect animations

### Performance & UX
- **react-intersection-observer 9.16.0** - Efficient lazy loading
- **@dr.pogodin/react-helmet 3.0.2** - SEO and meta management
- **lucide-react 0.540.0** - Optimized icon library

## Architecture

### Component Structure
```
src/
├── Portfolio.jsx                 # Main orchestrator component
├── main.jsx                     # React entry point
├── components/
│   ├── HeroSection.jsx          # Hero with 3D canvas integration
│   ├── ThreeScene.jsx           # Dedicated Three.js particle system
│   ├── ProjectsSection.jsx      # Animated project showcase
│   ├── TimelineSection.jsx      # Experience timeline
│   ├── Navbar.jsx               # Navigation with scroll spy
│   ├── SEOHead.jsx              # Meta tags and structured data
│   ├── LazyImage.jsx            # Optimized image loading
│   ├── ErrorBoundary.jsx        # Error handling
│   ├── Typewriter.jsx           # Dynamic text animation
│   └── SkeletonLoader.jsx       # Loading states
├── hooks/
│   ├── useScrollSpy.js          # Active section detection
│   └── useScrollToSection.js    # Smooth navigation
├── styles/
│   ├── globals.css              # CSS variables and utilities
│   ├── animations.css           # Reusable animation classes
│   └── [Component].css          # Component-specific styles
└── data/
    ├── projects.js              # Project information
    └── experiences.js           # Work experience data
```

### Key Features

**3D Hero Section**
- Interactive Three.js particle system with 150+ spheres
- Orbital mechanics with mouse dispersion effects
- Mobile-optimized performance with adaptive particle counts
- Progressive enhancement with fallback for reduced motion

**Animation System**
- GSAP-powered smooth animations with useGSAP hook
- ScrollTrigger-based reveal animations
- Apple-style magnetic scroll zones for project viewing
- Accessibility-compliant with `prefers-reduced-motion` support

**Performance Optimization**
- Lazy loading for non-critical components with Suspense
- Code splitting with optimized vendor chunks
- WebP image optimization with responsive loading
- Bundle size: ~115kb gzipped initial load

## Development

### Setup
```bash
npm install
npm run dev        # Development server (port 3000)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint code quality check
```

### Build Configuration

**Bundle Optimization**
- Manual chunk splitting for optimal caching
- Tree-shaking with Terser minification
- Asset optimization with hash-based filenames
- Bundle analyzer available via rollup-plugin-visualizer

**Performance Features**
- Console logs stripped in production
- Dead code elimination
- Safari 10+ compatibility
- Gzip/Brotli compression ready

### Testing
Test framework configured with Vitest and @testing-library/react
- Testing dependencies available but no npm test script configured
- Manual testing setup possible with available dependencies

## SEO & Accessibility

### Technical SEO
- Comprehensive meta tags and Open Graph
- JSON-LD structured data for rich snippets
- Sitemap and robots.txt configuration
- Canonical URLs and proper heading hierarchy

### Performance
- Core Web Vitals optimized
- Lighthouse scores: 95+ performance target
- Critical resource preloading
- Font optimization with swap fallbacks

### Accessibility
- WCAG 2.1 AA compliance
- Semantic HTML with proper ARIA labels
- Keyboard navigation support
- Screen reader optimization

## Security

### Content Security Policy
```
default-src 'self'; 
script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; 
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
font-src 'self' https://fonts.gstatic.com; 
img-src 'self' data: https:; 
connect-src 'self' https://cloudflareinsights.com;
```

### Security Headers
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## Project Data

### Featured Projects
- **PesoTracker** - macOS weight tracking app (Swift/SwiftUI)
- **BuenMouse** - macOS productivity enhancement tool

### Experience Timeline
- Frontend Developer Junior at Alicorp (2020)
- Frontend Developer at Crack The Code (2021-2023)

## Production Deployment

### Build Output
```
dist/
├── js/           # Chunked JavaScript files
├── css/          # Optimized stylesheets
├── images/       # Optimized image assets
└── assets/       # Other static assets
```

### Server Configuration
- Supports Apache (.htaccess included)
- Nginx configuration example available
- Static hosting compatible (Vercel, Netlify, etc.)

## Development Notes

### Code Quality
- ESLint configuration with React best practices
- Functional components with modern hooks patterns
- Performance-first architecture with proper cleanup
- Memory leak prevention with useGSAP

### Browser Support
- Modern browsers with ES2020+ support
- WebGL required for 3D features (graceful degradation)
- Progressive enhancement approach

---

**Repository**: Private  
**Maintained by**: Steven Coaila Zaa  
**Last Updated**: 2025