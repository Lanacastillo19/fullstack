import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // OR './App.css' / './globals.css' depending on your file name

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);