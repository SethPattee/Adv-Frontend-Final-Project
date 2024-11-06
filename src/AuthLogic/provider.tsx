import React, { ReactNode, useEffect, useState } from "react";
import { AuthProvider, AuthProviderProps, useAuth } from "react-oidc-context";

const oidcConfig: AuthProviderProps = {
  authority: "https://auth.snowse.duckdns.org/realms/advanced-frontend/",
  client_id: "seth-authdemo",
  redirect_uri: "http://localhost:3000/",
  silent_redirect_uri: "http://localhost:3000/silent-renew.html",
  automaticSilentRenew: true,
  onSigninCallback: async (user) => {
    const newURL = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, newURL);
    document.cookie = `jwt_token=${user?.access_token}`;
  },
};

function SessionChecker() {
  const auth = useAuth();
  const [renewalChecked, setRenewalChecked] = useState(false);

  useEffect(() => {
    const checkRenewal = () => {
      if (auth.isAuthenticated && auth.user) {
        const expiration = auth.user.expires_at;
        const timeRemaining = expiration - Math.floor(Date.now() / 1000);

        if (timeRemaining < 300 && !renewalChecked) {
          auth.signinSilent().catch((error) => {
            console.error("Silent renewal failed:", error);
          });
          setRenewalChecked(true);
        }
      }
    };

    // Run every minute
    const intervalId = setInterval(checkRenewal, 60000);

    return () => clearInterval(intervalId);
  }, [auth, renewalChecked]);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider {...oidcConfig}>
      <SessionChecker />
      {children}
    </AuthProvider>
  );
}
