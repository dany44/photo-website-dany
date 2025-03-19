// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

// Créez votre QueryClient
const queryClient = new QueryClient();

// Créez un persister utilisant le localStorage
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister: localStoragePersister }}
    onSuccess={() => {
      console.log('Cache restauré !');
    }}
  >
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </PersistQueryClientProvider>
);
