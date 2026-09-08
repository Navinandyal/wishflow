import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { ConsentBadge } from '../common/StatusBadge';
import {
  Calendar as CalendarIcon,
  Cake,
  List,
  Sparkles,
  Send,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const BirthdaysPage: React.FC = () => {
  const {
    customers,
    tenant,
    setActiveCustomerForDrawer,
    setActiveWishTargetCustomer,
    sendMessage,
    navigate,
    showToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const months = [
    { num: 1, name: 'January' },
    { num: 2, name: 'February' },
    { num: 3, name: 'March' },
    { num: 4, name: 'April' },
    { num: 5, name: 'May' },
    { num: 6, name: 'June' },
    { num: 7, name: 'July' },
    { num: 8, name: 'August' },
    { num: 9, name: 'September' },
    { num: 10, name: 'October' },
    { num: 11, name: 'November' },
    { num: 12, name: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1;

  // Active customers
  const activeCustomers = customers.filter((c) => !c.archived);

  // Missed birthdays (e.g. past 7 days in current month with no lastWishedYear === currentYear)
  const missedBirthdays = activeCustomers.filter((c) => {
    if (c.birthdayMonth === currentMonth && c.birthdayDay < currentDay && c.birthdayDay >= currentDay - 7) {
      return c.lastWishedYear !== currentYear;
    }
    return false;
  });

  const handleSendDelayedWish = (c: Customer) => {
    const isMarathi = c.preferredLanguage === 'Marathi';
    const text = isMarathi
      ? `वाढदिवसाच्या उशिरा का होईना पण मनःपूर्वक हार्दिक शुभेच्छा ${c.name}! 🎉✨ डॉक्टर राजेश आणि Sunrise Dental Care कडून आपले वर्ष सुख आणि आरोग्याने भरलेले जावो हीच सदिच्छा.`
      : `Belated Happy Birthday ${c.name}! 🎂✨ Sending our heartfelt wishes for good health and prosperity from Dr. Rajesh Kulkarni and the entire family at ${tenant.profile.businessName}. Hope you had a splendid celebration!`;

    sendMessage(
      c.id,
      text,
      tenant.whatsAppStatus === 'connected' ? 'OWN_NUMBER' : 'ASSISTED',
      'Warm & Heartfelt',
      c.preferredLanguage
    );
  };

  const handleOpenGenerator = (c: Customer) => {
    setActiveWishTargetCustomer(c);
    navigate('/app/wishes');
  };

  return (
    <div id="birthdays-calendar-page" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <Cake className="w-6 h-6 text-emerald-600" />
            <span>Birthday Calendar & Radar</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Year-round birthday scheduling, monthly forecasting, and missed greeting recovery.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-white border border-stone-200 rounded-2xl shadow-2xs">
          <button
            onClick={() => setViewMode('list')}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'list'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Monthly List</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`min-h-[38px] px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'calendar'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Grid Calendar</span>
          </button>
        </div>
      </div>

      {/* Missed Birthdays Section (if any) */}
      {missedBirthdays.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Missed Birthdays (Past 7 Days)</span>
              <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {missedBirthdays.length} Contacts
              </span>
            </div>
            <span className="text-[11px] text-amber-800">
              Clients appreciate a thoughtful belated wish!
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {missedBirthdays.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-2xs flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-stone-900">{c.name}</div>
                  <div className="text-[11px] text-stone-500">
                    Birthday was: {c.birthdayDay}/{c.birthdayMonth} • {c.relationship}
                  </div>
                </div>

                <button
                  onClick={() => handleSendDelayedWish(c)}
                  className="min-h-[36px] px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[11px] shadow-2xs flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Belated Wish</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month Selector Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {months.map((m) => {
          const isCurrent = m.num === currentMonth;
          const isSelected = m.num === selectedMonth;
          const count = activeCustomers.filter((c) => c.birthdayMonth === m.num).length;

          return (
            <button
              key={m.num}
              onClick={() => setSelectedMonth(m.num)}
              className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{m.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isSelected ? 'bg-emerald-800/80 text-emerald-100' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold text-stone-900">
              {months.find((m) => m.num === selectedMonth)?.name} Birthdays
            </h2>
            <span className="text-xs text-stone-500">
              {activeCustomers.filter((c) => c.birthdayMonth === selectedMonth).length} contacts celebrating
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {activeCustomers
              .filter((c) => c.birthdayMonth === selectedMonth)
              .sort((a, b) => a.birthdayDay - b.birthdayDay)
              .map((c) => {
                const isToday = selectedMonth === currentMonth && c.birthdayDay === currentDay;

                return (
                  <div
                    key={c.id}
                    className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isToday ? 'bg-emerald-50/50 -mx-4 px-4 rounded-2xl' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl font-bold flex flex-col items-center justify-center text-xs border ${
                          isToday
                            ? 'bg-emerald-600 text-white border-emerald-700'
                            : 'bg-stone-50 text-stone-800 border-stone-200'
                        }`}
                      >
                        <span className="text-[9px] uppercase font-semibold leading-none">Day</span>
                        <span className="text-sm font-extrabold">{c.birthdayDay}</span>
                      </div>

                      <div>
                        <div
                          onClick={() => setActiveCustomerForDrawer(c)}
                          className="font-bold text-stone-900 text-xs sm:text-sm hover:text-emerald-700 cursor-pointer"
                        >
                          {c.name}
                          {isToday && (
                            <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              TODAY! 🎂
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {c.relationship} • {c.preferredLanguage} • WhatsApp: {c.mobile}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <ConsentBadge status={c.consent.status} />
                      <button
                        onClick={() => handleOpenGenerator(c)}
                        className="min-h-[38px] px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Craft Wish</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* CALENDAR GRID VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-500 uppercase tracking-wider py-2 border-b border-stone-100">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => {
              const day = i - 2; // simulated offset
              if (day < 1 || day > 31) {
                return (
                  <div
                    key={i}
                    className="min-h-[90px] p-2 bg-stone-50/40 rounded-2xl border border-stone-100 text-stone-300 text-xs"
                  />
                );
              }

              const bdaysThisDay = activeCustomers.filter(
                (c) => c.birthdayMonth === selectedMonth && c.birthdayDay === day
              );
              const isToday = selectedMonth === currentMonth && day === currentDay;

              return (
                <div
                  key={i}
                  className={`min-h-[90px] p-2 rounded-2xl border flex flex-col justify-between transition-colors ${
                    isToday
                      ? 'bg-emerald-50/70 border-emerald-300 font-bold'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={isToday ? 'text-emerald-700 font-extrabold' : 'text-stone-700'}>
                      {day}
                    </span>
                    {bdaysThisDay.length > 0 && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">
                        {bdaysThisDay.length} 🎂
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-12">
                    {bdaysThisDay.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setActiveCustomerForDrawer(c)}
                        className="text-[10px] font-semibold text-stone-800 bg-stone-100 hover:bg-emerald-100 px-1.5 py-0.5 rounded truncate cursor-pointer"
                        title={c.name}
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
