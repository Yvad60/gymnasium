import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "./auth-config";

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  const sendRequest = async () => {
    const accessToken = await instance.acquireTokenSilent(loginRequest);

    const response = await fetch('http://localhost:3000/', {
      headers: {
        'Authorization': `Bearer ${accessToken.accessToken}`
      }
    });

    const data = await response.json();
    console.log('Response from API:', data);
  };

  return (
    <div>
      <button onClick={() => instance.loginRedirect()}>Login</button>
      {isAuthenticated && (
        <button
          onClick={() =>
            instance.logoutRedirect({
              postLogoutRedirectUri: window.location.origin,
            })
          }
        >
          Logout
        </button>
      )}
      <button onClick={sendRequest}>Send Request</button>
    </div>
  );
}

export default App;
