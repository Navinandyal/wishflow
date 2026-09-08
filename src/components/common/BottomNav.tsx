import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Cake,
  Users,
  MessageSquare,
  MoreHorizontal,
  Sparkles,
  Send,
  FileText,
  BarChart3,
  Award,
  Settings,
  X,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentRoute, navigate, customers } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const today = new Date();
  const todayBirthdaysCount = customers.filter(
    (c) =>
      c.birthdayDay === today.getDate() &&
      c.birthdayMonth === today.getMonth() + 1 &&
      !c.archived
  ).length;

  const mainTabs = [
    { label: 'Home', path: '/app/dashboard', icon: LayoutDashboard },
    {
      label: 'Birthdays',
      path: '/app/birthdays',
      icon: Cake,
      badge: todayBirthdaysCount > 0 ? todayBirthdaysCount : undefined,
    },
    { label: 'Customers', path: '/app/customers', icon: Users },
    { label: 'Messages', path: '/app/messages', icon: MessageSquare },
  ];

  const moreItems = [
    { label: 'Wish Generator', path: '/app/wishes', icon: Sparkles, color: 'text-emerald-600' },
    { label: 'Review & Send All', path: '/app/review-send', icon: Send, color: 'text-emerald-600' },
    { label: 'Templates Library', path: '/app/templates', icon: FileText, color: 'text-stone-600' },
    { label: 'Reports & Analytics', path: '/app/reports', icon: BarChart3, color: 'text-stone-600' },
    { label: 'SCGT Networking', path: '/app/scgt', icon: Award, color: 'text-indigo-600' },
    { label: 'Settings & WhatsApp', path: '/app/settings', icon: Settings, color: 'text-stone-600' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-nav"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg px-2 py-1 flex items-center justify-around select-none"
      >
        {mainTabs.map((tab) => {
          const isActive = currentRoute === tab.path || (tab.path !== '/app/dashboard' && currentRoute.startsWith(tab.path));
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              id={`mobile-tab-${tab.label.toLowerCase()}`}
              onClick={() => handleNav(tab.path)}
              className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 transition-colors relative ${
                isActive ? 'text-emerald-600 font-semibold' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center px-1">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-none">{tab.label}</span>
            </button>
          );
        })}

        {/* More Tab Button */}
        <button
          id="mobile-tab-more"
          onClick={() => setIsMoreOpen(true)}
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 text-stone-500 hover:text-stone-900 ${
            isMoreOpen ? 'text-emerald-600 font-semibold' : ''
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] leading-none">More</span>
        </button>
      </nav>

      {/* More Bottom Sheet Drawer */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex flex-col justify-end">
          <div
            id="mobile-more-bottom-sheet"
            className="bg-white rounded-t-3xl shadow-2xl p-5 border-t border-stone-200 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="font-bold text-sm text-stone-900">More Tools & Navigation</span>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className="p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 flex flex-col items-start gap-2 text-left min-h-[72px]"
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-xs font-semibold text-stone-900 leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
