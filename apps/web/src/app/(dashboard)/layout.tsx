'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  BottomNav,
  Avatar,
  cn,
} from '@kintree/ui';
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/lib/auth-provider';
import { useNotifications } from '@/hooks/useNotifications';
import { useFamilyInvitations } from '@/hooks/useFamilyInvitations';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: <HomeIcon />,
  },
  {
    href: '/tree',
    label: 'Family Tree',
    icon: <TreeIcon />,
  },
  {
    href: '/security',
    label: 'Security',
    icon: <ShieldIcon />,
  },
  {
    href: '/social',
    label: 'Social',
    icon: <UsersIcon />,
  },
  {
    href: '/dyk',
    label: 'Do You Know',
    icon: <QuizIcon />,
  },
];

const settingsItems = [
  {
    href: '/invitations',
    label: 'Invitations',
    icon: <InviteIcon />,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: <SettingsIcon />,
  },
];

// Get page title from pathname
function getPageTitle(pathname: string): string {
  if (pathname === '/') return 'Dashboard';
  const route = [...navigationItems, ...settingsItems].find(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  );
  return route?.label || 'KinTree';
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { signOut, isLoading: authLoading } = useAuth();
  const { unreadCount } = useNotifications();
  const { receivedInvitations, refreshInvitations } = useFamilyInvitations();
  const pendingInvitationsCount = receivedInvitations.length;

  // Refresh invitations when route changes (e.g., after accepting an invitation)
  useEffect(() => {
    refreshInvitations();
  }, [pathname]);

  const userName = user ? `${user.firstName} ${user.lastName}`.trim() || 'User' : 'User';
  const userEmail = user?.email || '';
  const pageTitle = getPageTitle(pathname);

  // Auth protection - redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [isAuthenticated, authLoading, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Show loading while checking auth
  if (authLoading || isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-primary animate-bounce-subtle">
            <TreeIcon className="w-7 h-7 text-white" />
          </div>
          <p className="text-neutral-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Mobile Header with Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-40 md:hidden bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-primary">
              <TreeIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-neutral-900">{pageTitle}</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -mr-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            aria-label="Open menu"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-out Menu */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-72 bg-white/95 backdrop-blur-xl shadow-elevated-lg md:hidden',
          'transform transition-transform duration-300 ease-out',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-100">
            <span className="font-bold text-lg text-neutral-900">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 -mr-2 text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Close menu"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="mb-4">
              <div className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Menu
              </div>
              {navigationItems.map((item) => (
                <MobileNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.href)}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>

            <div>
              <div className="px-3 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Account
              </div>
              {settingsItems.map((item) => (
                <MobileNavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.href)}
                  onClick={() => setMobileMenuOpen(false)}
                  badge={item.href === '/invitations' && pendingInvitationsCount > 0 ? pendingInvitationsCount : undefined}
                />
              ))}
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-neutral-100 bg-gradient-to-t from-neutral-50/80">
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={userName} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {userName}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {userEmail}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogoutIcon className="w-5 h-5" />
              <span className="font-medium">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <SidebarHeader
            logo={
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-primary">
                <TreeIcon className="w-5 h-5 text-white" />
              </div>
            }
            title="KinTree"
          />

          <SidebarContent>
            <SidebarGroup title="Menu">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.href)}
                  collapsed={sidebarCollapsed}
                />
              ))}
            </SidebarGroup>

            <SidebarGroup title="Account">
              {settingsItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.href)}
                  collapsed={sidebarCollapsed}
                  badge={item.href === '/invitations' && pendingInvitationsCount > 0 ? pendingInvitationsCount : undefined}
                />
              ))}
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="flex items-center gap-3">
              <Avatar name={userName} size="md" />
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {userEmail}
                  </p>
                </div>
              )}
              {!sidebarCollapsed && (
                <button
                  onClick={handleSignOut}
                  className="p-2 text-neutral-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  title="Sign out"
                >
                  <LogoutIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-14 pb-16 md:pt-0 md:pb-0 bg-gradient-to-br from-neutral-50 to-white">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav>
        {navigationItems.slice(0, 5).map((item) => (
          <BottomNavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href)}
          />
        ))}
      </BottomNav>
    </div>
  );
}

// Custom NavItem component using Next.js Link
function NavItem({
  href,
  icon,
  label,
  active,
  collapsed,
  badge,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl',
        'text-left transition-all duration-200 relative',
        'min-h-[44px] transform-gpu',
        active
          ? 'bg-neutral-900 text-white shadow-md'
          : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900',
        collapsed && 'justify-center px-0'
      )}
    >
      <span
        className={cn(
          'shrink-0 w-5 h-5 relative transition-colors',
          active ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-600'
        )}
      >
        {icon}
        {collapsed && badge && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </span>
      {!collapsed && <span className={cn('flex-1 truncate font-medium', active ? 'text-white' : '')}>{label}</span>}
      {!collapsed && badge && badge > 0 && (
        <span className={cn(
          "w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center",
          active ? "bg-white text-neutral-900" : "bg-neutral-100 text-neutral-600"
        )}>
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  );
}

// Custom BottomNavLink component
function BottomNavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center gap-1',
        'min-w-[64px] min-h-[50px] px-2 py-1',
        'transition-all duration-200 relative',
        active ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
      )}
    >
      <span className={cn('w-6 h-6 transition-all duration-200', active && 'scale-105 stroke-[2.5px]')}>
        {icon}
      </span>
      <span className={cn('text-[10px] font-semibold tracking-wide', active ? 'text-neutral-900' : 'text-neutral-400')}>
        {label}
      </span>
    </Link>
  );
}

// Mobile NavItem component
function MobileNavItem({
  href,
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-3 rounded-xl',
        'text-left transition-all duration-300',
        'min-h-[48px]',
        active
          ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 text-primary-700'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
      )}
    >
      <span
        className={cn(
          'shrink-0 w-5 h-5',
          active ? 'text-primary-600' : 'text-neutral-400'
        )}
      >
        {icon}
      </span>
      <span className="flex-1 font-medium">{label}</span>
      {badge && badge > 0 && (
        <span className="w-5 h-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-primary">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
      {active && !badge && (
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600" />
      )}
    </Link>
  );
}

// Icons
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

function TreeIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22V8M12 8C9 8 6 5 6 2h12c0 3-3 6-6 6z" />
      <path d="M9 22h6" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function QuizIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16,17 21,12 16,7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-6 h-6'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-6 h-6'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function InviteIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}
