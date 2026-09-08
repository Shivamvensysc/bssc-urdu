import type { AuthProviderProps } from "react-oidc-context";

export const zitadelConfig: AuthProviderProps = {
  authority: `https://${import.meta.env.VITE_ZITADEL_DOMAIN}`,
  client_id: import.meta.env.VITE_ZITADEL_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_ZITADEL_REDIRECT_URI, // http://localhost:5173/auth/callback
  post_logout_redirect_uri: import.meta.env.VITE_ZITADEL_POST_LOGOUT_REDIRECT_URI,
  response_type: "code",
  scope: "openid profile email offline_access",
};