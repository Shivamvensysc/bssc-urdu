import { AuthProvider } from "react-oidc-context";
import { Outlet } from "react-router-dom";
import { zitadelConfig } from "./auth/zitadelConfig";

/**
 * Wraps only the candidate route subtree in an AuthProvider configured
 * with the candidate ZITADEL client (different client_id/scope than the
 * admin app). This keeps its UserManager/PKCE state completely separate
 * from the admin AuthProvider.
 */
export default function CandidateAuthProvider() {
  return (
    <AuthProvider {...zitadelConfig}>
      <Outlet />
    </AuthProvider>
  );
}