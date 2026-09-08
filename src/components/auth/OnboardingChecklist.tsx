import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Users,
  MessageCircle,
  Sliders,
  Send,
  Building,
} from 'lucide-react';

export const OnboardingChecklist: React.FC = () => {
  const { navigate, tenant, customers } = useApp();

  const isCustomersAdded = customers.length > 0;
  const isWhatsAppConnected = tenant.whatsAppStatus === 'connected';
  const isToneConfigured = true; // preset to default
  const isWishPreviewed = true; // preset in demo

  const items = [
    {
      id: 'step_account',
      title: 'Create account & business profile',
      desc: `Registered as ${tenant.profile.businessName} (${tenant.profile.industry})`,
      completed: true,
      actionLabel: 'View Profile',
      action: () => navigate('/app/settings/profile'),
      icon: Building,
    },
    {
      id: 'step_customers',
      title: 'Add your customer contacts',
      desc: `${customers.length} contacts currently loaded in your database`,
      completed: isCustomersAdded,
      actionLabel: 'Import or Add Contacts',
      action: () => navigate('/app/customers'),
      icon: Users,
    },
    {
      id: 'step_whatsapp',
      title: 'Connect WhatsApp (Own Number recommended)',
      desc: isWhatsAppConnected
        ? `Connected to ${tenant.whatsAppNumber} (Meta Cloud API)`
        : 'Connect your Meta WhatsApp Business number for automated delivery',
      completed: isWhatsAppConnected,
      actionLabel: isWhatsAppConnected ? 'Configure' : 'Connect Now',
      action: () => navigate('/app/settings/whatsapp'),
      icon: MessageCircle,
      highlight: !isWhatsAppConnected,
    },
    {
      id: 'step_tone',
      title: 'Choose your default tone & language',
      desc: 'Configured for Warm & Heartfelt (English, Marathi & Hindi)',
      completed: isToneConfigured,
      actionLabel: 'Adjust Tone',
      action: () => navigate('/app/settings/sending'),
      icon: Sliders,
    },
    {
      id: 'step_wish',
      title: 'Preview & send your first wish',
      desc: 'Check today’s upcoming birthdays on your dashboard',
      completed: false,
      actionLabel: "Review Today's Wishes",
      action: () => navigate('/app/review-send'),
      icon: Sparkles,
      primary: true,
    },
  ];

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div id="onboarding-checklist-screen" className="max-w-3xl mx-auto p-4 sm:p-8 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome aboard, Dr. Rajesh!</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Let's get WishFlow ready for {tenant.profile.businessName}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
            Complete this 3-minute setup checklist so WishFlow can automate your birthday outreach on WhatsApp without manual effort.
          </p>

          {/* Progress Bar */}
          <div className="pt-2 space-y-1.5 max-w-md">
            <div className="flex justify-between text-xs font-semibold">
              <span>Setup Progress</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full bg-emerald-950/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6 divide-y divide-stone-100">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0 ${
                item.highlight ? 'bg-emerald-50/40 p-3 rounded-2xl' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="pt-0.5 shrink-0">
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.highlight && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>

              <div className="shrink-0 pl-8 sm:pl-0">
                <button
                  onClick={item.action}
                  className={`min-h-[44px] px-4 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
                    item.primary
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Jump to Dashboard */}
      <div className="text-center pt-2">
        <button
          onClick={() => navigate('/app/dashboard')}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline"
        >
          Skip checklist & go straight to Dashboard →
        </button>
      </div>
    </div>
  );
};
