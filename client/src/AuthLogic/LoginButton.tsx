import { useAuth } from 'react-oidc-context';

function LoginButton() {
  const auth = useAuth();

  switch (auth.activeNavigator) {
    case 'signinSilent':
      return <div>Signing you in...</div>;
    case 'signoutRedirect':
      return <div>Signing you out...</div>;
  }
  console.log(auth);
  if (!auth) {
    return <div>Loading authentication...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        Hello {auth.user?.profile.sub}{' '}
        <button type="button" onClick={() => void auth.removeUser()}>
          Log out
        </button>
      </div>
    );
  }
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => void auth.signinRedirect()}
    >
      Log in
    </button>
  );
};


export default LoginButton;
