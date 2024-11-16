import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Providers from './AuthLogic/provider';
import ErrorBoundary from './ErrorBoundary';
import Navbar from './component/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import BlogPage from './pages/BlogPage';
import CustomizeProfile from './pages/CustomizeProfile';

const queryClient = new QueryClient();

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <ErrorBoundary>
          <Providers>
            <QueryClientProvider client={queryClient}>
              <BrowserRouter>
                <Navbar />
                <Toaster />
                <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route
                    path="/customize-profile"
                    element={<CustomizeProfile />}
                  />
                </Routes>
              </BrowserRouter>
            </QueryClientProvider>
          </Providers>
        </ErrorBoundary>
      </ThemeProvider>
    </React.StrictMode>,
  );
}
