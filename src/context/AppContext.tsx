import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Customer,
  MessageRecord,
  Template,
  ScheduledJob,
  SCGTMember,
  SCGTChapter,
  Tenant,
  User,
  NotificationItem,
  AuditLogItem,
  WebhookLogItem,
  FeatureFlag,
  SendingPreferences,
  SendMode,
  ConsentStatus,
  BusinessProfile,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_TENANT,
  INITIAL_CUSTOMERS,
  INITIAL_TEMPLATES,
  INITIAL_MESSAGES,
  INITIAL_SCHEDULED_JOBS,
  INITIAL_SCGT_MEMBERS,
  INITIAL_SCGT_CHAPTERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_WEBHOOK_LOGS,
  INITIAL_FEATURE_FLAGS,
} from '../data/initialData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  user: User | null;
  tenant: Tenant;
  isLoggedIn: boolean;
  currentRoute: string;
  navigate: (route: string) => void;
  customers: Customer[];
  messages: MessageRecord[];
  templates: Template[];
  scheduledJobs: ScheduledJob[];
  scgtMembers: SCGTMember[];
  scgtChapters: SCGTChapter[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  webhookLogs: WebhookLogItem[];
  featureFlags: FeatureFlag[];
  preferences: SendingPreferences;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Active drawers/modals
  activeCustomerForDrawer: Customer | null;
  setActiveCustomerForDrawer: (c: Customer | null) => void;
  activeWishTargetCustomer: Customer | null;
  setActiveWishTargetCustomer: (c: Customer | null) => void;
  isReviewSendAllOpen: boolean;
  setIsReviewSendAllOpen: (open: boolean) => void;

  // Customer actions
  addCustomer: (cust: Omit<Customer, 'id' | 'createdAt' | 'tenantId'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  archiveCustomer: (id: string) => void;
  deleteCustomer: (id: string) => void;
  importCustomers: (imported: Customer[]) => void;
  updateConsent: (customerId: string, status: ConsentStatus, evidenceNote?: string) => void;

  // Sending actions
  sendMessage: (
    customerId: string,
    wishText: string,
    sendMode: SendMode,
    tone?: string,
    language?: string
  ) => { success: boolean; messageRecord?: MessageRecord; error?: string };
  sendAllTodayWishes: () => { sentCount: number; totalCost: number };

  // Tenant / Settings actions
  updateBranding: (branding: Partial<BusinessProfile>) => void;
  updatePreferences: (prefs: Partial<SendingPreferences>) => void;
  toggleWhatsAppConnection: (connect: boolean) => void;
  upgradePlan: (planId: 'starter' | 'professional' | 'business' | 'enterprise') => void;

  // SCGT actions
  submitSCGTVerification: (membershipId: string, chapter: string) => void;
  updateSCGTVisibility: (settings: { allowWhatsApp: boolean; allowBirthday: boolean; allowBusiness: boolean }) => void;

  // Templates
  createTemplate: (tpl: Omit<Template, 'id' | 'version' | 'usageCount'>) => void;
  updateTemplate: (id: string, tpl: Partial<Template>) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Auth
  loginAs: (role: 'owner' | 'staff' | 'superadmin') => void;
  logout: () => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'wishflow_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname.startsWith('/ops')
      ? window.location.pathname
      : window.location.pathname.startsWith('/app')
      ? window.location.pathname
      : window.location.pathname === '/'
      ? '/'
      : window.location.pathname;
  });

  // Base persistent states
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [tenant, setTenant] = useState<Tenant>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tenant`);
    return saved ? JSON.parse(saved) : INITIAL_TENANT;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_customers`);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [messages, setMessages] = useState<MessageRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_messages`);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [templates, setTemplates] = useState<Template[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_templates`);
    return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
  });

  const [scheduledJobs, setScheduledJobs] = useState<ScheduledJob[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_jobs`);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_JOBS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifs`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogItem[]>(INITIAL_WEBHOOK_LOGS);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(INITIAL_FEATURE_FLAGS);
  const [scgtMembers, setScgtMembers] = useState<SCGTMember[]>(INITIAL_SCGT_MEMBERS);
  const [scgtChapters] = useState<SCGTChapter[]>(INITIAL_SCGT_CHAPTERS);

  const [preferences, setPreferences] = useState<SendingPreferences>({
    defaultSendMode: 'OWN_NUMBER',
    approvalMode: 'ALWAYS_ASK',
    defaultSendTime: '08:30',
    timezone: 'Asia/Kolkata',
    defaultTone: 'Warm & Heartfelt',
    defaultLanguage: 'English',
    frequencyCapDays: 360,
  });

  // UI state
  const [activeCustomerForDrawer, setActiveCustomerForDrawer] = useState<Customer | null>(null);
  const [activeWishTargetCustomer, setActiveWishTargetCustomer] = useState<Customer | null>(null);
  const [isReviewSendAllOpen, setIsReviewSendAllOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Sync to localStorage
  useEffect(() => {
    if (user) localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(user));
    else localStorage.removeItem(`${LOCAL_STORAGE_KEY}_user`);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_tenant`, JSON.stringify(tenant));
  }, [tenant]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_customers`, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_messages`, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_templates`, JSON.stringify(templates));
  }, [templates]);

  // Push history and route updates
  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.history.pushState({}, '', route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Customer Management
  const addCustomer = (custData: Omit<Customer, 'id' | 'createdAt' | 'tenantId'>): Customer => {
    const newCust: Customer = {
      ...custData,
      id: `cust_${Date.now()}`,
      tenantId: tenant.id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);

    // Audit log
    const audit: AuditLogItem = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: user ? `${user.name} (${user.role})` : 'System',
      tenantName: tenant.name,
      action: 'CUSTOMER_CREATE',
      entity: `Customer #${newCust.id} (${newCust.name})`,
      ip: '49.36.14.89',
      reason: 'Created customer contact profile',
    };
    setAuditLogs((prev) => [audit, ...prev]);

    showToast(`Added ${newCust.name} to customer registry.`, 'success');
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Customer details updated successfully.', 'success');
  };

  const archiveCustomer = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, archived: !c.archived } : c))
    );
    showToast('Customer archive status updated.', 'info');
  };

  const deleteCustomer = (id: string) => {
    const target = customers.find((c) => c.id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    if (activeCustomerForDrawer?.id === id) setActiveCustomerForDrawer(null);
    showToast(`Deleted ${target?.name || 'customer'} permanently.`, 'info');
  };

  const importCustomers = (imported: Customer[]) => {
    setCustomers((prev) => [...imported, ...prev]);
    showToast(`Successfully imported ${imported.length} contacts.`, 'success');
  };

  const updateConsent = (customerId: string, status: ConsentStatus, evidenceNote?: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id !== customerId) return c;
        return {
          ...c,
          consent: {
            ...c.consent,
            status,
            evidenceNote: evidenceNote || c.consent.evidenceNote,
            withdrawnAt: status === 'WITHDRAWN' ? new Date().toISOString() : undefined,
          },
        };
      })
    );
    showToast(`Consent updated to ${status}.`, status === 'ACTIVE' ? 'success' : 'warning');
  };

  // Sending Birthday Wishes
  const sendMessage = (
    customerId: string,
    wishText: string,
    sendMode: SendMode,
    tone: string = 'Warm & Heartfelt',
    language: string = 'English'
  ): { success: boolean; messageRecord?: MessageRecord; error?: string } => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return { success: false, error: 'Customer not found' };

    // Strict Consent Guardrail
    if (cust.consent.status !== 'ACTIVE') {
      const err = `Cannot send wish: ${cust.name} has not provided active WhatsApp consent.`;
      showToast(err, 'error');
      return { success: false, error: err };
    }

    // Credits check
    if (tenant.aiCreditsRemaining <= 0) {
      showToast("You've used all your AI credits. Please upgrade your plan.", 'error');
      return { success: false, error: 'AI Credits exhausted' };
    }

    // Check Own-Number connection if selected
    if (sendMode === 'OWN_NUMBER' && tenant.whatsAppStatus !== 'connected') {
      showToast('WhatsApp is not connected. Connect your own number in Settings.', 'error');
      return { success: false, error: 'WhatsApp disconnected' };
    }

    const nowIso = new Date().toISOString();
    const cost = sendMode === 'ASSISTED' ? 0 : 1.02;

    const newMsg: MessageRecord = {
      id: `msg_${Date.now()}`,
      tenantId: tenant.id,
      customerId: cust.id,
      customerName: cust.name,
      customerMobile: cust.mobile,
      messageBody: wishText,
      tone,
      language,
      isAiGenerated: true,
      sendMode,
      status: sendMode === 'ASSISTED' ? 'sent' : 'delivered',
      costInINR: cost,
      providerMessageId: `wamid.HBgLOTE${Math.random().toString(36).substr(2, 12).toUpperCase()}==`,
      queuedAt: nowIso,
      sentAt: nowIso,
      deliveredAt: sendMode !== 'ASSISTED' ? nowIso : undefined,
    };

    setMessages((prev) => [newMsg, ...prev]);

    // Update customer last wished
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === cust.id
          ? {
              ...c,
              lastWishedYear: new Date().getFullYear(),
              lastWishedDate: new Date().toISOString().split('T')[0],
            }
          : c
      )
    );

    // Deduct AI credit
    setTenant((prev) => ({
      ...prev,
      aiCreditsRemaining: Math.max(0, prev.aiCreditsRemaining - 1),
    }));

    // Notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: 'send_completed',
      title: `Wish Sent to ${cust.name}`,
      description: `Birthday wish sent via ${sendMode} mode (${language}).`,
      timestamp: 'Just now',
      read: false,
      actionUrl: '/app/messages',
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(`Birthday wish successfully sent to ${cust.name}! 🎉`, 'success');
    return { success: true, messageRecord: newMsg };
  };

  const sendAllTodayWishes = () => {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;

    // Filter customers who have birthdays today and active consent
    const eligibleToday = customers.filter(
      (c) =>
        c.birthdayDay === todayDay &&
        c.birthdayMonth === todayMonth &&
        c.consent.status === 'ACTIVE' &&
        c.lastWishedYear !== today.getFullYear()
    );

    if (eligibleToday.length === 0) {
      showToast("All today's birthday wishes have already been sent or are missing consent.", 'info');
      return { sentCount: 0, totalCost: 0 };
    }

    let sent = 0;
    eligibleToday.forEach((c) => {
      const wish = `Dear ${c.name}, wishing you a wonderfully healthy and joyful Birthday from Dr. Rajesh Kulkarni and the entire family at Sunrise Dental Care! 🎂✨ May your day bring you radiant smiles. Best wishes!`;
      sendMessage(c.id, wish, preferences.defaultSendMode, preferences.defaultTone, c.preferredLanguage);
      sent++;
    });

    const totalCost = sent * (preferences.defaultSendMode === 'ASSISTED' ? 0 : 1.02);
    return { sentCount: sent, totalCost };
  };

  const updateBranding = (branding: Partial<BusinessProfile>) => {
    setTenant((prev) => ({
      ...prev,
      name: branding.businessName || prev.name,
      profile: {
        ...prev.profile,
        ...branding,
      },
    }));
    showToast('Business branding settings saved.', 'success');
  };

  const updatePreferences = (prefs: Partial<SendingPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
    showToast('Sending preferences updated.', 'success');
  };

  const toggleWhatsAppConnection = (connect: boolean) => {
    setTenant((prev) => ({
      ...prev,
      whatsAppStatus: connect ? 'connected' : 'disconnected',
      whatsAppQuality: connect ? 'GREEN' : undefined,
      whatsAppTier: connect ? 'TIER_10K' : undefined,
      whatsAppNumber: connect ? '+91 98220 14589' : undefined,
      whatsAppDisplayName: connect ? 'Sunrise Dental Care Clinic' : undefined,
    }));
    showToast(
      connect
        ? 'Meta Cloud API WhatsApp Business Account connected successfully!'
        : 'WhatsApp Business account disconnected.',
      connect ? 'success' : 'info'
    );
  };

  const upgradePlan = (planId: 'starter' | 'professional' | 'business' | 'enterprise') => {
    const limits = {
      starter: 200,
      professional: 800,
      business: 2500,
      enterprise: 10000,
    };
    setTenant((prev) => ({
      ...prev,
      planId,
      planStatus: 'active',
      aiCreditsRemaining: limits[planId],
      aiCreditsMonthlyLimit: limits[planId],
    }));
    showToast(`Upgraded to ${planId.toUpperCase()} plan via Razorpay Autopay.`, 'success');
  };

  const submitSCGTVerification = (membershipId: string, chapter: string) => {
    setTenant((prev) => ({
      ...prev,
      scgtVerificationStatus: 'pending',
      scgtMembershipId: membershipId,
      scgtChapter: chapter,
    }));
    showToast('SCGT verification request submitted for admin review.', 'info');
  };

  const updateSCGTVisibility = (settings: { allowWhatsApp: boolean; allowBirthday: boolean; allowBusiness: boolean }) => {
    showToast('SCGT directory visibility preferences updated.', 'success');
  };

  const createTemplate = (tpl: Omit<Template, 'id' | 'version' | 'usageCount'>) => {
    const newTpl: Template = {
      ...tpl,
      id: `tpl_${Date.now()}`,
      tenantId: tenant.id,
      version: 1,
      usageCount: 0,
      metaApprovalStatus: 'APPROVED',
    };
    setTemplates((prev) => [newTpl, ...prev]);
    showToast('Saved to My Templates successfully.', 'success');
  };

  const updateTemplate = (id: string, updates: Partial<Template>) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, version: t.version + 1 } : t))
    );
    showToast('Template updated and incremented version.', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const loginAs = (role: 'owner' | 'staff' | 'superadmin') => {
    if (role === 'superadmin') {
      setUser({
        id: 'usr_superadmin',
        name: 'WishFlow Admin (Ops)',
        email: 'ops@wishflow.ai',
        mobile: '+91 99000 00001',
        role: 'superadmin',
        twoFactorEnabled: true,
      });
      navigate('/ops');
    } else if (role === 'staff') {
      setUser({
        id: 'usr_staff_sneha',
        name: 'Sneha K (Front Desk Staff)',
        email: 'reception@sunrisedental.in',
        mobile: '+91 98221 88776',
        role: 'staff',
        twoFactorEnabled: false,
      });
      navigate('/app/dashboard');
    } else {
      setUser(INITIAL_USER);
      navigate('/app/dashboard');
    }
    showToast(`Switched user role to ${role.toUpperCase()}.`, 'info');
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
    showToast('Logged out of WishFlow AI session.', 'info');
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setTenant(INITIAL_TENANT);
    setCustomers(INITIAL_CUSTOMERS);
    setMessages(INITIAL_MESSAGES);
    setTemplates(INITIAL_TEMPLATES);
    setScheduledJobs(INITIAL_SCHEDULED_JOBS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setWebhookLogs(INITIAL_WEBHOOK_LOGS);
    setFeatureFlags(INITIAL_FEATURE_FLAGS);
    setScgtMembers(INITIAL_SCGT_MEMBERS);
    showToast('Reset application to fresh demo data.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        tenant,
        isLoggedIn: !!user,
        currentRoute,
        navigate,
        customers,
        messages,
        templates,
        scheduledJobs,
        scgtMembers,
        scgtChapters,
        notifications,
        auditLogs,
        webhookLogs,
        featureFlags,
        preferences,
        toasts,
        showToast,
        removeToast,
        activeCustomerForDrawer,
        setActiveCustomerForDrawer,
        activeWishTargetCustomer,
        setActiveWishTargetCustomer,
        isReviewSendAllOpen,
        setIsReviewSendAllOpen,
        addCustomer,
        updateCustomer,
        archiveCustomer,
        deleteCustomer,
        importCustomers,
        updateConsent,
        sendMessage,
        sendAllTodayWishes,
        updateBranding,
        updatePreferences,
        toggleWhatsAppConnection,
        upgradePlan,
        submitSCGTVerification,
        updateSCGTVisibility,
        createTemplate,
        updateTemplate,
        markNotificationRead,
        markAllNotificationsRead,
        loginAs,
        logout,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
