import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cake,
  Bell,
  CheckCircle2,
  Sparkles,
  X,
  Send,
  Calendar,
  Volume2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const MorningBirthdayAlertBanner: React.FC = () => {
  const {
    customers,
    navigate,
    setIsReviewSendAllOpen,
    notificationPermission,
    requestNotificationPermission,
    localNotificationSettings,
    triggerMorningBirthdayCheck,
    activeMorningAlert,
    dismissMorningBanner,
  } = useApp();

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;

  // Contacts celebrating birthdays today
  const todayBirthdayCustomers = customers.filter(
    (c) => !c.archived && c.birthdayDay === currentDay && c.birthdayMonth === currentMonth
  );

  // If no birthdays today or user dismissed active alert, do not show
  if (todayBirthdayCustomers.length === 0 || !activeMorningAlert) {
    return null;
  }

  const count = todayBirthdayCustomers.length;
  const firstNames = todayBirthdayCustomers.map((c) => c.name).slice(0, 3).join(', ');
  const remainingCount = count > 3 ? count - 3 : 0;

  return (
    <div
      id="morning-birthday-alert-banner"
      className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white border-b border-emerald-700/60 px-4 py-3 sm:px-6 transition-all shadow-md relative z-30"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left info */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
            <Cake className="w-5 h-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>Morning Birthday Alert</span>
                <span className="text-[10px] font-extrabold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  {count} {count === 1 ? 'Birthday' : 'Birthdays'} Today
                </span>
              </span>

              {notificationPermission === 'granted' ? (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Desktop Alert Sent
                </span>
              ) : notificationPermission === 'default' ? (
                <button
                  onClick={requestNotificationPermission}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-200 hover:text-white bg-amber-900/50 hover:bg-amber-800/60 px-2 py-0.5 rounded-full border border-amber-500/50 transition-colors cursor-pointer"
                  title="Enable desktop notifications for morning birthday alerts"
                >
                  <Bell className="w-3 h-3 text-amber-300" />
                  <span>Enable Desktop Notifications</span>
                </button>
              ) : null}
            </div>

            <p className="text-xs text-stone-200 mt-0.5">
              Good morning! Wish{' '}
              <strong className="text-amber-200 font-semibold">{firstNames}</strong>
              {remainingCount > 0 && ` and ${remainingCount} other${remainingCount > 1 ? 's' : ''}`} a
              heartfelt birthday today.
            </p>
          </div>
        </div>

        {/* Right action buttons */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          <button
            id="morning-banner-review-send-btn"
            onClick={() => setIsReviewSendAllOpen(true)}
            className="min-h-[38px] px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>1-Click Review & Send ({count})</span>
          </button>

          <button
            onClick={() => navigate('/app/birthdays')}
            className="min-h-[38px] px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
          >
            <Calendar className="w-3.5 h-3.5 text-stone-300" />
            <span>View All</span>
          </button>

          <button
            onClick={() => triggerMorningBirthdayCheck(true)}
            className="min-h-[38px] px-2.5 py-1.5 bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            title="Re-test notification chime and alert"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Test Alert</span>
          </button>

          <button
            id="morning-banner-dismiss-btn"
            onClick={dismissMorningBanner}
            className="min-h-[38px] min-w-[38px] p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Dismiss morning birthday alert"
            title="Dismiss alert for today"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
