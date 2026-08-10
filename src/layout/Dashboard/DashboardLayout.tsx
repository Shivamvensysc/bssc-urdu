import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import GovPortalHeader from "./Header";
import Sidebar from "./Sidebar";
import api from "../../api/interceptor";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

interface ApplicationStepsResponse {
  applicationId: string;
  candidateId: string;
  status: string;
  currentStep: number;
  completedSteps: number[];
  isSubmitted: boolean;
  applicationReferenceNumber: string;
  submissionDate: string;
  candidateDetails: {
    registrationNumber: string;
    [key: string]: any;
  };
  steps: {
    step0?: {
      fullName: string;
      emailId: string; // Declared explicitly from your API JSON structure
      [key: string]: any;
    };
    [key: string]: any;
  };
}

// Added the placeholder email key to fix the type inference mismatch
const CANDIDATE_SESSION_DEFAULT = {
  name: "NANCY KUMARI GUPTA",
  registrationNo: "5250000005",
  completionPercent: 50,
  email: "candidate@example.com", 
};

// Design tokens — set once here, consumed by Header, Sidebar, and page
// content via var(--token-name) so the whole app shares one palette.
const THEME_VARS = {
  ["--ink" as string]: "#12233F",
  ["--ink-soft" as string]: "#5B6B84",
  ["--paper" as string]: "#F4F5F2",
  ["--card" as string]: "#FFFFFF",
  ["--line" as string]: "#DBDFE6",
  ["--ochre" as string]: "#B9722E",
  ["--ochre-deep" as string]: "#8F5522",
  ["--teal" as string]: "#1E6F5C",
  ["--danger" as string]: "#B3432B",
} as React.CSSProperties;

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop icon rail
  
  // API states
  const [isSubmitted, setIsSubmitted] = useState<boolean | null>(null);
  const [candidateSession, setCandidateSession] = useState(CANDIDATE_SESSION_DEFAULT);

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const response = await api.get<{ success: boolean; data: ApplicationStepsResponse }>(
          `${API_BASE_URL}/application/steps/all`,
          getAuthHeaders()
        );

        if (response.data && response.data.success) {
          const apiData = response.data.data;
          setIsSubmitted(apiData.isSubmitted);

          // Dynamically populate candidate details from API response
          const fullName = apiData.steps?.step0?.fullName || CANDIDATE_SESSION_DEFAULT.name;
          const regNo = apiData.candidateDetails?.registrationNumber || CANDIDATE_SESSION_DEFAULT.registrationNo;
          const emailAddress = apiData.steps?.step0?.emailId || CANDIDATE_SESSION_DEFAULT.email;
          
          // Calculate dynamic percentage based on completed steps (6 steps total: 0 to 5)
          const completedCount = apiData.completedSteps?.length || 0;
          const completionPercent = Math.round((completedCount / 6) * 100);

          setCandidateSession({
            name: fullName.toUpperCase(),
            registrationNo: regNo,
            completionPercent: completionPercent || CANDIDATE_SESSION_DEFAULT.completionPercent,
            email: emailAddress, // Safely bound here
          });
        }
      } catch (error) {
        console.error("Error fetching application steps:", error);
        // Fallback to default unsaved/unsubmitted states on error
        setIsSubmitted(false);
      }
    };

    fetchApplicationData();
  }, [location.pathname]);

  return (
    <div
      className="h-screen flex flex-col bg-[var(--paper)]"
      style={THEME_VARS}
    >
      <GovPortalHeader
        showCandidateName={candidateSession.name}
        showRegistrationNo={candidateSession.registrationNo}
        email={candidateSession.email}
        onMenuClick={() => setSidebarOpen(true)}
        isSidebarCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      <div className="flex-1 flex min-h-0">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          activePath={location.pathname}
          candidateName={candidateSession.name}
          registrationNo={candidateSession.registrationNo}
          completionPercent={candidateSession.completionPercent}
          isSubmitted={isSubmitted}
        />

        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto bg-[var(--paper)]">
          {/* subtle backdrop texture so the paper tone doesn't feel flat */}
          <main
            id="main-content"
            className="flex-1 max-w-screen-2xl w-full mx-auto px-3 sm:px-5 py-4 sm:py-6"
          >
            <Outlet />
          </main>

          <footer className="flex-shrink-0 bg-[var(--ink)] border-t-2 border-[var(--ochre)]">
            <div className="max-w-screen-2xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-1 text-center">
              <p className="text-[11px] sm:text-xs text-white/85 tracking-wide">
                © 2026 Bihar Staff Selection Commission. All Rights Reserved.
              </p>
              <span className="hidden sm:inline text-white/40">•</span>
              <p className="text-[11px] sm:text-xs text-white/60">
                Designed &amp; Developed by NIC Bihar
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}