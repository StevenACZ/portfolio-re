import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error reporting service in production
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI for Three.js components
      return (
        <div className="error-boundary-fallback">
          {this.props.fallback || (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <h3>3D Graphics Error</h3>
              <p>
                Unable to load 3D graphics. This might be due to:
              </p>
              <ul>
                <li>WebGL not being supported by your browser</li>
                <li>Hardware limitations</li>
                <li>Graphics driver issues</li>
              </ul>
              <p>
                The website will continue to work normally without 3D effects.
              </p>
              {import.meta.env.DEV && (
                <details className="error-details">
                  <summary>Error Details (Development)</summary>
                  <pre>{this.state.error && this.state.error.toString()}</pre>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </details>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;