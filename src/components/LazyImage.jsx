import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  threshold = 0.1,
  skeletonHeight = '200px',
  fadeInDuration = 300
}) => {
  const [ref, inView] = useInView({ 
    threshold, 
    triggerOnce: true,
    rootMargin: '50px' // Start loading 50px before entering viewport
  });
  
  const [imageSrc, setImageSrc] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (inView && src && !imageSrc) {
      setImageSrc(src);
    }
  }, [inView, src, imageSrc]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <div 
      ref={ref} 
      className={`lazy-image-container ${className}`}
      style={{ minHeight: skeletonHeight }}
    >
      {/* Skeleton placeholder */}
      {!imageSrc && !hasError && (
        <div 
          className="image-skeleton"
          style={{ height: skeletonHeight }}
          aria-label="Loading image..."
        >
          {placeholder || (
            <div className="skeleton-shimmer">
              <div className="skeleton-content">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-subtitle"></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div 
          className="image-error"
          style={{ height: skeletonHeight }}
          aria-label="Failed to load image"
        >
          <div className="error-content">
            <span className="error-icon">📷</span>
            <p>Image not available</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {imageSrc && !hasError && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          style={{
            transition: `opacity ${fadeInDuration}ms ease-in-out`,
            opacity: isLoaded ? 1 : 0
          }}
          loading="lazy" // Native lazy loading as fallback
        />
      )}
    </div>
  );
};

export default LazyImage;