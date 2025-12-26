import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const mountNode = document.getElementById('root');

if (!mountNode) {
  throw new Error("Target container 'root' not found. Infrastructure failed to initialize.");
}

const root = ReactDOM.createRoot(mountNode);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);