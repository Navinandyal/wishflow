import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SCGTMember } from '../../types';
import { SCGTStatusBadge } from '../common/StatusBadge';
import { WhatsAppBubble } from '../common/WhatsAppBubble';
import {
  Award,
  CheckCircle2,
  Users,
  Search,
  Calendar,
  Sparkles,
  Send,
  Building,
  ShieldCheck,
  Filter,
  Check,
  ArrowRight,
} from 'lucide-react';

export const SCGTPage: React.FC = () => {
  const {
    tenant,
    scgtMembers,
    verifySCGTMembership,
    sendMessage,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('ALL');
  const [memberIdInput, setMemberIdInput] = useState('SCGT-PUN-0891');
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeWishMember, setActiveWishMember] = useState<SCGTMember | null>(null);
  const [networkingWishText, setNetworkingWishText] = useState('');

  const chapters = [
    'Pune Champions Chapter',
    'Pune East Titans',
    'Pune Central Leaders',
    'Mumbai Gateway Achievers',
    'PCMC Innovators Chapter',
  ];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberIdInput.trim()) return;
    setIsVerifying(true);
    setTimeout(() => {
      verifySCGTMembership(memberIdInput.trim(), 'Pune Champions Chapter');
      setIsVerifying(false);
    }, 450);
  };

  const handleOpenNetworkingWish = (m: SCGTMember) => {
    setActiveWishMember(m);
    setNetworkingWishText(
      `Respected ${m.name} Ji, wishing you a splendid and prosperous Birthday! 🎉 It is an honor to collaborate with you at ${m.chapter}. Wishing your business ${m.businessName} immense expansion and breakthrough referrals this coming year! — Warm regards, Dr. Rajesh Kulkarni (${tenant.profile.businessName}).`
    );
  };

  const handleSendNetworkingWish = () => {
    if (!activeWishMember) return;
    sendMessage(
      activeWishMember.id,
      networkingWishText,
      tenant.whatsAppStatus === 'connected' ? 'OWN_NUMBER' : 'ASSISTED',
      'Networking / SCGT Chapter',
      'English'
    );
    showToast(`Dispatched networking wish to ${activeWishMember.name}!`, 'success');
    setActiveWishMember(null);
  };

  const filteredMembers = scgtMembers.filter((m) => {
    if (selectedChapter !== 'ALL' && m.chapter !== selectedChapter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.businessName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;

  const todayChapterBirthdays = scgtMembers.filter(
    (m) => m.birthdayDay === currentDay && m.birthdayMonth === currentMonth
  );

  return (
    <div id="scgt-networking-page" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>SCGT Professional Networking Alliance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              SCGT Chapter Member Directory & Birthday Radar
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              Strengthen business ties, express mutual appreciation, and drive high-trust referral exchanges across verified SCGT networking chapters.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-xs space-y-2 w-full md:w-72">
            <div className="flex items-center justify-between">
              <span className="text-stone-300">Membership Status:</span>
              <SCGTStatusBadge status={tenant.scgtStatus} />
            </div>
            {tenant.scgtStatus === 'VERIFIED' ? (
              <div className="space-y-1 pt-1 border-t border-white/10">
                <div className="font-bold text-white">{tenant.scgtChapter}</div>
                <div className="text-[11px] text-emerald-300 font-mono">
                  ID: {tenant.scgtMemberId}
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-stone-300">
                Verify your membership to unlock full member directory and radar.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Card (if not yet verified) */}
      {tenant.scgtStatus !== 'VERIFIED' && (
        <div className="p-6 rounded-3xl bg-white border border-indigo-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Verify your SCGT Chapter Membership
              </h3>
              <p className="text-xs text-stone-500">
                Enter your SCGT membership number or mobile to auto-match with your regional roster.
              </p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={memberIdInput}
              onChange={(e) => setMemberIdInput(e.target.value)}
              placeholder="e.g. SCGT-PUN-0891"
              className="flex-1 min-h-[44px] px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 font-mono uppercase"
            />
            <button
              type="submit"
              disabled={isVerifying}
              className="min-h-[44px] px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
            >
              {isVerifying ? 'Verifying Chapter Roster...' : 'Verify Membership'}
            </button>
          </form>
        </div>
      )}

      {/* Today's SCGT Chapter Birthdays */}
      {todayChapterBirthdays.length > 0 && (
        <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-bold text-indigo-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>SCGT Chapter Peers Celebrating Today</span>
              <span className="bg-indigo-200 text-indigo-950 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {todayChapterBirthdays.length}
              </span>
            </h2>
            <span className="text-[11px] text-indigo-700">
              High-value networking opportunity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todayChapterBirthdays.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-2xs flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-xs text-stone-900">{m.name}</div>
                  <div className="text-[11px] text-stone-500">
                    {m.businessName} • {m.category}
                  </div>
                  <div className="text-[10px] font-semibold text-indigo-700 mt-0.5">
                    {m.chapter}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenNetworkingWish(m)}
                  className="min-h-[40px] px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Send Peer Wish</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member Directory Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by member name, business or industry category..."
            className="w-full min-h-[40px] pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="min-h-[40px] px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold"
        >
          <option value="ALL">All SCGT Chapters</option>
          {chapters.map((ch) => (
            <option key={ch} value={ch}>
              {ch}
            </option>
          ))}
        </select>
      </div>

      {/* Member Directory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((m) => {
          const isToday = m.birthdayDay === currentDay && m.birthdayMonth === currentMonth;

          return (
            <div
              key={m.id}
              className={`p-5 rounded-3xl bg-white border flex flex-col justify-between transition-all ${
                isToday
                  ? 'border-indigo-400 shadow-md ring-1 ring-indigo-400/20'
                  : 'border-stone-200 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-900 font-bold flex items-center justify-center text-xs border border-indigo-200">
                      {m.name.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-stone-900">{m.name}</h3>
                      <p className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Building className="w-3 h-3 text-stone-400" />
                        <span>{m.businessName}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">
                    {m.category}
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-1">
                  <div className="flex justify-between text-stone-600">
                    <span>Chapter:</span>
                    <span className="font-semibold text-stone-900">{m.chapter}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Birthday:</span>
                    <span className="font-bold text-indigo-700">
                      {m.birthdayDay}/{m.birthdayMonth}
                      {isToday && ' (TODAY! 🎂)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Mobile:</span>
                    <span className="font-mono text-stone-800">{m.mobile}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenNetworkingWish(m)}
                  className="w-full min-h-[40px] px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Draft Networking Wish</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Networking Wish Modal */}
      {activeWishMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-stone-900">
              Personalized SCGT Networking Greeting
            </h3>
            <p className="text-stone-500">
              Tailored for peer collaboration, chapter milestones, and referral appreciation.
            </p>

            <WhatsAppBubble
              message={networkingWishText}
              recipientName={activeWishMember.name}
              businessName={tenant.profile.businessName}
              status="delivered"
              time="08:30 AM"
            />

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Edit Message</label>
              <textarea
                rows={4}
                value={networkingWishText}
                onChange={(e) => setNetworkingWishText(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveWishMember(null)}
                className="min-h-[40px] px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendNetworkingWish}
                className="min-h-[40px] px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to {activeWishMember.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
