import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';

const SEOHead = ({
  title = 'Steven Coaila Zaa - Full Stack Developer',
  description = 'Full Stack Developer specializing in React, Swift, and modern web/mobile development. View my portfolio of innovative projects and professional experience.',
  keywords = 'Steven Coaila Zaa, Full Stack Developer, React Developer, Swift Developer, JavaScript, TypeScript, Node.js, iOS Development, Web Development, Portfolio, Software Engineer, GSAP, Three.js, Vite, SwiftUI, Core Graphics, JWT Authentication, macOS Development, Frontend Engineer, Backend Developer',
  image = 'https://stevenacz.com/og-image.webp',
  url = 'https://stevenacz.com',
  type = 'website',
}) => {
  return (
    <Helmet prioritizeSeoTags>
      {/* Prioritized SEO Tags - rendered first for better SEO ranking */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Steven Coaila Zaa" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Enhanced Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:image:width" content="1920" />
      <meta property="og:image:height" content="1080" />
      <meta property="og:image:alt" content="Steven Coaila Zaa Portfolio - Full Stack Developer" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Steven Coaila Zaa - Portfolio" />

      {/* Enhanced Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="Steven Coaila Zaa Portfolio - Full Stack Developer" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="format-detection" content="telephone=no" />

      {/* Security & Performance Meta Tags */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta name="color-scheme" content="dark light" />
      <meta name="supported-color-schemes" content="dark light" />

      {/* Web App Manifest */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="apple-mobile-web-app-title" content="Steven ACZ Portfolio" />
      <meta name="application-name" content="Steven ACZ Portfolio" />
      <meta name="msapplication-TileColor" content="#3b82f6" />

      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://www.google-analytics.com" />

      {/* Resource Hints */}
      <link
        rel="preload"
        href="/peso-tracker.webp"
        as="image"
        fetchPriority="high"
      />
      <link rel="preload" href="/buen-mouse.webp" as="image" />
    </Helmet>
  );
};

export default SEOHead;
