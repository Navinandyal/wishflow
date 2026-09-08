import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SendMode } from '../../types';
import { PLANS } from '../../data/initialData';
import {
  Settings,
  MessageCircle,
  Clock,
  Building,
  Users,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Download,
  Plus,
  Trash2,
  Lock,
} from 'lucide-react';

interface SettingsPageProps {
  initialTab?: 'whatsapp' | 'sending' | 'profile' | 'team' | 'billing' | 'privacy';
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  initialTab = 'whatsapp',
}) => {
  const {
    tenant,
    connectWhatsApp,
    disconnectWhatsApp,
    updateBranding,
    updateSendingSchedule,
    upgradePlan,
    currentRole,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'whatsapp' | 'sending' | 'profile' | 'team' | 'billing' | 'privacy'
  >(initialTab);

  // WhatsApp connection form simulation
  const [phoneNumberInput, setPhoneNumberInput] = useState('+91 98220 14589');
  const [wabaIdInput, setWabaIdInput] = useState('waba_9928172901');
  const [phoneIdInput, setPhoneIdInput] = useState('phone_id_881920391');
  const [testMobileInput, setTestMobileInput] = useState('+91 98220 14589');
  const [isTestingWhatsApp, setIsTestingWhatsApp] = useState(false);

  // Sending settings form
  const [sendMode, setSendMode] = useState<SendMode>(tenant.sendMode);
  const [scheduledTime, setScheduledTime] = useState(tenant.scheduledTime);
  const [defaultLanguage, setDefaultLanguage] = useState(tenant.defaultLanguage);
  const [defaultTone, setDefaultTone] = useState(tenant.defaultTone);

  // Business profile form
  const [bizName, setBizName] = useState(tenant.profile.businessName);
  const [industry, setIndustry] = useState(tenant.profile.industry);
  const [city, setCity] = useState(tenant.profile.city);
  const [state, setState] = useState(tenant.profile.state);
  const [address, setAddress] = useState(tenant.profile.address);
  const [signOff, setSignOff] = useState(tenant.profile.signatureSignOff);

  // Team invite state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'manager' | 'staff'>('staff');
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Dr. Rajesh Kulkarni', email: 'dr.rajesh@sunrisedental.in', role: 'owner' },
    { id: '2', name: 'Snehal Deshpande', email: 'snehal.reception@sunrisedental.in', role: 'manager' },
    { id: '3', name: 'Amit Shinde', email: 'amit.staff@sunrisedental.in', role: 'staff' },
  ]);

  const handleSaveSending = (e: React.FormEvent) => {
    e.preventDefault();
    updateSendingSchedule(sendMode, scheduledTime);
    showToast('Sending schedule & automation rules updated.', 'success');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding({
      businessName: bizName,
      industry,
      city,
      state,
      address,
      signatureSignOff: signOff,
    });
    showToast('Business profile and WhatsApp signature updated.', 'success');
  };

  const handleConnectWhatsApp = () => {
    connectWhatsApp(phoneNumberInput, wabaIdInput, phoneIdInput);
  };

  const handleSendTestWhatsApp = () => {
    setIsTestingWhatsApp(true);
    setTimeout(() => {
      setIsTestingWhatsApp(false);
      showToast(`Test WhatsApp message delivered to ${testMobileInput}!`, 'success');
    }, 600);
  };

  const handleInviteTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setTeamMembers([
      ...teamMembers,
      {
        id: Date.now().toString(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail.trim(),
        role: inviteRole,
      },
    ]);
    setInviteEmail('');
    showToast(`Invitation sent to ${inviteEmail}.`, 'success');
  };

  const isOwner = currentRole === 'owner';

  return (
    <div id="app-settings-page" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-600" />
          <span>Organization Settings</span>
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Configure WhatsApp Cloud API, automated sending rules, branding, and team roles.
        </p>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-white rounded-3xl border border-stone-200 shadow-2xs p-2 space-y-1 shrink-0">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Connection</span>
          </button>

          <button
            onClick={() => setActiveTab('sending')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
              activeTab === 'sending'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Sending & Autopilot</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Business Branding</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
              activeTab === 'team'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team & Access Control</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
              activeTab === 'billing'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Plan & Billing</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all text-left ${
              activeTab === 'privacy'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>DPDP Consent & Privacy</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
          {/* TAB 1: WHATSAPP CONNECTION */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-stone-900">
                    Official WhatsApp Meta Cloud API
                  </h2>
                  <p className="text-stone-500 mt-0.5">
                    Connect your own WhatsApp Business number for verified brand recognition and high delivery rates.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      tenant.whatsAppStatus === 'connected'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tenant.whatsAppStatus === 'connected' ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}
                    />
                    <span>{tenant.whatsAppStatus === 'connected' ? 'Active & Verified' : 'Assisted Gateway'}</span>
                  </span>
                </div>
              </div>

              {tenant.whatsAppStatus === 'connected' ? (
                /* Connected State View */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                      <div className="text-stone-500 font-semibold">Verified Sender Phone</div>
                      <div className="font-bold text-stone-900 font-mono text-xs sm:text-sm">
                        {tenant.whatsAppNumber}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold">Meta Verified ✓</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                      <div className="text-stone-500 font-semibold">Meta Quality Rating</div>
                      <div className="font-bold text-emerald-700 text-xs sm:text-sm">
                        GREEN (Tier 10,000 / day)
                      </div>
                      <div className="text-[10px] text-stone-400">Zero spam flags</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                      <div className="text-stone-500 font-semibold">Webhook Status</div>
                      <div className="font-bold text-stone-900 text-xs sm:text-sm">
                        ONLINE (v21.0)
                      </div>
                      <div className="text-[10px] text-emerald-700">Real-time read receipts</div>
                    </div>
                  </div>

                  {/* Send Test Message */}
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                    <h3 className="font-bold text-emerald-950 text-xs">Send Test WhatsApp Wish</h3>
                    <p className="text-[11px] text-emerald-800">
                      Verify your connection by sending an immediate test wish to your own mobile.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={testMobileInput}
                        onChange={(e) => setTestMobileInput(e.target.value)}
                        className="flex-1 min-h-[40px] px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-mono"
                      />
                      <button
                        onClick={handleSendTestWhatsApp}
                        disabled={isTestingWhatsApp}
                        className="min-h-[40px] px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        {isTestingWhatsApp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        <span>Send Test</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={disconnectWhatsApp}
                      className="min-h-[40px] px-4 py-2 text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl font-semibold transition-colors"
                    >
                      Disconnect WhatsApp Account
                    </button>
                  </div>
                </div>
              ) : (
                /* Unconnected / Connect Simulator View */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <h3 className="font-bold text-stone-900">Meta Embedded Signup Simulator</h3>
                    <p className="text-stone-600 leading-relaxed">
                      Connect your WhatsApp Business Account using Meta Cloud API credentials or our 1-click onboarder.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          Phone Number to Connect *
                        </label>
                        <input
                          type="tel"
                          value={phoneNumberInput}
                          onChange={(e) => setPhoneNumberInput(e.target.value)}
                          className="w-full min-h-[40px] px-3 py-1.5 bg-white border border-stone-300 rounded-xl font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-stone-700 mb-1">
                            WABA ID
                          </label>
                          <input
                            type="text"
                            value={wabaIdInput}
                            onChange={(e) => setWabaIdInput(e.target.value)}
                            className="w-full min-h-[40px] px-3 py-1.5 bg-white border border-stone-300 rounded-xl font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-stone-700 mb-1">
                            Phone Number ID
                          </label>
                          <input
                            type="text"
                            value={phoneIdInput}
                            onChange={(e) => setPhoneIdInput(e.target.value)}
                            className="w-full min-h-[40px] px-3 py-1.5 bg-white border border-stone-300 rounded-xl font-mono"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleConnectWhatsApp}
                        className="w-full min-h-[44px] py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Connect & Verify Number via Meta API</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SENDING SETTINGS & AUTOPILOT */}
          {activeTab === 'sending' && (
            <form onSubmit={handleSaveSending} className="space-y-5 text-xs">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-stone-900">
                  Sending Schedule & Automation Modes
                </h2>
                <p className="text-stone-500 mt-0.5">
                  Decide whether birthday wishes should dispatch automatically or await your 1-click morning review.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-2">Sending Mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSendMode('MANUAL_REVIEW')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      sendMode === 'MANUAL_REVIEW'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">1-Click Morning Review (Recommended)</span>
                      {sendMode === 'MANUAL_REVIEW' && <span className="text-emerald-700">✓</span>}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Wishes are pre-crafted by Gemini every morning at 07:00 AM. You review them in 10 seconds and hit "Send All".
                    </p>
                  </div>

                  <div
                    onClick={() => setSendMode('AUTOPILOT')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      sendMode === 'AUTOPILOT'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Full Autopilot (Zero Friction)</span>
                      {sendMode === 'AUTOPILOT' && <span className="text-emerald-700">✓</span>}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      AI crafts and dispatches wishes automatically at your designated time without requiring manual confirmation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Daily Dispatch Time (IST)
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Optimal morning greeting window: 08:00 AM - 09:30 AM IST.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Default Fallback Language
                  </label>
                  <select
                    value={defaultLanguage}
                    onChange={(e) => setDefaultLanguage(e.target.value as any)}
                    className="w-full min-h-[44px] px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="English">English</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Sending Schedule
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: BUSINESS PROFILE & BRANDING */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-stone-900">
                  Business & Clinic Identity
                </h2>
                <p className="text-stone-500 mt-0.5">
                  These details customize the sign-off and AI context for your customer wishes.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Business / Practice Name *
                </label>
                <input
                  type="text"
                  required
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  WhatsApp Message Sign-off
                </label>
                <input
                  type="text"
                  value={signOff}
                  onChange={(e) => setSignOff(e.target.value)}
                  placeholder="e.g. — Dr. Rajesh Kulkarni & Sunrise Dental Team"
                  className="w-full min-h-[44px] px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Business Profile
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: TEAM & ACCESS */}
          {activeTab === 'team' && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-stone-900">
                  Team Members & Role-Based Access
                </h2>
                <p className="text-stone-500 mt-0.5">
                  Delegate daily review to reception staff while restricting export and billing permissions.
                </p>
              </div>

              {/* Invite Form */}
              <form onSubmit={handleInviteTeam} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@sunrisedental.in"
                  className="flex-1 min-h-[44px] px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="min-h-[44px] px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                >
                  <option value="manager">Manager</option>
                  <option value="staff">Staff / Assistant</option>
                </select>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Invite
                </button>
              </form>

              {/* Team Table */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-[10px] font-bold text-stone-500 uppercase border-b border-stone-200">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Role</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {teamMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-stone-50">
                        <td className="p-3">
                          <div className="font-bold text-stone-900">{m.name}</div>
                          <div className="text-[11px] text-stone-500">{m.email}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              m.role === 'owner'
                                ? 'bg-amber-100 text-amber-800'
                                : m.role === 'manager'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {m.role}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {m.role !== 'owner' && (
                            <button
                              onClick={() => {
                                setTeamMembers(teamMembers.filter((u) => u.id !== m.id));
                                showToast(`Removed ${m.name} from team.`, 'info');
                              }}
                              className="text-stone-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BILLING & SUBSCRIPTION */}
          {activeTab === 'billing' && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-stone-900">
                  Subscription Plan & Razorpay Invoicing
                </h2>
                <p className="text-stone-500 mt-0.5">
                  Manage your subscription tier, billing cycle, and GST invoices with 18% Input Tax Credit.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                    Current Active Tier
                  </span>
                  <h3 className="text-lg font-extrabold text-stone-900 mt-1">
                    Professional Business Plan
                  </h3>
                  <p className="text-stone-600 mt-0.5">
                    ₹1,999/month • Up to 2,000 active contacts • Unlimited AI wishes • Connected to verified clinic number.
                  </p>
                </div>

                <button
                  onClick={() => upgradePlan('business')}
                  className="min-h-[44px] px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs shrink-0"
                >
                  Upgrade to Business
                </button>
              </div>

              {/* Invoices List */}
              <div className="space-y-2">
                <h3 className="font-bold text-stone-900">Recent GST Tax Invoices</h3>
                <div className="border border-stone-200 rounded-2xl divide-y divide-stone-100">
                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-stone-900">INV-2026-00912</div>
                      <div className="text-[11px] text-stone-500">1 Sep 2026 • ₹2,358.82 (incl. 18% GST)</div>
                    </div>
                    <button
                      onClick={() => alert('Downloading GST invoice PDF')}
                      className="text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-stone-900">INV-2026-00834</div>
                      <div className="text-[11px] text-stone-500">1 Aug 2026 • ₹2,358.82 (incl. 18% GST)</div>
                    </div>
                    <button
                      onClick={() => alert('Downloading GST invoice PDF')}
                      className="text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DPDP CONSENT & PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-stone-900">
                  Data Protection & DPDP Compliance
                </h2>
                <p className="text-stone-500 mt-0.5">
                  Tools to uphold user consent provenance and ensure full compliance with Indian privacy laws.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <h3 className="font-bold text-stone-900">Standard Opt-In Legal Disclaimer</h3>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  "By registering with {tenant.profile.businessName}, you agree to receive personalized annual birthday greetings and healthcare reminders on WhatsApp. You may reply STOP or withdraw consent at any time without affecting services."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <h3 className="font-bold text-stone-900">Data Subject Rights (DSR)</h3>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  If a client requests complete deletion or erasure of their contact records under the DPDP Act, use the Delete button in their Customer Profile to permanently wipe all logs.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
