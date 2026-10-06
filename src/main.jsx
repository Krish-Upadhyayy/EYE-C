import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

// Automatically direct /api calls to live Render backend in deployed environments (Netlify, etc.)
const API_HOST = import.meta.env.VITE_API_URL || 'https://eyec-backend.onrender.com';
if (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === 'string' && input.startsWith('/api')) {
      input = `${API_HOST.replace(/\/$/, '')}${input}`;
    } else if (input instanceof Request && input.url.startsWith('/api')) {
      input = new Request(`${API_HOST.replace(/\/$/, '')}${input.url}`, init);
    }
    return originalFetch.call(this, input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary fallbackTitle="EYEC Compliance Platform Recovered">
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
