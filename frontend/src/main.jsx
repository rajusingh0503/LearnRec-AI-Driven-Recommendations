import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '40px auto', background: '#fff', border: '2px solid #ef4444', borderRadius: '12px' }}>
          <h2 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>Application Render Error</h2>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>An error occurred while loading the UI components:</p>
          <pre style={{ background: '#fef2f2', padding: '16px', borderRadius: '8px', color: '#991b1b', fontSize: '12px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.errorInfo?.componentStack}
          </pre>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: '16px', padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear Stored Session & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Global window error catcher for uncaught script errors
window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root && (!root.innerHTML || root.innerHTML.trim() === '')) {
    root.innerHTML = `
      <div style="padding: 30px; font-family: sans-serif; max-width: 800px; margin: 40px auto; background: #fff; border: 2px solid #ef4444; borderRadius: 12px;">
        <h2 style="color: #dc2626;">Script Initialization Error</h2>
        <pre style="background: #fef2f2; padding: 16px; border-radius: 8px; color: #991b1b; font-size: 13px; white-space: pre-wrap;">
${event.message} at ${event.filename}:${event.lineno}
        </pre>
        <button onclick="localStorage.clear(); location.reload();" style="margin-top: 16px; padding: 10px 20px; background: #4f46e5; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
          Clear Stored Session & Reload
        </button>
      </div>
    `;
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
