import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // Check if the user has a valid session token
  const token = localStorage.getItem("accessToken");

  // If there is no token, immediately bounce them back to the login page
  // The 'replace: true' prevents them from clicking back again.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If the token exists, allow them to see the protected page (Dashboard)
  return <Outlet />;
}