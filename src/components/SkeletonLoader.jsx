export const ProjectsSkeleton = () => (
  <div className="projects-skeleton" style={{
    height: '100vh',
    background: 'var(--secondary-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '2rem',
    padding: '2rem'
  }}>
    <div style={{
      width: '300px',
      height: '3rem',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '0.5rem',
      animation: 'shimmer 2s infinite'
    }} />
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      width: '100%',
      maxWidth: '1200px'
    }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          height: '400px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '1rem',
          animation: `shimmer 2s infinite ${i * 0.2}s`
        }} />
      ))}
    </div>
  </div>
);

export const TimelineSkeleton = () => (
  <div className="timeline-skeleton" style={{
    height: '100vh',
    background: 'var(--primary-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '2rem',
    padding: '2rem'
  }}>
    <div style={{
      width: '250px',
      height: '3rem',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '0.5rem',
      animation: 'shimmer 2s infinite',
      marginBottom: '2rem'
    }} />
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      width: '100%',
      maxWidth: '800px'
    }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          display: 'flex',
          gap: '1rem',
          animation: `shimmer 2s infinite ${i * 0.3}s`
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            background: 'var(--accent-color)',
            borderRadius: '50%',
            marginTop: '0.5rem'
          }} />
          <div style={{
            flex: 1,
            height: '120px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '0.5rem'
          }} />
        </div>
      ))}
    </div>
  </div>
);

export const FooterSkeleton = () => (
  <div className="footer-skeleton" style={{
    height: '200px',
    background: 'var(--secondary-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  }}>
    <div style={{
      width: '300px',
      height: '60px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '0.5rem',
      animation: 'shimmer 2s infinite'
    }} />
  </div>
);

// Add shimmer animation to global styles
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    opacity: 0.6;
    transform: translateX(-100%);
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
    transform: translateX(100%);
  }
}
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('skeleton-styles')) {
  const style = document.createElement('style');
  style.id = 'skeleton-styles';
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}