import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import GovPortalHeader from "./Header";
import Sidebar from "./Sidebar";

const CANDIDATE_SESSION = {
  name: "NANCY KUMARI GUPTA",
  registrationNo: "5250000005",
  completionPercent: 50,
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

  return (
    <div
      className="h-screen flex flex-col bg-[var(--paper)]"
      style={THEME_VARS}
    >
      <GovPortalHeader
        showCandidateName={CANDIDATE_SESSION.name}
        showRegistrationNo={CANDIDATE_SESSION.registrationNo}
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
          candidateName={CANDIDATE_SESSION.name}
          registrationNo={CANDIDATE_SESSION.registrationNo}
          completionPercent={CANDIDATE_SESSION.completionPercent}
        />

        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto bg-[var(--paper)]">
          {/* subtle backdrop texture so the paper tone doesn't feel flat */}
          <main
            id="main-content"
            className="flex-1 max-w-screen-2xl w-full mx-auto px-3 sm:px-5   py-4 sm:py-6"
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
