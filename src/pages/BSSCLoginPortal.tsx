import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  FileText,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
const INK = "#12233F";
const CARD = "#FFFFFF";
const LINE = "#DBDFE6";
const PAPER = "#F4F5F2";

import { useAuth } from "react-oidc-context";

export const BSSCLoginPortal: React.FC = () => {
   const auth = useAuth();
   
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_ZITADEL_DOMAIN;
  const clientId = import.meta.env.VITE_ZITADEL_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_ZITADEL_REDIRECT_URI;

  /**
   * Create ZITADEL authorization URL
   */
  const authUrl = useMemo(() => {
    if (!domain || !clientId || !redirectUri) {
      console.error(
        "ZITADEL configuration is missing.",
        {
          domain,
          clientId,
          redirectUri,
        }
      );

      return "";
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid profile email phone offline_access",
    });

    return `https://${domain}/oauth/v2/authorize?${params.toString()}`;
  }, [domain, clientId, redirectUri]);

  /**
   * Listen for authentication completion
   * from AuthCallback iframe.
   */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      /**
       * Security:
       * Only accept messages coming from
       * the same origin as this application.
       */
      if (event.origin !== window.location.origin) {
        console.warn(
          "Ignoring message from unknown origin:",
          event.origin
        );

        return;
      }

      /**
       * Check the message sent by AuthCallback.
       */
      if (
        event.data?.type ===
        "ZITADEL_LOGIN_SUCCESS"
      ) {
        console.log(
          "ZITADEL login successful."
        );

        /**
         * Navigate parent application
         * to dashboard.
         */
        navigate("/dashboard", {
          replace: true,
        });
      }
    };

    window.addEventListener(
      "message",
      handleMessage
    );

    /**
     * Cleanup listener when component unmounts.
     */
    return () => {
      window.removeEventListener(
        "message",
        handleMessage
      );
    };
  }, [navigate]);

  /**
   * Configuration error
   */
  if (!domain || !clientId || !redirectUri) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Authentication configuration error
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            ZITADEL configuration is missing.
            Please check your environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-8 md:pb-32 flex flex-col items-center justify-center gap-6"
      style={{ background: PAPER }}
    >
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
      <div className="w-full max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT BAR: External Links Menu */}
          <div className="lg:col-span-3">
            <div
              className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden"
              style={{ background: CARD, borderColor: LINE }}
            >
              <div
                className="text-white font-bold text-[13px] px-4 py-3 flex items-center gap-2"
                style={{ background: INK }}
              >
                <FileText size={16} />
                <span className="tracking-widest uppercase">Links</span>
              </div>
              <div className="p-4 space-y-3">
                <Link
                  to="/advertisement"
                  className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors"
                  style={{ color: INK }}
                >
                  <span className="mt-0.5" style={{ color: INK }}>
                    •
                  </span>
                  Click Here To View Advertisement
                </Link>
                <Link
                  to="/instructions"
                  className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
                  style={{ color: INK, borderColor: LINE }}
                >
                  <span className="mt-0.5" style={{ color: INK }}>
                    •
                  </span>
                  Important Instructions for Live Photo Upload
                </Link>
                <Link
                  to="/how-to-apply"
                  className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
                  style={{ color: INK, borderColor: LINE }}
                >
                  <span className="mt-0.5" style={{ color: INK }}>
                    •
                  </span>
                  How To Apply
                </Link>
              </div>
            </div>
          </div>

         
         {/* Login Section */}
          <div className="lg:col-span-6">
            <div className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">

              <iframe
                src={authUrl}
                allow="local-network-access"
                width="100%"
                height="650"
                title="Candidate Login"
                style={{
                  border: "none",
                  width: "100%",
                }}
              />

            </div>
          </div>

          {/* RIGHT BAR: Online Services */}
          <div className="lg:col-span-3">
            <div
              className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden"
              style={{ background: CARD, borderColor: LINE }}
            >
              <div
                className="text-white font-bold text-[13px] px-4 py-3 flex items-center gap-2"
                style={{ background: INK }}
              >
                <ExternalLink size={16} />
                <span className="tracking-widest uppercase">
                  Online Services
                </span>
              </div>
              <div className="p-4 space-y-3">
                <Link
                  to="/register"
                  className="flex items-center gap-2 text-[13px] font-semibold hover:underline transition-colors"
                  style={{ color: INK }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${INK}10`, color: INK }}
                  >
                    ›
                  </span>
                  Registration
                </Link>
               
               
                <Link
                  to="/forgot-registration"
                  className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
                  style={{ color: INK, borderColor: LINE }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: `${INK}10`, color: INK }}
                  >
                    ›
                  </span>
                  Forgot Your Registration Number
                </Link>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BSSCLoginPortal;