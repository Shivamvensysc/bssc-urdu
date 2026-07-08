import {
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  User2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GovPortalHeaderProps {
  showCandidateName: string;
  showRegistrationNo: string;
  notificationCount?: number;
  onMenuClick?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleCollapse?: () => void;
}
export default function Header({
  showCandidateName,
  showRegistrationNo,
  onMenuClick,
  isSidebarCollapsed = false,
  onToggleCollapse,
}: GovPortalHeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--card)] border-b border-[var(--line)] shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-5 lg:px-8 xl:px-10 2xl:px-16 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile sidebar toggle */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-md text-[var(--ink)] hover:bg-[var(--paper)] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Desktop sidebar collapse / expand toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 -ml-2 rounded-md text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors"
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen size={19} />
            ) : (
              <PanelLeftClose size={19} />
            )}
          </button>

          <div className="min-w-0">
            <h1 className="font-serif text-sm sm:text-base font-bold text-[var(--ink)] leading-tight truncate">
              BSSC Online Candidate Portal
            </h1>
            <p className="text-[11px] sm:text-xs text-[var(--ink-soft)] leading-tight truncate">
              बीएसएससी ऑनलाइन अभ्यर्थी पोर्टल
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Candidate chip */}
          <div className="hidden md:flex items-center gap-2 pl-2.5 pr-3 py-1 rounded-full border border-[var(--line)] bg-[var(--paper)]">
            <div className="w-7 h-7 rounded-full bg-[var(--card)] border border-[var(--line)] flex items-center justify-center">
              <User2 size={14} className="text-[var(--ochre-deep)]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--ink)] leading-tight max-w-[140px] truncate">
                {showCandidateName}
              </p>
              <p className="text-[10px] text-[var(--ink-soft)] tabular-nums leading-tight">
                {showRegistrationNo}
              </p>
            </div>
          </div>

          {/* Compact avatar-only chip for small/medium screens */}
          <div className="flex md:hidden w-8 h-8 rounded-full bg-[var(--paper)] border border-[var(--line)] items-center justify-center">
            <User2 size={14} className="text-[var(--ochre-deep)]" />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-md border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] hover:border-[var(--danger)]/40 transition-colors"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
