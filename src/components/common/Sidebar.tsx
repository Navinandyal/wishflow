import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Cake,
  Sparkles,
  Send,
  FileText,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Award,
  Settings,
  ShieldCheck,
  ChevronRight,
  Wifi,
  WifiOff,
  Bell,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { currentRoute, navigate, customers, tenant } = useApp();

  const today = new Date();
  const todayBirthdaysCount = customers.filter(
    (c) =>
      c.birthdayDay === today.getDate() &&
      c.birthdayMonth === today.getMonth() + 1 &&
      !c.archived
  ).length;

  const navItems = [
    { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    {
      label: 'Customers',
      path: '/app/customers',
      icon: Users,
      badge: customers.filter((c) => !c.archived).length,
    },
    {
      label: 'Birthdays',
      path: '/app/birthdays',
      icon: Cake,
      badge: todayBirthdaysCount > 0 ? `${todayBirthdaysCount} Today` : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    { label: 'Wish Generator', path: '/app/wishes', icon: Sparkles, highlight: true },
    { label: 'Review & Send', path: '/app/review-send', icon: Send },
    { label: 'Templates Library', path: '/app/templates', icon: FileText },
    { label: 'Message History', path: '/app/messages', icon: MessageSquare },
    { label: 'Reports', path: '/app/reports', icon: BarChart3 },
    { label: 'Analytics', path: '/app/analytics', icon: TrendingUp },
  ];

  const scgtItems = [
    {
      label: 'SCGT Networking',
      path: '/app/scgt',
      icon: Award,
      badge: tenant.scgtVerified ? 'Verified' : 'Pending',
      badgeColor: tenant.scgtVerified ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800',
    },
  ];

  const bottomItems = [
    { label: 'Notifications', path: '/app/notifications', icon: Bell },
    { label: 'Settings', path: '/app/settings', icon: Settings },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const percentCredits = Math.round(
    (tenant.aiCreditsRemaining / tenant.aiCreditsMonthlyLimit) * 100
  );

  return (
    <aside
      id="app-desktop-sidebar"
      className="w-64 h-[calc(100vh-4rem)] sticky top-16 bg-white border-r border-stone-200 flex flex-col justify-between overflow-y-auto p-4 select-none"
    >
      <div className="space-y-6">
        {/* Quick Action Button for Today's Send */}
        <button
          onClick={() => handleNav('/app/review-send')}
          className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-between shadow-xs transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-100 group-hover:translate-x-0.5 transition-transform" />
            <span>Today's Wishes</span>
          </div>
          <span className="bg-emerald-800/60 px-2 py-0.5 rounded-full text-[11px] font-bold">
            {todayBirthdaysCount}
          </span>
        </button>

        {/* Primary Navigation */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 mb-1.5">
            Main Menu
          </div>
          {navItems.map((item) => {
            const isActive = currentRoute === item.path || currentRoute.startsWith(`${item.path}/`);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                id={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNav(item.path)}
                className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/80 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-emerald-600' : 'text-stone-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.badgeColor || 'bg-stone-100 text-stone-600 border-stone-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* SCGT Special Module */}
        <div className="space-y-1 pt-2 border-t border-stone-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 px-3 mb-1.5 flex items-center justify-between">
            <span>SCGT Club</span>
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          {scgtItems.map((item) => {
            const isActive = currentRoute.startsWith('/app/scgt');
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                id="sidebar-link-scgt"
                onClick={() => handleNav(item.path)}
                className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-900 font-semibold border border-indigo-200 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* System and Settings */}
        <div className="space-y-1 pt-2 border-t border-stone-100">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 mb-1.5">
            Preferences
          </div>
          {bottomItems.map((item) => {
            const isActive = currentRoute === item.path || currentRoute.startsWith(`${item.path}/`);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                id={`sidebar-link-${item.label.toLowerCase()}`}
                onClick={() => handleNav(item.path)}
                className={`w-full min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/80 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Widget: WhatsApp Health & AI Credits */}
      <div className="pt-4 border-t border-stone-100 space-y-3">
        {/* WhatsApp Cloud API Health Status */}
        <div
          onClick={() => handleNav('/app/settings/whatsapp')}
          className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 cursor-pointer hover:bg-stone-100 transition-colors"
        >
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-700">
            <div className="flex items-center gap-1.5">
              {tenant.whatsAppStatus === 'connected' ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>WhatsApp API</span>
            </div>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                tenant.whatsAppStatus === 'connected'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {tenant.whatsAppStatus === 'connected' ? 'Connected' : 'Offline'}
            </span>
          </div>
          <div className="text-[10px] text-stone-500 mt-1 truncate">
            {tenant.whatsAppNumber || 'Not configured'}
          </div>
        </div>

        {/* AI Credits Meter */}
        <div
          onClick={() => handleNav('/app/settings/billing')}
          className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 cursor-pointer hover:bg-stone-100 transition-colors"
        >
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-700 mb-1.5">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              AI Wishes
            </span>
            <span className="text-[10px] font-bold text-stone-900">
              {tenant.aiCreditsRemaining} / {tenant.aiCreditsMonthlyLimit}
            </span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                percentCredits < 20 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${percentCredits}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-stone-500 mt-1">
            <span>Professional Plan</span>
            <span className="text-emerald-700 font-semibold hover:underline">Upgrade</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
