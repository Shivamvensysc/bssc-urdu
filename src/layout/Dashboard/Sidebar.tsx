import React from "react";
import { LayoutDashboard, FileText, LogOut, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface NavItem {
  id: string;
  label: string;
  labelHi: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const MAIN_NAV: NavItem[] = [
  {
    id: "nav-dashboard",
    label: "Dashboard",
    labelHi: "डैशबोर्ड",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "nav-application",
    label: "My Application",
    labelHi: "मेरा आवेदन",
    href: "/application",
    icon: FileText,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  activePath?: string;
  candidateName: string;
  registrationNo: string;
  completionPercent: number;
  isSubmitted: boolean | null; // Passed down from parent layout state
}

function NavRow({
  item,
  isActive,
  isCollapsed,
  onClose,
  isSubmitted,
}: {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  isSubmitted: boolean | null;
}) {
  const Icon = item.icon;
  const isDashboardDisabled = item.href === "/dashboard" && isSubmitted === false;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDashboardDisabled) {
      e.preventDefault(); // Stop navigation if not submitted
      return;
    }
    onClose();
  };

  return (
    <Link
      to={isDashboardDisabled ? "#" : item.href}
      onClick={handleClick}
      title={isCollapsed ? item.label : undefined}
      className={`group relative flex items-center rounded-lg text-sm font-medium transition-colors ${
        isCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5"
      } ${
        isDashboardDisabled
          ? "opacity-50 cursor-not-allowed text-[var(--ink-soft)]"
          : isActive
          ? "text-[var(--ink)] bg-[var(--ochre)]/10"
          : "text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--paper)]"
      }`}
    >
      {isActive && !isDashboardDisabled && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[var(--ochre)]" />
      )}
      <span className="relative flex-shrink-0">
        <Icon
          size={17}
          className={
            isActive && !isDashboardDisabled
              ? "text-[var(--ochre-deep)]"
              : "text-[var(--ink-soft)] group-hover:text-[var(--ink)]"
          }
        />
        {isCollapsed && item.badge ? (
          <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[var(--danger)]" />
        ) : null}
      </span>

      {!isCollapsed && (
        <>
          <span className="flex-1 min-w-0">
            <span className="block truncate">{item.label}</span>
            <span className="block text-[10px] font-normal opacity-70 truncate">
              {item.labelHi}
            </span>
          </span>
          {item.badge ? (
            <span className="text-[10px] font-bold text-white rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 bg-[var(--danger)]">
              {item.badge}
            </span>
          ) : null}
        </>
      )}

      {/* Tooltip shown on hover while collapsed (desktop only) */}
      {isCollapsed && (
        <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-[var(--ink)]">
          {item.label}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  activePath = "/dashboard",
  isSubmitted,
}: SidebarProps) {
  const navigate = useNavigate();

 const handleLogout = () => {
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

  // Filter main nav dynamically based on isSubmitted status
  const visibleNavItems = MAIN_NAV.filter((item) => {
    // If the form has been submitted, hide the application form tab
    if (item.href === "/application" && isSubmitted === true) {
      return false;
    }
    return true;
  });

  const renderContent = (collapsed: boolean) => (
    <div className="flex flex-col h-full">
      {/* Mobile close button (drawer is never collapsed, only closed) */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--line)]">
        <span className="text-sm font-bold text-[var(--ink)]">Menu</span>
        <button
          onClick={onClose}
          className="p-1.5 rounded hover:bg-[var(--paper)] text-[var(--ink-soft)]"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav
        className={`flex-1 overflow-y-auto py-4 space-y-6 ${collapsed ? "px-2" : "px-3"}`}
      >
        <div>
          <div className="space-y-1">
            {visibleNavItems.map((item) => (
              <NavRow
                key={item.id}
                item={item}
                isActive={activePath === item.href}
                isCollapsed={collapsed}
                onClose={onClose}
                isSubmitted={isSubmitted}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer / logout */}
      <div
        className={`border-t border-[var(--line)] ${collapsed ? "p-2" : "p-3"}`}
      >
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={`group relative w-full flex items-center rounded-lg text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors ${
            collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2.5"
          }`}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && "Logout / लॉग आउट"}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-[var(--ink)]">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:flex lg:flex-col flex-shrink-0 border-r border-[var(--line)] h-full overflow-visible transition-[width] duration-200 ease-in-out bg-[var(--card)] ${
          isCollapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {renderContent(isCollapsed)}
      </aside>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-[var(--ink)]/50 backdrop-blur-[1px]"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[80vw] h-full shadow-2xl bg-[var(--card)] animate-[slideIn_0.2s_ease-out]">
            {renderContent(false)}
          </aside>
        </div>
      )}
    </>
  );
}