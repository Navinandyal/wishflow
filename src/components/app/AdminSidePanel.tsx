import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { FeatureFlag, AuditLogItem, WebhookLogItem, Tenant } from '../../types';
import {
  X,
  ShieldCheck,
  Activity,
  Cpu,
  Zap,
  Radio,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Play,
  Pause,
  Download,
  Search,
  Filter,
  Clock,
  Database,
  Sparkles,
  RotateCcw,
  Sliders,
  Plus,
  Send,
  Users,
  Award,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Maximize2,
  Minimize2,
  Smartphone,
  CreditCard,
  Lock,
  Check,
  Terminal,
  Server,
} from 'lucide-react';

interface AdminSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidePanel: React.FC<AdminSidePanelProps> = ({ isOpen, onClose }) => {
  const {
    tenant,
    currentRole,
    setRole,
    loginAs,
    auditLogs,
    webhookLogs,
    featureFlags,
    toggleFeatureFlag,
    createFeatureFlag,
    addAuditLog,
    retryWebhook,
    simulateIncomingWebhook,
    updateTenantWhatsAppParams,
    topUpAiCredits,
    triggerMorningBirthdayCheck,
    resetToDemoData,
    showToast,
    customers,
    messages,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'matrix' | 'flags' | 'audit' | 'webhooks' | 'ops'>('matrix');
  const [isExpandedWidth, setIsExpandedWidth] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState('ALL');
  const [isNewFlagModalOpen, setIsNewFlagModalOpen] = useState(false);
  const [newFlagName, setNewFlagName] = useState('');
  const [newFlagDesc, setNewFlagDesc] = useState('');
  const [isAutopilotArmed, setIsAutopilotArmed] = useState(true);

  if (!isOpen) return null;

  // Filtered audit logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        auditSearch === '' ||
        log.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.entity.toLowerCase().includes(auditSearch.toLowerCase()) ||
        (log.reason && log.reason.toLowerCase().includes(auditSearch.toLowerCase()));

      const matchesFilter =
        auditActionFilter === 'ALL' || log.action.includes(auditActionFilter);

      return matchesSearch && matchesFilter;
    });
  }, [auditLogs, auditSearch, auditActionFilter]);

  // Export audit logs as JSON file
  const handleExportAuditLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `wishflow_audit_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Audit log exported successfully.', 'success');
  };

  // Add new feature flag
  const handleCreateFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlagName.trim()) return;
    const flag: FeatureFlag = {
      id: `feat_${newFlagName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`,
      name: newFlagName.trim(),
      description: newFlagDesc.trim() || 'Custom experimental flag configured via Admin Console',
      enabled: true,
      targetPlans: ['starter', 'professional', 'business', 'enterprise'],
    };
    createFeatureFlag(flag);
    addAuditLog('FEATURE_FLAG_CREATE', `Flag #${flag.id}`, `Created feature flag "${flag.name}"`);
    setNewFlagName('');
    setNewFlagDesc('');
    setIsNewFlagModalOpen(false);
  };

  // Trigger manual morning birthday batch run
  const handleRunMorningBatch = () => {
    const res = triggerMorningBirthdayCheck(true);
    addAuditLog('ADMIN_FORCE_CRON', 'BirthdayScheduler', `Manually ran 8 AM IST birthday check for ${res.customers.length} contacts`);
    showToast(`Executed morning birthday check: ${res.customers.length} birthdays active today.`, 'success');
  };

  // Simulate incoming customer reply
  const handleSimulateReply = () => {
    const randomCustomer = customers.find((c) => !c.archived) || customers[0];
    const name = randomCustomer ? randomCustomer.name : 'Patient';
    simulateIncomingWebhook(
      'WHATSAPP',
      'messages.inbound',
      `Inbound message from ${name} (+91 98901 23456): "Thank you so much Doctor and team! Really touched by your wish. 🙏🎂"`
    );
    addAuditLog('WEBHOOK_INBOUND_SIMULATION', 'WhatsAppReceiver', `Simulated inbound customer reply from ${name}`);
  };

  // Simulate delivery receipt
  const handleSimulateDeliveryReceipt = () => {
    simulateIncomingWebhook(
      'WHATSAPP',
      'messages.delivered',
      `Delivered status ACK from Meta Cloud API for message ID wamid.HBgLOTE... (Latency: 142ms)`
    );
  };

  // Simulate security event
  const handleSimulateSecurityAudit = () => {
    addAuditLog(
      'SECURITY_POLICY_CHECK',
      'DPDP_ConsentGuard',
      'Verified explicit digital opt-in evidence integrity across all active contacts (0 violations detected)'
    );
    showToast('Security audit event appended to live log.', 'info');
  };

  // Toggle autopilot engine
  const handleToggleAutopilot = () => {
    const nextState = !isAutopilotArmed;
    setIsAutopilotArmed(nextState);
    addAuditLog(
      nextState ? 'AUTOPILOT_ARMED' : 'AUTOPILOT_PAUSED',
      'SystemEngine',
      nextState ? 'Autopilot morning dispatch armed for 08:00 AM IST' : 'Emergency pause activated for automated sending'
    );
    showToast(
      nextState ? 'Autopilot dispatch engine is now ARMED.' : 'Autopilot dispatch engine PAUSED.',
      nextState ? 'success' : 'warning'
    );
  };

  const percentCredits = Math.round(
    ((tenant.aiCreditsRemaining || 0) / (tenant.aiCreditsMonthlyLimit || 500)) * 100
  );

  return (
    <div
      id="admin-side-panel-overlay"
      className="fixed inset-0 z-60 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="admin-side-panel"
        className={`w-full ${
          isExpandedWidth ? 'max-w-3xl' : 'max-w-xl'
        } bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200 transition-all`}
      >
        {/* Panel Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Admin & Operations Console
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Ops
                </span>
              </div>
              <p className="text-xs text-stone-400 truncate max-w-xs sm:max-w-md">
                {tenant.profile.businessName} • ID: {tenant.id} • Role: {currentRole.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsExpandedWidth(!isExpandedWidth)}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors hidden sm:block"
              title={isExpandedWidth ? 'Standard Width' : 'Expand Panel'}
            >
              {isExpandedWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Master Autopilot Switch Banner */}
        <div className="px-5 py-2.5 bg-stone-950 border-b border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isAutopilotArmed ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-stone-300 font-medium">Autopilot Morning Dispatch:</span>
            <span className={`font-bold ${isAutopilotArmed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isAutopilotArmed ? 'ARMED (08:00 AM IST)' : 'PAUSED (Manual Only)'}
            </span>
          </div>

          <button
            onClick={handleToggleAutopilot}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-colors ${
              isAutopilotArmed
                ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isAutopilotArmed ? (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span>Pause Engine</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-white" />
                <span>Arm Engine</span>
              </>
            )}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 bg-white border-b border-stone-200 flex items-center gap-1 overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'matrix'
                ? 'border-emerald-600 text-emerald-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Diagnostics & WABA</span>
          </button>

          <button
            onClick={() => setActiveTab('flags')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'flags'
                ? 'border-emerald-600 text-emerald-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Feature Flags</span>
            <span className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded-full text-[10px]">
              {featureFlags.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'audit'
                ? 'border-emerald-600 text-emerald-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
            <span className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded-full text-[10px]">
              {auditLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('webhooks')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'webhooks'
                ? 'border-emerald-600 text-emerald-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Webhooks</span>
            <span className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded-full text-[10px]">
              {webhookLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ops')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'ops'
                ? 'border-emerald-600 text-emerald-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Simulation & Tools</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-stone-50/50">
          {/* TAB 1: DIAGNOSTICS & WABA */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              {/* WhatsApp Business API (WABA) Health Card */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-stone-900">
                        WhatsApp Business API (Meta Cloud API)
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        {tenant.whatsAppPhoneNumber || '+91 98220 12345'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      tenant.whatsAppStatus === 'connected'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      tenant.whatsAppStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    {tenant.whatsAppStatus === 'connected' ? 'Connected' : 'Assisted Mode'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="text-[10px] text-stone-400 font-medium">Quality Rating</div>
                    <div className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{tenant.whatsAppQuality || 'GREEN'}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="text-[10px] text-stone-400 font-medium">Daily Limit</div>
                    <div className="font-bold text-stone-900 mt-0.5">
                      {tenant.whatsAppTier === 'TIER_10K' ? '10K/day' : tenant.whatsAppTier || '10K/day'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="text-[10px] text-stone-400 font-medium">WABA Account ID</div>
                    <div className="font-mono text-[11px] font-bold text-stone-800 mt-0.5 truncate">
                      {tenant.wabaId || 'waba_99182390192'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="text-[10px] text-stone-400 font-medium">Delivery Rate</div>
                    <div className="font-bold text-emerald-700 mt-0.5">99.8%</div>
                  </div>
                </div>

                {/* Simulated WABA Parameter Controls */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2 text-xs">
                  <span className="font-bold text-stone-800 text-[11px]">Simulate Meta Quality State:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(['GREEN', 'YELLOW', 'RED'] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          updateTenantWhatsAppParams({ whatsAppQuality: q });
                          addAuditLog('WABA_QUALITY_CHANGE', 'MetaCloudAPI', `Simulated WABA quality changed to ${q}`);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          (tenant.whatsAppQuality || 'GREEN') === q
                            ? q === 'GREEN'
                              ? 'bg-emerald-600 text-white'
                              : q === 'YELLOW'
                              ? 'bg-amber-600 text-white'
                              : 'bg-rose-600 text-white'
                            : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {q === 'GREEN' ? '● Green (Healthy)' : q === 'YELLOW' ? '▲ Yellow (Warning)' : '■ Red (Flagged)'}
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        const newStatus = tenant.whatsAppStatus === 'connected' ? 'disconnected' : 'connected';
                        updateTenantWhatsAppParams({ whatsAppStatus: newStatus });
                        addAuditLog('WABA_CONNECTION_TOGGLE', 'MetaCloudAPI', `Connection status set to ${newStatus}`);
                      }}
                      className="ml-auto px-2.5 py-1 bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 rounded-lg text-xs font-medium"
                    >
                      Toggle {tenant.whatsAppStatus === 'connected' ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Generation Quota & Engine Health */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-stone-900">
                        AI Wish Generation Engine (Gemini 2.5 Flash)
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Cultural Context, Tri-lingual Support & Anti-Repetition
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => topUpAiCredits(100)}
                    className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+100 Credits</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-stone-600">Credits Remaining:</span>
                    <span className="font-bold text-stone-900">
                      {tenant.aiCreditsRemaining} / {tenant.aiCreditsMonthlyLimit} ({percentCredits}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        percentCredits < 20 ? 'bg-rose-500' : percentCredits < 50 ? 'bg-amber-500' : 'bg-purple-600'
                      }`}
                      style={{ width: `${Math.max(5, Math.min(100, percentCredits))}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="text-[10px] text-stone-400">Total Wishes Sent</div>
                    <div className="font-bold text-stone-900 mt-0.5">{messages.length}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="text-[10px] text-stone-400">Total Contacts</div>
                    <div className="font-bold text-stone-900 mt-0.5">{customers.length}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="text-[10px] text-stone-400">Average Latency</div>
                    <div className="font-bold text-emerald-700 mt-0.5">380ms</div>
                  </div>
                </div>
              </div>

              {/* SCGT Alliance Status & Plan */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-stone-900">
                        SCGT Alliance & Subscription
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Membership ID: {tenant.scgtMembershipId || 'SCGT-PUN-042'} • {tenant.scgtChapter || 'Pune Central'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full border border-indigo-200">
                    {tenant.scgtVerified ? 'Verified Partner' : 'Verification Pending'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
                  <div>
                    <span className="text-stone-500">Current Plan: </span>
                    <strong className="text-stone-900 capitalize font-bold">{tenant.planId || 'Professional'} (₹1,999/mo)</strong>
                  </div>
                  <button
                    onClick={() => {
                      const nextVerified = !tenant.scgtVerified;
                      updateTenantWhatsAppParams({
                        scgtVerified: nextVerified,
                        scgtVerificationStatus: nextVerified ? 'verified' : 'pending',
                      });
                      addAuditLog(
                        'SCGT_VERIFY_TOGGLE',
                        'AllianceRoster',
                        `Toggled SCGT verification to ${nextVerified ? 'VERIFIED' : 'PENDING'}`
                      );
                    }}
                    className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg text-stone-800 font-semibold text-xs"
                  >
                    Toggle {tenant.scgtVerified ? 'Unverify' : 'Verify SCGT'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEATURE FLAGS */}
          {activeTab === 'flags' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-stone-900">Platform Feature Flags</h3>
                  <p className="text-[11px] text-stone-500">
                    Enable or disable experimental features without redeploying
                  </p>
                </div>

                <button
                  onClick={() => setIsNewFlagModalOpen(true)}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Flag</span>
                </button>
              </div>

              {/* Add Flag Modal / Form */}
              {isNewFlagModalOpen && (
                <form
                  onSubmit={handleCreateFlag}
                  className="p-4 bg-white rounded-2xl border border-emerald-300 ring-2 ring-emerald-50 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-stone-900">
                    <span>Create Custom Feature Flag</span>
                    <button
                      type="button"
                      onClick={() => setIsNewFlagModalOpen(false)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Flag Name
                    </label>
                    <input
                      type="text"
                      value={newFlagName}
                      onChange={(e) => setNewFlagName(e.target.value)}
                      placeholder="e.g. Marathi Contextual Audio Wish"
                      required
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newFlagDesc}
                      onChange={(e) => setNewFlagDesc(e.target.value)}
                      placeholder="e.g. Enables celebratory 15-second WhatsApp audio generation"
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsNewFlagModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      Save & Activate Flag
                    </button>
                  </div>
                </form>
              )}

              {/* Flags List */}
              <div className="space-y-2.5">
                {featureFlags.map((flag) => (
                  <div
                    key={flag.id}
                    className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-stone-900">{flag.name}</span>
                        <span className="font-mono text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-md">
                          {flag.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        {flag.description}
                      </p>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-stone-400">Target Plans:</span>
                        {flag.targetPlans.map((p) => (
                          <span
                            key={p}
                            className="text-[9px] font-semibold uppercase bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded-sm"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFeatureFlag(flag.id)}
                      className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
                        flag.enabled ? 'bg-emerald-600' : 'bg-stone-300'
                      }`}
                      title={flag.enabled ? 'Disable Flag' : 'Enable Flag'}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          flag.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-stone-900">Security & Operational Audit Log</h3>
                  <p className="text-[11px] text-stone-500">
                    Immutable event stream of administrative and sending actions
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateSecurityAudit}
                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    + Log Test Event
                  </button>
                  <button
                    onClick={handleExportAuditLogs}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 text-xs">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    placeholder="Search logs by actor, action or entity..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <select
                  value={auditActionFilter}
                  onChange={(e) => setAuditActionFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs bg-white font-medium text-stone-700 focus:outline-hidden"
                >
                  <option value="ALL">All Actions</option>
                  <option value="AUTO">Automation</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="TEMPLATE">Template</option>
                  <option value="SCGT">SCGT</option>
                  <option value="SECURITY">Security</option>
                </select>
              </div>

              {/* Logs Stream */}
              <div className="space-y-2">
                {filteredAuditLogs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-400 bg-white rounded-2xl border border-stone-200">
                    No audit records match the current filter.
                  </div>
                ) : (
                  filteredAuditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-stone-400">
                            {log.timestamp}
                          </span>
                          <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200">
                            {log.action}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">IP: {log.ip}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-600">
                        <span>
                          <strong>Actor:</strong> {log.actor}
                        </span>
                        <span className="font-mono text-stone-500">{log.entity}</span>
                      </div>

                      {log.reason && (
                        <p className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-lg border border-stone-100">
                          &quot;{log.reason}&quot;
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: WEBHOOKS */}
          {activeTab === 'webhooks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-stone-900">Webhook & Telemetry Stream</h3>
                  <p className="text-[11px] text-stone-500">
                    Real-time delivery receipts, read receipts & billing events
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimulateDeliveryReceipt}
                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    + Delivery ACK
                  </button>
                  <button
                    onClick={handleSimulateReply}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>+ Inbound Reply</span>
                  </button>
                </div>
              </div>

              {/* Webhooks Feed */}
              <div className="space-y-2.5">
                {webhookLogs.map((wh) => (
                  <div
                    key={wh.id}
                    className={`p-3.5 bg-white rounded-2xl border ${
                      wh.status === 'DEAD_LETTERED'
                        ? 'border-rose-200 bg-rose-50/20'
                        : 'border-stone-200'
                    } shadow-2xs space-y-2 text-xs`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            wh.source === 'WHATSAPP'
                              ? 'bg-emerald-100 text-emerald-800'
                              : wh.source === 'RAZORPAY'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {wh.source}
                        </span>
                        <span className="font-mono text-stone-800 font-bold text-[11px]">
                          {wh.event}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            wh.status === 'PROCESSED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : wh.status === 'DEAD_LETTERED'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {wh.status}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">{wh.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-600 font-mono bg-stone-50 p-2 rounded-xl border border-stone-200/60 leading-relaxed">
                      {wh.payloadSummary}
                    </p>

                    {wh.status === 'DEAD_LETTERED' && (
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-rose-600 text-[11px] flex items-center gap-1 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Delivery error code 131026
                        </span>
                        <button
                          onClick={() => retryWebhook(wh.id)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Retry Webhook</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SIMULATION & OPS TOOLS */}
          {activeTab === 'ops' && (
            <div className="space-y-4">
              {/* Role Impersonation Matrix */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900">
                      Persona Impersonation & Role Testing
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Instantly test the platform with different RBAC permissions
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <button
                    onClick={() => {
                      loginAs('owner');
                      addAuditLog('ROLE_SWITCH', 'AuthSession', 'Impersonated Dr. Rajesh Kulkarni (Owner)');
                    }}
                    className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                      currentRole === 'owner'
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-100'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-bold text-stone-900 flex items-center justify-between">
                      <span>Owner (Dr. Rajesh)</span>
                      {currentRole === 'owner' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-stone-500">
                      Full access to billing, WABA API, and data export.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      loginAs('staff');
                      addAuditLog('ROLE_SWITCH', 'AuthSession', 'Impersonated Sneha K (Front Desk Staff)');
                    }}
                    className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                      currentRole === 'staff'
                        ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-100'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-bold text-stone-900 flex items-center justify-between">
                      <span>Staff (Front Desk)</span>
                      {currentRole === 'staff' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <p className="text-[10px] text-stone-500">
                      Operational access: send wishes, add patients; no export.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      loginAs('superadmin');
                      addAuditLog('ROLE_SWITCH', 'AuthSession', 'Impersonated Platform Ops SuperAdmin');
                    }}
                    className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                      currentRole === 'superadmin'
                        ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-100'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-bold text-stone-900 flex items-center justify-between">
                      <span>SuperAdmin (Ops)</span>
                      {currentRole === 'superadmin' && <Check className="w-3.5 h-3.5 text-purple-600" />}
                    </div>
                    <p className="text-[10px] text-stone-500">
                      Multi-tenant ops, AI engine routing, system queues.
                    </p>
                  </button>
                </div>
              </div>

              {/* Quick Automation Triggers */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-2xs">
                <h3 className="text-xs font-bold text-stone-900">
                  Instant Automation & Diagnostics Utilities
                </h3>

                <div className="space-y-2">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-900">Run Morning 8:00 AM IST Birthday Check</div>
                      <div className="text-[11px] text-stone-500">
                        Executes scheduler logic immediately, pushing banners and alerts.
                      </div>
                    </div>
                    <button
                      onClick={handleRunMorningBatch}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shrink-0 shadow-xs transition-colors"
                    >
                      Trigger Now
                    </button>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-900">Simulate WhatsApp Delivery Webhook</div>
                      <div className="text-[11px] text-stone-500">
                        Emulates incoming ACK status packet from Meta Cloud API.
                      </div>
                    </div>
                    <button
                      onClick={handleSimulateDeliveryReceipt}
                      className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 rounded-xl font-bold text-xs shrink-0 transition-colors"
                    >
                      Fire Webhook
                    </button>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-900">Simulate Customer WhatsApp Reply</div>
                      <div className="text-[11px] text-stone-500">
                        Simulates a patient replying with heartfelt gratitude.
                      </div>
                    </div>
                    <button
                      onClick={handleSimulateReply}
                      className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 rounded-xl font-bold text-xs shrink-0 transition-colors"
                    >
                      Simulate Reply
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone / Demo Reset */}
              <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-4 space-y-2.5">
                <h3 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>State Reset & Diagnostics</span>
                </h3>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Reset the local store back to pristine initial demo records (Sunrise Dental Care, Dr. Rajesh Kulkarni, SCGT Pune Champions chapter).
                </p>
                <button
                  onClick={() => {
                    if (confirm('Reset entire environment to fresh initial demo records?')) {
                      resetToDemoData();
                      onClose();
                    }
                  }}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Fresh Demo State</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-stone-200 bg-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            <span>WishFlow v2.4-prod • Asia/Kolkata Node</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs transition-colors"
            >
              Close Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
