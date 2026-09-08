import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WhatsAppBubble } from '../common/WhatsAppBubble';
import { ConsentBadge } from '../common/StatusBadge';
import {
  X,
  Send,
  Sparkles,
  Edit2,
  SkipForward,
  Clock,
  CheckCircle2,
  RotateCw,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface ReviewSendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewSendModal: React.FC<ReviewSendModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    customers,
    tenant,
    sendMessage,
    showToast,
  } = useApp();

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;

  // Filter today's active customers
  const todayCustomers = customers.filter(
    (c) =>
      !c.archived &&
      c.birthdayDay === currentDay &&
      c.birthdayMonth === currentMonth
  );

  // Initialize draft states for each customer
  const [drafts, setDrafts] = useState<
    Record<
      string,
      {
        text: string;
        isEditing: boolean;
        approved: boolean;
        skipped: boolean;
      }
    >
  >(() => {
    const initial: Record<string, any> = {};
    todayCustomers.forEach((c) => {
      const isMarathi = c.preferredLanguage === 'Marathi';
      const text = isMarathi
        ? `प्रिय ${c.name}, आपणास वाढदिवसाच्या मनःपूर्वक हार्दिक शुभेच्छा! 🎉✨ डॉक्टर राजेश कुलकर्णी आणि Sunrise Dental Care कडून आपले आरोग्य सदैव निरोगी आणि सुखी राहो हीच सदिच्छा.`
        : `Dear ${c.name}, wishing you a wonderfully healthy and joyful Birthday! 🎂✨ Warm regards from Dr. Rajesh Kulkarni and the entire family at ${tenant.profile.businessName}. May your year ahead be blessed with smiles.`;

      initial[c.id] = {
        text,
        isEditing: false,
        approved: true,
        skipped: false,
      };
    });
    return initial;
  });

  const [showConfirmSendAll, setShowConfirmSendAll] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleToggleApprove = (id: string) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], approved: !prev[id].approved, skipped: false },
    }));
  };

  const handleSkip = (id: string) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], skipped: true, approved: false },
    }));
    showToast('Marked customer to skip for today.', 'info');
  };

  const handleRegenerate = (id: string, name: string, lang: string) => {
    const isMarathi = lang === 'Marathi';
    const newText = isMarathi
      ? `वाढदिवसाच्या हार्दिक शुभेच्छा ${name}! 🌟 डॉक्टर राजेश आणि Sunrise Dental Care कडून आरोग्यदायी आणि उज्वल वर्षाच्या मनापासून शुभेच्छा.`
      : `Happy Birthday ${name}! 🌟 Warmest wishes for radiant health and endless happiness today from Dr. Rajesh Kulkarni and the ${tenant.profile.businessName} clinic team! 🎂`;

    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], text: newText },
    }));
    showToast('Regenerated fresh AI variant.', 'info');
  };

  const handleSendSingle = (c: any) => {
    const draft = drafts[c.id];
    sendMessage(
      c.id,
      draft.text,
      tenant.whatsAppStatus === 'connected' ? 'OWN_NUMBER' : 'ASSISTED',
      'Warm & Heartfelt',
      c.preferredLanguage
    );
    // Mark as sent / remove from queue
    setDrafts((prev) => ({
      ...prev,
      [c.id]: { ...prev[c.id], approved: false, skipped: true },
    }));
  };

  const approvedList = todayCustomers.filter(
    (c) => drafts[c.id]?.approved && !drafts[c.id]?.skipped
  );

  const handleSendAllApproved = () => {
    setIsSending(true);
    setTimeout(() => {
      approvedList.forEach((c) => {
        const draft = drafts[c.id];
        sendMessage(
          c.id,
          draft.text,
          tenant.whatsAppStatus === 'connected' ? 'OWN_NUMBER' : 'ASSISTED',
          'Warm & Heartfelt',
          c.preferredLanguage
        );
      });
      setIsSending(false);
      setShowConfirmSendAll(false);
      showToast(`Dispatched ${approvedList.length} WhatsApp birthday wishes!`, 'success');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600" />
              <span>Review and Send Today's Birthday Wishes</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {todayCustomers.length} Scheduled
              </span>
            </h2>
            <p className="text-xs text-stone-500">
              Review, polish or skip wishes before sending through your WhatsApp Business API.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of cards */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {todayCustomers.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-stone-800 text-sm">All caught up!</div>
              <p>There are no more pending birthday wishes scheduled for today.</p>
            </div>
          ) : (
            todayCustomers.map((cust) => {
              const draft = drafts[cust.id] || {
                text: '',
                isEditing: false,
                approved: true,
                skipped: false,
              };

              if (draft.skipped) {
                return (
                  <div
                    key={cust.id}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between opacity-60"
                  >
                    <span className="font-semibold text-stone-600 line-through">
                      {cust.name} ({cust.relationship})
                    </span>
                    <button
                      onClick={() => handleToggleApprove(cust.id)}
                      className="text-xs font-bold text-emerald-700 hover:underline"
                    >
                      Undo Skip
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={cust.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    draft.approved
                      ? 'border-emerald-300 bg-white shadow-sm ring-1 ring-emerald-500/10'
                      : 'border-stone-200 bg-stone-50/60'
                  }`}
                >
                  {/* Customer Snapshot */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                        {cust.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-stone-900">{cust.name}</div>
                        <div className="text-[11px] text-stone-500">
                          {cust.relationship} • {cust.city} • WhatsApp: {cust.mobile}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                        {cust.preferredLanguage}
                      </span>
                      <ConsentBadge status={cust.consent.status} />
                    </div>
                  </div>

                  {/* Message Bubble Preview or Inline Editor */}
                  {draft.isEditing ? (
                    <div className="space-y-2 mb-3">
                      <textarea
                        rows={3}
                        value={draft.text}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [cust.id]: { ...prev[cust.id], text: e.target.value },
                          }))
                        }
                        className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            setDrafts((prev) => ({
                              ...prev,
                              [cust.id]: { ...prev[cust.id], isEditing: false },
                            }))
                          }
                          className="px-3 py-1 bg-stone-900 text-white rounded-lg text-xs font-semibold"
                        >
                          Save Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <WhatsAppBubble
                        message={draft.text}
                        recipientName={cust.name}
                        businessName={tenant.profile.businessName}
                        status="delivered"
                        time="08:30 AM"
                      />
                    </div>
                  )}

                  {/* Action Controls for This Card */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          setDrafts((prev) => ({
                            ...prev,
                            [cust.id]: { ...prev[cust.id], isEditing: !prev[cust.id].isEditing },
                          }))
                        }
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() =>
                          handleRegenerate(cust.id, cust.name, cust.preferredLanguage)
                        }
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg flex items-center gap-1"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Regenerate</span>
                      </button>

                      <button
                        onClick={() => handleSkip(cust.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1"
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                        <span>Skip Today</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleSendSingle(cust)}
                      className="min-h-[38px] px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Now</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Bulk Send Approved */}
        {todayCustomers.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
            <div className="text-xs text-stone-600">
              <span className="font-bold text-stone-900">{approvedList.length}</span> of{' '}
              {todayCustomers.length} wishes approved for dispatch
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 bg-white border border-stone-300 text-stone-700 font-semibold text-xs rounded-xl hover:bg-stone-100"
              >
                Close
              </button>

              <button
                onClick={() => setShowConfirmSendAll(true)}
                disabled={approvedList.length === 0}
                className="min-h-[44px] px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send All {approvedList.length} Approved Wishes</span>
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmSendAll && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl space-y-4 text-xs">
              <h3 className="text-base font-bold text-stone-900">
                Confirm Batch WhatsApp Dispatch
              </h3>
              <p className="text-stone-600 leading-relaxed">
                You are about to dispatch <strong>{approvedList.length} personalized wishes</strong> via{' '}
                {tenant.whatsAppStatus === 'connected'
                  ? `your verified number (${tenant.whatsAppNumber})`
                  : 'WishFlow Assisted Gateway'}
                .
              </p>

              <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 border border-stone-200 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-stone-500">Recipients:</span>
                  <span className="font-bold text-stone-900">{approvedList.length} contacts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Dispatch Speed:</span>
                  <span className="font-bold text-stone-900">Immediate (~2 seconds)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">API Messaging Cost:</span>
                  <span className="font-bold text-emerald-700">₹0.00 (Included in Plan)</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmSendAll(false)}
                  className="min-h-[40px] px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSending}
                  onClick={handleSendAllApproved}
                  className="min-h-[40px] px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  {isSending ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Confirm & Dispatch</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
