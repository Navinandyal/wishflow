import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, SendMode } from '../../types';
import { WhatsAppBubble } from '../common/WhatsAppBubble';
import { ConsentBadge, MessageStatusBadge } from '../common/StatusBadge';
import {
  Sparkles,
  Send,
  Cake,
  Calendar,
  CheckCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Eye,
  SkipForward,
  UserCheck,
  ChevronRight,
  AlertCircle,
  Plus,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    user,
    tenant,
    customers,
    messages,
    navigate,
    setActiveCustomerForDrawer,
    setActiveWishTargetCustomer,
    setIsReviewSendAllOpen,
    sendMessage,
    showToast,
  } = useApp();

  const [previewCustomer, setPreviewCustomer] = useState<Customer | null>(null);

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Filter customers by time frames
  const activeCustomers = customers.filter((c) => !c.archived);

  const todayBirthdays = activeCustomers.filter(
    (c) => c.birthdayDay === currentDay && c.birthdayMonth === currentMonth
  );

  // Tomorrow calculation
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowDay = tomorrowDate.getDate();
  const tomorrowMonth = tomorrowDate.getMonth() + 1;

  const tomorrowBirthdays = activeCustomers.filter(
    (c) => c.birthdayDay === tomorrowDay && c.birthdayMonth === tomorrowMonth
  );

  // Next 7 days (excluding today and tomorrow)
  const next7Birthdays = activeCustomers.filter((c) => {
    for (let offset = 2; offset <= 7; offset++) {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      if (c.birthdayDay === d.getDate() && c.birthdayMonth === d.getMonth() + 1) {
        return true;
      }
    }
    return false;
  });

  // Next upcoming single birthday (if today is empty)
  const upcomingAny = activeCustomers
    .filter((c) => !(c.birthdayDay === currentDay && c.birthdayMonth === currentMonth))
    .sort((a, b) => {
      const diffA = (a.birthdayMonth - currentMonth) * 31 + (a.birthdayDay - currentDay);
      const diffB = (b.birthdayMonth - currentMonth) * 31 + (b.birthdayDay - currentDay);
      return (diffA < 0 ? diffA + 372 : diffA) - (diffB < 0 ? diffB + 372 : diffB);
    })[0];

  // Delivery rate stats
  const totalSent = messages.filter((m) => m.status !== 'queued').length;
  const totalDeliveredOrRead = messages.filter(
    (m) => m.status === 'delivered' || m.status === 'read'
  ).length;
  const deliveryRate = totalSent > 0 ? Math.round((totalDeliveredOrRead / totalSent) * 100) : 98;

  const handleQuickSend = (cust: Customer) => {
    const wish = `Dear ${cust.name}, wishing you a wonderfully healthy and joyful Birthday from Dr. Rajesh Kulkarni and the entire family at ${tenant.profile.businessName}! 🎂✨ May your day be filled with radiant smiles.`;
    sendMessage(cust.id, wish, tenant.whatsAppStatus === 'connected' ? 'OWN_NUMBER' : 'ASSISTED', 'Warm & Heartfelt', cust.preferredLanguage);
  };

  const handleOpenGenerator = (cust: Customer) => {
    setActiveWishTargetCustomer(cust);
    navigate('/app/wishes');
  };

  return (
    <div id="app-dashboard-container" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Primary CTA Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Good morning, {user?.name.split(' ')[0] || 'Doctor'}
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
              {tenant.profile.businessName}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Here is your daily birthday briefing for {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          id="dashboard-review-send-all-btn"
          onClick={() => setIsReviewSendAllOpen(true)}
          className="min-h-[48px] px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2.5 transition-all group"
        >
          <Send className="w-4 h-4 text-emerald-100 group-hover:translate-x-0.5 transition-transform" />
          <span>Review and send today's wishes</span>
          <span className="bg-emerald-800/80 text-emerald-100 text-xs px-2 py-0.5 rounded-full font-bold">
            {todayBirthdays.length}
          </span>
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Today's Birthdays</span>
            <Cake className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900">{todayBirthdays.length}</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">Ready for greeting</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Tomorrow</span>
            <Calendar className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900">{tomorrowBirthdays.length}</div>
          <div className="text-[11px] text-stone-500 mt-1">AI wishes generated</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Next 7 Days</span>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900">{next7Birthdays.length}</div>
          <div className="text-[11px] text-stone-500 mt-1">Scheduled queue</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Messages Sent</span>
            <CheckCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900">{totalSent}</div>
          <div className="text-[11px] text-stone-500 mt-1">Lifetime WhatsApp</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Delivery Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">{deliveryRate}%</div>
          <div className="text-[11px] text-stone-500 mt-1">Meta Tier 10K quality</div>
        </div>
      </div>

      {/* 3. Section: TODAY'S BIRTHDAYS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Today's Birthdays
            </h2>
            <span className="text-xs font-bold text-stone-500">({todayBirthdays.length})</span>
          </div>

          <button
            onClick={() => navigate('/app/birthdays')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View Calendar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayBirthdays.length === 0 ? (
          /* Empty state that is NOT blank: shows next upcoming customer birthday */
          <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 text-stone-400 flex items-center justify-center mx-auto">
              <Cake className="w-6 h-6 text-stone-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">No birthdays today!</h3>
              {upcomingAny ? (
                <p className="text-xs text-stone-600 mt-1">
                  Your next upcoming birthday is{' '}
                  <span className="font-bold text-stone-900">{upcomingAny.name}</span> on{' '}
                  <span className="font-semibold text-emerald-700">
                    {upcomingAny.birthdayDay}/{upcomingAny.birthdayMonth}
                  </span>
                  .
                </p>
              ) : (
                <p className="text-xs text-stone-500 mt-1">
                  Start by adding or importing your customers to track their birthdays.
                </p>
              )}
            </div>
            <div className="pt-1 flex items-center justify-center gap-3">
              <button
                onClick={() => navigate('/app/customers')}
                className="min-h-[44px] px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
              >
                Manage Customers
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayBirthdays.map((cust) => {
              const age = cust.birthdayYear ? currentYear - cust.birthdayYear : null;
              const alreadyWished = cust.lastWishedYear === currentYear;

              return (
                <div
                  key={cust.id}
                  id={`dashboard-card-today-${cust.id}`}
                  className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top: Customer Info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200">
                          {cust.name.slice(0, 2)}
                        </div>
                        <div>
                          <div
                            onClick={() => setActiveCustomerForDrawer(cust)}
                            className="text-sm font-bold text-stone-900 hover:text-emerald-700 cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{cust.name}</span>
                            {age && (
                              <span className="text-[11px] font-normal text-stone-400">
                                ({age} yrs)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                            <span>{cust.relationship}</span>
                            <span>•</span>
                            <span>{cust.preferredLanguage}</span>
                          </div>
                        </div>
                      </div>

                      <ConsentBadge status={cust.consent.status} />
                    </div>

                    {/* Tags */}
                    {cust.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {cust.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Pre-generated wish preview */}
                    <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed italic relative group">
                      "{cust.preferredLanguage === 'Marathi'
                        ? `प्रिय ${cust.name}, आपणास वाढदिवसाच्या मनःपूर्वक हार्दिक शुभेच्छा! उत्तम आरोग्य आणि सुख-समृद्धी लाभो...`
                        : `Dear ${cust.name}, wishing you a wonderfully healthy and joyful Birthday from Dr. Rajesh Kulkarni and Sunrise Dental Care! 🎂✨`}"
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    {alreadyWished ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                        <CheckCheck className="w-4 h-4 text-emerald-600" />
                        <span>Wish Sent for {currentYear}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleQuickSend(cust)}
                        disabled={cust.consent.status !== 'ACTIVE'}
                        className={`flex-1 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                          cust.consent.status === 'ACTIVE'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Now</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenGenerator(cust)}
                      className="min-h-[44px] px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                      title="Open AI Wish Generator to customize"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>AI Generator</span>
                    </button>

                    <button
                      onClick={() => setActiveCustomerForDrawer(cust)}
                      className="min-h-[44px] p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl"
                      title="View Customer Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Section: TOMORROW'S BIRTHDAYS */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800">
              Tomorrow's Birthdays
            </h2>
            <span className="text-xs font-bold text-stone-400">({tomorrowBirthdays.length})</span>
          </div>
        </div>

        {tomorrowBirthdays.length === 0 ? (
          <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs text-stone-500">
            No birthdays scheduled for tomorrow.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tomorrowBirthdays.map((cust) => (
              <div
                key={cust.id}
                className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 font-semibold flex items-center justify-center text-xs">
                    {cust.name.slice(0, 2)}
                  </div>
                  <div>
                    <div
                      onClick={() => setActiveCustomerForDrawer(cust)}
                      className="text-xs font-bold text-stone-900 hover:text-emerald-700 cursor-pointer"
                    >
                      {cust.name}
                    </div>
                    <div className="text-[10px] text-stone-500">{cust.relationship} • {cust.city}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenGenerator(cust)}
                  className="min-h-[40px] px-3 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Draft Wish</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Section: NEXT 7 DAYS */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800">
              Next 7 Days Radar
            </h2>
            <span className="text-xs font-bold text-stone-400">({next7Birthdays.length})</span>
          </div>
          <button
            onClick={() => navigate('/app/birthdays')}
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            View 30-day forecast →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {next7Birthdays.map((cust) => (
            <div
              key={cust.id}
              onClick={() => setActiveCustomerForDrawer(cust)}
              className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-emerald-300 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">{cust.name}</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {cust.birthdayDay}/{cust.birthdayMonth}
                </span>
              </div>
              <div className="text-[10px] text-stone-500 mt-1 flex items-center justify-between">
                <span>{cust.relationship}</span>
                <span>{cust.preferredLanguage}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
