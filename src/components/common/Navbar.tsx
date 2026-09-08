import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Bell,
  CheckCheck,
  ChevronDown,
  LogOut,
  Settings,
  Shield,
  User,
  Users,
  ExternalLink,
  MessageCircle,
  Menu,
  X,
  RotateCcw,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const {
    user,
    tenant,
    currentRoute,
    navigate,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    loginAs,
    logout,
    resetToDemoData,
    showToast,
  } = useApp();

  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDemoSwitchOpen, setIsDemoSwitchOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isAppRoute = currentRoute.startsWith('/app');
  const isOpsRoute = currentRoute.startsWith('/ops');
  const isPublicRoute = !isAppRoute && !isOpsRoute;

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          {isAppRoute && onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div
            onClick={() => navigate(user ? '/app/dashboard' : '/')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-stone-900">
                  WishFlow<span className="text-emerald-600">.ai</span>
                </span>
                {isOpsRoute && (
                  <span className="text-[10px] font-bold uppercase bg-stone-900 text-white px-1.5 py-0.2 rounded-sm">
                    OPS
                  </span>
                )}
              </div>
              <span className="text-[10px] text-stone-500 hidden sm:block leading-none">
                WhatsApp Birthday Automation
              </span>
            </div>
          </div>
        </div>

        {/* Center: Public Links (if on public page) */}
        {isPublicRoute && (
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-600">
            <button
              onClick={() => navigate('/')}
              className={`hover:text-emerald-600 transition-colors ${currentRoute === '/' ? 'text-emerald-600 font-semibold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/features')}
              className={`hover:text-emerald-600 transition-colors ${currentRoute === '/features' ? 'text-emerald-600 font-semibold' : ''}`}
            >
              Features
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className={`hover:text-emerald-600 transition-colors ${currentRoute === '/pricing' ? 'text-emerald-600 font-semibold' : ''}`}
            >
              Pricing
            </button>
            <button
              onClick={() => navigate('/scgt-info')}
              className={`hover:text-emerald-600 transition-colors ${currentRoute === '/scgt-info' ? 'text-emerald-600 font-semibold' : ''}`}
            >
              SCGT Networking
            </button>
            <button
              onClick={() => navigate('/demo')}
              className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Live Demo
            </button>
          </nav>
        )}

        {/* Right Section: Role Indicator, Demo Switcher, Notifications, User Menu */}
        <div className="flex items-center gap-2.5">
          {/* Fast Demo Role Switcher */}
          <div className="relative">
            <button
              id="demo-role-switcher-btn"
              onClick={() => setIsDemoSwitchOpen(!isDemoSwitchOpen)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200/80 text-stone-700 rounded-xl transition-colors border border-stone-200/70"
              title="Switch demo persona for testing"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="capitalize">{user?.role || 'Guest'}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isDemoSwitchOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 text-xs text-stone-700"
                onClick={() => setIsDemoSwitchOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Switch Demo Persona
                </div>
                <button
                  onClick={() => loginAs('owner')}
                  className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-stone-900">Dr. Rajesh (Owner)</div>
                    <div className="text-[10px] text-stone-500">Sunrise Dental Care • Full Access</div>
                  </div>
                </button>
                <button
                  onClick={() => loginAs('staff')}
                  className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2"
                >
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-stone-900">Front Desk (Staff)</div>
                    <div className="text-[10px] text-stone-500">Restricted export & billing</div>
                  </div>
                </button>
                <button
                  onClick={() => loginAs('superadmin')}
                  className="w-full text-left px-3 py-2 hover:bg-stone-50 flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  <div>
                    <div className="font-semibold text-stone-900">Super Admin (Ops Console)</div>
                    <div className="text-[10px] text-stone-500">Multi-tenant, SCGT queue, AI logs</div>
                  </div>
                </button>
                <div className="border-t border-stone-100 my-1"></div>
                <button
                  onClick={resetToDemoData}
                  className="w-full text-left px-3 py-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-50 flex items-center gap-1.5 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset to Fresh Demo Data
                </button>
              </div>
            )}
          </div>

          {/* Quick link to public collection page */}
          {user && (
            <button
              onClick={() => navigate('/public/sunrise-dental-pune')}
              className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-stone-600 hover:text-emerald-600 px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors"
              title="View your public birthday registration page"
            >
              <span>Public Form</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}

          {/* Notifications Dropdown (for authenticated users) */}
          {user && (
            <div className="relative">
              <button
                id="notifications-bell-btn"
                onClick={() => setIsNotifsOpen(!isNotifsOpen)}
                className="relative p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifsOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200/90 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setIsNotifsOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900">Notifications</span>
                      <span className="ml-1.5 text-[10px] text-stone-500">({unreadCount} unread)</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAllNotificationsRead();
                        }}
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-stone-400">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.actionUrl) navigate(n.actionUrl);
                          }}
                          className={`p-3.5 hover:bg-stone-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-stone-900">{n.title}</span>
                            <span className="text-[10px] text-stone-400 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="text-stone-600 mt-0.5 text-[11px] leading-relaxed">{n.description}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-2 border-t border-stone-100 bg-stone-50 text-center">
                    <button
                      onClick={() => navigate('/app/notifications')}
                      className="text-emerald-700 hover:text-emerald-800 font-medium text-[11px]"
                    >
                      View All Notification Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile / Auth Action */}
          {user ? (
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 min-h-[44px] transition-colors"
                aria-label="User profile menu"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-xl object-cover border border-stone-200"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-stone-900 leading-tight truncate max-w-[120px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-stone-500 leading-none truncate max-w-[120px]">
                    {tenant.profile.businessName}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 text-xs text-stone-700"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-stone-100">
                    <div className="font-semibold text-stone-900">{user.name}</div>
                    <div className="text-[11px] text-stone-500">{user.email}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                        {tenant.planId.toUpperCase()} Plan
                      </span>
                      {tenant.scgtVerified && (
                        <span className="text-[10px] font-medium bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                          SCGT Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/app/settings/profile')}
                    className="w-full text-left px-3.5 py-2 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    Profile & Account
                  </button>
                  <button
                    onClick={() => navigate('/app/settings/whatsapp')}
                    className="w-full text-left px-3.5 py-2 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp Connection
                  </button>
                  <button
                    onClick={() => navigate('/app/settings/billing')}
                    className="w-full text-left px-3.5 py-2 hover:bg-stone-50 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-stone-500" />
                    Subscription & Credits
                  </button>

                  <div className="border-t border-stone-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 rounded-xl hover:bg-stone-100 min-h-[44px] transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs min-h-[44px] transition-colors flex items-center gap-1.5"
              >
                <span>Start Free</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
