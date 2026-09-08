import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { ConsentBadge, MessageStatusBadge } from '../common/StatusBadge';
import { WhatsAppBubble } from '../common/WhatsAppBubble';
import {
  X,
  Phone,
  Calendar,
  Sparkles,
  Send,
  Edit2,
  Archive,
  Trash2,
  Clock,
  ShieldCheck,
  Tag,
  MapPin,
  Briefcase,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface CustomerDrawerProps {
  onEdit: (c: Customer) => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({ onEdit }) => {
  const {
    activeCustomerForDrawer,
    setActiveCustomerForDrawer,
    messages,
    updateConsent,
    archiveCustomer,
    deleteCustomer,
    setActiveWishTargetCustomer,
    sendMessage,
    tenant,
    navigate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'wishes' | 'consent' | 'notes'>('profile');
  const [internalNote, setInternalNote] = useState('');

  if (!activeCustomerForDrawer) return null;
  const c = activeCustomerForDrawer;

  // Filter messages for this customer
  const customerMessages = messages.filter((m) => m.customerId === c.id);

  const handleWithdrawConsent = () => {
    if (confirm('Withdraw WhatsApp messaging consent for this contact?')) {
      updateConsent(c.id, 'WITHDRAWN', 'Opt-out requested via customer profile');
    }
  };

  const handleGrantConsent = () => {
    updateConsent(c.id, 'ACTIVE', 'Re-opted in via business operator');
  };

  const handleGenerateWish = () => {
    setActiveWishTargetCustomer(c);
    setActiveCustomerForDrawer(null);
    navigate('/app/wishes');
  };

  const handleQuickSend = () => {
    const wish = `Dear ${c.name}, wishing you a wonderfully healthy and joyful Birthday from Dr. Rajesh Kulkarni and the team at ${tenant.profile.businessName}! 🎂✨`;
    sendMessage(c.id, wish, tenant.whatsAppStatus === 'connected' ? 'OWN_NUMBER' : 'ASSISTED', 'Warm & Heartfelt', c.preferredLanguage);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div
        id="customer-detail-drawer"
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200">
              {c.name.slice(0, 2)}
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">{c.name}</h2>
              <p className="text-xs text-stone-500">
                {c.relationship} • {c.preferredLanguage}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setActiveCustomerForDrawer(null);
                onEdit(c);
              }}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              title="Edit Customer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveCustomerForDrawer(null)}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="px-5 py-3 bg-white border-b border-stone-100 flex items-center gap-2">
          <button
            onClick={handleGenerateWish}
            className="flex-1 min-h-[40px] px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate AI Wish</span>
          </button>

          <button
            onClick={handleQuickSend}
            disabled={c.consent.status !== 'ACTIVE'}
            className="min-h-[40px] px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-stone-600" />
            <span>Send Default Wish</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 px-5 text-xs font-semibold text-stone-500 bg-stone-50/50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent hover:text-stone-800'
            }`}
          >
            Profile & Details
          </button>
          <button
            onClick={() => setActiveTab('wishes')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'wishes'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent hover:text-stone-800'
            }`}
          >
            <span>Message Log</span>
            <span className="bg-stone-200 text-stone-700 text-[10px] px-1.5 py-0.2 rounded-full">
              {customerMessages.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('consent')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'consent'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent hover:text-stone-800'
            }`}
          >
            Consent & Legal
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-emerald-600 text-emerald-800 font-bold'
                : 'border-transparent hover:text-stone-800'
            }`}
          >
            Notes
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'profile' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] text-stone-500 flex items-center gap-1 mb-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp Mobile</span>
                  </div>
                  <div className="font-bold text-stone-900 font-mono text-xs">{c.mobile}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="text-[11px] text-stone-500 flex items-center gap-1 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Annual Birthday</span>
                  </div>
                  <div className="font-bold text-emerald-800 text-xs">
                    {c.birthdayDay} / {c.birthdayMonth}
                    {c.birthdayYear ? ` (${c.birthdayYear})` : ''}
                  </div>
                </div>
              </div>

              {/* Additional Attributes */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                  Contact Attributes
                </h4>

                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Location:</span>
                  <span className="font-medium text-stone-900">
                    {c.city}, {c.state}
                  </span>
                </div>

                {c.occupation && (
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Occupation:</span>
                    <span className="font-medium text-stone-900">{c.occupation}</span>
                  </div>
                )}

                {c.company && (
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Company:</span>
                    <span className="font-medium text-stone-900">{c.company}</span>
                  </div>
                )}

                {c.anniversaryDate && (
                  <div className="flex justify-between py-1 border-b border-stone-100">
                    <span className="text-stone-500">Anniversary:</span>
                    <span className="font-medium text-stone-900">{c.anniversaryDate}</span>
                  </div>
                )}

                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Source:</span>
                  <span className="font-medium text-stone-900">{c.source}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Created At:</span>
                  <span className="font-medium text-stone-900">
                    {new Date(c.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4">
                <h4 className="text-xs font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-stone-400" />
                  <span>Assigned Tags</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-stone-100 text-stone-700 font-semibold rounded-lg text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wishes' && (
            <div className="space-y-4">
              {customerMessages.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl border border-stone-200">
                  No previous WhatsApp birthday messages sent to this contact yet.
                </div>
              ) : (
                customerMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-900">{msg.toneUsed} Tone</span>
                      <MessageStatusBadge status={msg.status} />
                    </div>

                    <WhatsAppBubble
                      message={msg.messageText}
                      recipientName={c.name}
                      businessName={tenant.profile.businessName}
                      status={msg.status}
                      time={new Date(msg.sentAt || msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    />

                    <div className="text-[10px] text-stone-400 flex items-center justify-between pt-1">
                      <span>Language: {msg.language}</span>
                      <span>Dispatched: {new Date(msg.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'consent' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">Current Opt-In Status</span>
                  <ConsentBadge status={c.consent.status} />
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Compliant with Meta WhatsApp Messaging Policies and Digital Personal Data Protection (DPDP) Act.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Provenance / Source:</span>
                  <span className="font-semibold text-stone-900">{c.consent.source}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Channel:</span>
                  <span className="font-semibold text-stone-900">{c.consent.channel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Opt-in Timestamp:</span>
                  <span className="font-semibold text-stone-900">
                    {new Date(c.consent.timestamp).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Evidence Note:</span>
                  <span className="font-semibold text-stone-900">{c.consent.evidenceNote}</span>
                </div>
              </div>

              <div className="pt-2">
                {c.consent.status === 'ACTIVE' ? (
                  <button
                    onClick={handleWithdrawConsent}
                    className="w-full min-h-[44px] py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Withdraw WhatsApp Consent</span>
                  </button>
                ) : (
                  <button
                    onClick={handleGrantConsent}
                    className="w-full min-h-[44px] py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Grant / Restore WhatsApp Consent</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Internal Staff Notes
                </label>
                <textarea
                  rows={4}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Record treatment preferences, family member details, or special gifts..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={() => alert('Note saved to contact record.')}
                className="min-h-[40px] px-4 py-2 bg-stone-900 text-white font-semibold rounded-xl text-xs"
              >
                Save Note
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            onClick={() => archiveCustomer(c.id)}
            className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{c.archived ? 'Unarchive' : 'Archive Contact'}</span>
          </button>

          <button
            onClick={() => {
              if (confirm(`Permanently delete ${c.name}?`)) {
                deleteCustomer(c.id);
                setActiveCustomerForDrawer(null);
              }
            }}
            className="text-xs font-medium text-rose-600 hover:text-rose-800 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
