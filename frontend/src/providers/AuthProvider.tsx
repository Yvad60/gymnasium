import { EventType, PublicClientApplication, type AccountInfo } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { useEffect, type FC, type PropsWithChildren } from "react";
import { authConfig } from "../auth-config";

const msalInstance = new PublicClientApplication(authConfig);

await msalInstance.initialize();

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    if (!msalInstance) return;

    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
      msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }

    msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const authResult = event.payload;
        if ("idToken" in authResult) msalInstance.setActiveAccount(authResult as AccountInfo)
        }
    })
  }, []);

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};


export default AuthProvider;
