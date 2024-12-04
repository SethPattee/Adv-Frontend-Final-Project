import React from 'react';
import { useAuth } from 'react-oidc-context';

const LoginRequiredPage: React.FC = () => {
  const auth = useAuth();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1>You need to log in to see this page</h1>
      <button
        type="button"
        className="btn btn-primary mt-3"
        onClick={() => void auth.signinRedirect()}
      >
        Log in
      </button>
    </div>
  );
};

export default LoginRequiredPage;
