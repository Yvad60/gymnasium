import { BrowserCacheLocation, type Configuration } from "@azure/msal-browser";

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;
export const apiAccessScope = import.meta.env.VITE_API_ACCESS_SCOPE;

export const authConfig: Configuration = {
  auth: {
    clientId,
    redirectUri: window.location.origin,
    authority: `https://login.microsoftonline.com/${tenantId}`,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
};

export const loginRequest = {
  scopes: [apiAccessScope],
};
