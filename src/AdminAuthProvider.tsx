import { AuthProvider } from "react-oidc-context";
import { Outlet } from "react-router-dom";

import { zitadelConfig } from "./adminDashboard/auth/zitadelConfig";
import { userManager } from "./adminDashboard/services/authService";

export default function AdminAuthProvider() {
  return (
    <AuthProvider
      {...zitadelConfig}
      userManager={userManager}
    >
      <Outlet />
    </AuthProvider>
  );
}