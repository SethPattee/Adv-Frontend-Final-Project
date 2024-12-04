import React from 'react';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';

const ProtectedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login-required" />;
  }

  return <>{children}</>;
};

export default ProtectedPage;

