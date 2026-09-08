import { useState, useRef, useEffect } from "react";
import {
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  User2,
  Mail,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GovPortalHeaderProps {
  showCandidateName: string;
  showRegistrationNo: string;
  email?: string; // Captures dynamic email from parent state
  notificationCount?: number;
  onMenuClick?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Header({
  showCandidateName,
  showRegistrationNo,
  email = "candidate@example.com", // Fallback default value
  onMenuClick,
  isSidebarCollapsed = false,
  onToggleCollapse,
}: GovPortalHeaderProps) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // const handleLogout = () => {
  //   setIsDropdownOpen(false);
  //   navigate("/");
  // };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    const idToken = localStorage.getItem("idToken");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");

    const domain = import.meta.env.VITE_ZITADEL_DOMAIN;
    const clientId = import.meta.env.VITE_ZITADEL_CLIENT_ID; // <-- Get Client ID
    const postLogoutUri = import.meta.env.VITE_ZITADEL_POST_LOGOUT_REDIRECT_URI;

    if (domain && idToken && postLogoutUri) {
      // <-- Added client_id to the URL parameters
      const logoutUrl = `https://${domain}/oidc/v1/end_session?client_id=${clientId}&id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(postLogoutUri)}`;
      
      console.log("SENDING LOGOUT URL:", logoutUrl); // Check this in your browser console!
      window.location.href = logoutUrl; 
    } else {
      navigate("/"); 
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[var(--card)] border-b border-[var(--line)] shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-5 lg:px-8 xl:px-10 2xl:px-16 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Left Side: Navigation Controls & Portal Title */}
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

        {/* Right Side: User Profile & Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="relative" ref={dropdownRef}>
            {/* Desktop User Chip Trigger */}
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="hidden md:flex items-center gap-2 pl-2.5 pr-3 py-1 rounded-full border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink-soft)]/40 transition-colors cursor-pointer text-left focus:outline-none"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
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
              <ChevronDown
                size={14}
                className={`text-[var(--ink-soft)] transition-transform duration-200 ml-1 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Mobile/Compact User Avatar Trigger */}
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex md:hidden w-8 h-8 rounded-full bg-[var(--paper)] border border-[var(--line)] items-center justify-center hover:border-[var(--ink-soft)]/40 transition-colors focus:outline-none"
              aria-label="User menu"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              <User2 size={14} className="text-[var(--ochre-deep)]" />
            </button>

            {/* Dropdown Menu Popup */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg bg-[var(--card)] border border-[var(--line)] shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Profile Summary Header inside Menu */}
                <div className="px-4 py-2.5 border-b border-[var(--line)] bg-[var(--paper)]/50">
                  <p className="text-xs font-semibold text-[var(--ink)] truncate">
                    {showCandidateName}
                  </p>
                  <p className="text-[11px] text-[var(--ink-soft)] tabular-nums truncate mt-0.5">
                    Reg. No: {showRegistrationNo}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--ink-soft)] truncate mt-1">
                    <Mail size={12} className="flex-shrink-0" />
                    <span className="truncate">{email}</span>
                  </div>
                </div>

                {/* Dropdown Menu Actions */}
                <div className="p-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}