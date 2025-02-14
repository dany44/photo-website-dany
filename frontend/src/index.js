import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import { AlbumProvider } from './context/AlbumContext';
import App from './App'; 
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AlbumProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AlbumProvider>
    </AuthProvider>
  </React.StrictMode>
);