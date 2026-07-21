import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#0f0f1a', padding: '2rem',
        }}>
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 10, letterSpacing: '-0.03em' }}>
              Something went wrong
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 12, fontSize: 14 }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            {this.state.errorInfo && (
              <details style={{ marginBottom: 24, textAlign: 'left' }}>
                <summary style={{ fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer', marginBottom: 8 }}>Technical details</summary>
                <pre style={{
                  fontSize: 11, color: '#ff6b6b', background: 'rgba(0,0,0,0.3)',
                  padding: '12px', borderRadius: 8, overflowX: 'auto', maxHeight: 200,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '14px 32px', borderRadius: 14, border: 'none', fontWeight: 700, fontSize: 15,
                background: 'linear-gradient(135deg, #ff4d4d, #cc0000)', color: '#fff', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(255,77,77,0.3)', display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              Refresh Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
