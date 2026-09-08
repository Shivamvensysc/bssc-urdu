import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("Completing secure login...");

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setStatus(
        "No authorization code found. Please try logging in again."
      );
      return;
    }

    const exchangeToken = async () => {
      try {
        const domain = import.meta.env.VITE_ZITADEL_DOMAIN;
        const clientId = import.meta.env.VITE_ZITADEL_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_ZITADEL_REDIRECT_URI;

        // Validate environment variables
        if (!domain) {
          throw new Error("ZITADEL domain is not configured.");
        }

        if (!clientId) {
          throw new Error("ZITADEL client ID is not configured.");
        }

        if (!redirectUri) {
          throw new Error("ZITADEL redirect URI is not configured.");
        }

        // Prepare token exchange request
        const body = new URLSearchParams({
          grant_type: "authorization_code",
          client_id: clientId,
          code,
          redirect_uri: redirectUri,
        });

        // Exchange authorization code for tokens
        const response = await fetch(
          `https://${domain}/oauth/v2/token`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded",
            },
            body: body.toString(),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error_description ||
              data.error ||
              "Failed to exchange authorization code."
          );
        }

        // Make sure access token exists
        if (!data.access_token) {
          throw new Error(
            "No access token received from ZITADEL."
          );
        }

        // Save access token
        localStorage.setItem(
          "accessToken",
          data.access_token
        );

        // Save ID token if available
        if (data.id_token) {
          localStorage.setItem(
            "idToken",
            data.id_token
          );
        }

        // Save refresh token if available
        if (data.refresh_token) {
          localStorage.setItem(
            "refreshToken",
            data.refresh_token
          );
        }

        setStatus("Login successful. Redirecting...");

        /**
         * If AuthCallback is running inside iframe,
         * notify the parent application.
         */
        if (window !== window.parent) {
          window.parent.postMessage(
            {
              type: "ZITADEL_LOGIN_SUCCESS",
            },
            window.location.origin
          );

          return;
        }

        /**
         * If AuthCallback is not inside iframe,
         * navigate directly.
         */
        navigate("/dashboard", {
          replace: true,
        });
      } catch (error) {
        console.error(
          "ZITADEL authentication error:",
          error
        );

        const message =
          error instanceof Error
            ? error.message
            : "Unable to complete login.";

        setStatus(`Error logging in: ${message}`);
      }
    };

    exchangeToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin h-6 w-6 border-2 border-[#B9722E] border-t-transparent rounded-full" />

        <div className="text-[15px] font-semibold text-slate-600 text-center px-4">
          {status}
        </div>
      </div>
    </div>
  );
}