import React from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled render error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.5rem',
          background: 'var(--bg-card, #13131a)',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          margin: '1rem',
          textAlign: 'center',
          color: '#ffffff'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444',
            marginBottom: '1rem'
          }}>
            <AlertTriangle size={24} />
          </div>

          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
            {this.props.fallbackTitle || 'Component Rendering Error Recovered'}
          </h3>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #d4d4d8)', maxWidth: '520px', lineHeight: 1.5, marginBottom: '1rem' }}>
            An unexpected error was intercepted while processing CCTV media frames. The system prevented an application crash.
          </p>

          <div style={{
            background: '#09090d',
            border: '1px solid #22222c',
            borderRadius: '4px',
            padding: '0.55rem 0.85rem',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.72rem',
            color: '#f87171',
            maxWidth: '600px',
            width: '100%',
            textAlign: 'left',
            marginBottom: '1.25rem',
            overflowX: 'auto'
          }}>
            <strong>Error:</strong> {this.state.error?.message || 'Unknown runtime error'}
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              onClick={this.handleReset}
              className="btn-primary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.78rem' }}
            >
              <RotateCcw size={14} />
              <span>Recover & Continue Working</span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.78rem' }}
            >
              <RefreshCw size={14} />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
