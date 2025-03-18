import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import { AlbumProvider } from './context/AlbumContext';
import App from './App'; 
import './index.css'; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
//  <React.StrictMode>
<QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AlbumProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AlbumProvider>
    </AuthProvider>
    </QueryClientProvider>

 // </React.StrictMode>
);