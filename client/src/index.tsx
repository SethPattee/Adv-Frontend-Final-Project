import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Providers from './AuthLogic/provider';
import CustomizeProfile from './pages/CustomizeProfile';
import { Route, Routes } from 'react-router-dom';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Providers>
      <Routes>
          <Route path="/" element={<App />} />
          <Route path="/customize-profile" element={<CustomizeProfile />} />
        </Routes>
        
      </Providers>
    </React.StrictMode>,
  );
}

