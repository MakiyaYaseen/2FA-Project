// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Base/reset styles
import App from './App';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
