import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register PWA Service Worker for Offline Workstation Support
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Graceful fallback if SW registration is restricted
    });
  });
}
