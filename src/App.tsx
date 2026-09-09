import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LandingPage } from './components/public/LandingPage';
import { PricingPage } from './components/public/PricingPage';
import { PublicCustomerCollection } from './components/public/PublicCustomerCollection';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { Dashboard } from './components/app/Dashboard';
import { CustomersList } from './components/app/CustomersList';
import { CustomerDrawer } from './components/app/CustomerDrawer';
import { AddEditCustomerModal } from './components/app/AddEditCustomerModal';
import { ImportCustomersModal } from './components/app/ImportCustomersModal';
import { ExportCustomersModal } from './components/app/ExportCustomersModal';
import { WishGeneratorPage } from './components/app/WishGeneratorPage';
import { ReviewSendModal } from './components/app/ReviewSendModal';
import { BirthdaysPage } from './components/app/BirthdaysPage';
import { TemplatesPage } from './components/app/TemplatesPage';
import { SCGTPage } from './components/app/SCGTPage';
import { AnalyticsPage } from './components/app/AnalyticsPage';
import { SettingsPage } from './components/app/SettingsPage';
import { BottomNav } from './components/common/BottomNav';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Cake,
  Layers,
  Award,
  BarChart2,
  Settings,
  Send,
  Plus,
  LogOut,
  Menu,
  X,
  MessageCircle,
  ExternalLink,
  QrCode,
  ShieldCheck,
  UserCheck,
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentPath,
    navigate,
    tenant,
    currentRole,
    setRole,
    activeCustomerForDrawer,
    setActiveCustomerForDrawer,
    isAddCustomerModalOpen,
    setIsAddCustomerModalOpen,
    customerToEdit,
    isImportModalOpen,
    setIsImportModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    isReviewSendModalOpen,
    setIsReviewSendModalOpen,
    isReviewSendAllOpen,
    setIsReviewSendAllOpen,
    addCustomer,
    updateCustomer,
    toast,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/customers', label: 'Customers', icon: Users },
    { path: '/app/wishes', label: 'AI Wish Generator', icon: Sparkles },
    { path: '/app/birthdays', label: 'Birthday Radar', icon: Cake },
    { path: '/app/templates', label: 'Templates', icon: Layers },
    { path: '/app/scgt', label: 'SCGT Alliance', icon: Award },
    { path: '/app/analytics', label: 'Analytics', icon: BarChart2 },
    { path: '/app/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col text-stone-900 font-sans">
      {/* Top Demo Helper & Role Switcher Banner */}
      <header className="bg-stone-900 text-stone-300 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>WishFlow AI</span>
          </div>
          <span className="text-stone-500 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-stone-400">
            Automated WhatsApp Birthday Engine for Indian SMBs & SCGT
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Public Standee QR Link */}
          <button
            onClick={() => navigate('/collect')}
            className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-stone-800/80 px-2.5 py-1 rounded-lg border border-stone-700"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Public Standee QR Page</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-stone-800 px-2 py-0.5 rounded-lg border border-stone-700">
            <span className="text-stone-400 text-[11px]">Role:</span>
            <select
              value={currentRole}
              onChange={(e) => setRole(e.target.value as any)}
              className="bg-transparent text-white font-bold text-[11px] focus:outline-hidden cursor-pointer"
            >
              <option value="owner" className="bg-stone-900 text-white">Owner (Full Access)</option>
              <option value="manager" className="bg-stone-900 text-white">Manager</option>
              <option value="staff" className="bg-stone-900 text-white">Staff / Assistant</option>
            </select>
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1"
            title="Return to Public Landing"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Public Site</span>
          </button>
        </div>
      </header>

      {/* Role Notice if not Owner */}
      {currentRole !== 'owner' && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-center text-xs text-amber-900 flex items-center justify-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-600" />
          <span>
            Simulating <strong>{currentRole.toUpperCase()}</strong> role. Database exports and billing management are restricted.
          </span>
          <button
            onClick={() => setRole('owner')}
            className="underline font-bold text-amber-950 ml-1 hover:text-amber-800"
          >
            Switch to Owner
          </button>
        </div>
      )}

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200 p-4 justify-between shrink-0">
          <div className="space-y-6">
            {/* Tenant Snapshot */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
                <span>Active Workspace</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="font-extrabold text-stone-900 text-xs sm:text-sm truncate">
                {tenant.profile.businessName}
              </div>
              <div className="text-[11px] text-stone-500 truncate">
                {tenant.profile.industry} • {tenant.profile.city}
              </div>
            </div>

            {/* Quick Action Button: Review & Send */}
            <button
              onClick={() => setIsReviewSendModalOpen(true)}
              className="w-full min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Review Today's Wishes</span>
            </button>

            {/* Nav List */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/app/dashboard'
                    ? currentPath === '/app/dashboard'
                    : currentPath.startsWith(item.path);

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors text-left ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/80 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-emerald-700' : 'text-stone-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Status Indicators */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-stone-600">
                <span>WhatsApp API:</span>
                <span
                  className={`font-bold ${
                    tenant.whatsAppStatus === 'connected'
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {tenant.whatsAppStatus === 'connected' ? 'Connected' : 'Assisted'}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>SCGT Member:</span>
                <span className="font-bold text-indigo-700">Verified ✓</span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>Plan:</span>
                <span className="font-bold text-stone-800 capitalize">
                  {tenant.plan || tenant.planId}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header Bar */}
        <div className="md:hidden bg-white border-b border-stone-200 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <div className="font-bold text-xs text-stone-900 truncate max-w-[200px]">
              {tenant.profile.businessName}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReviewSendModalOpen(true)}
              className="min-h-[36px] px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Review</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 rounded-xl bg-stone-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 p-4 space-y-2 z-40">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/app/dashboard'
                  ? currentPath === '/app/dashboard'
                  : currentPath.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden pb-20 md:pb-0">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      {activeCustomerForDrawer && (
        <CustomerDrawer
          customer={activeCustomerForDrawer}
          onClose={() => setActiveCustomerForDrawer(null)}
        />
      )}

      {isAddCustomerModalOpen && (
        <AddEditCustomerModal
          isOpen={isAddCustomerModalOpen}
          onClose={() => setIsAddCustomerModalOpen(false)}
          onSave={(data) => {
            if (customerToEdit) {
              updateCustomer(customerToEdit.id, data);
            } else {
              addCustomer(data as any);
            }
            setIsAddCustomerModalOpen(false);
          }}
          customerToEdit={customerToEdit}
        />
      )}

      {isImportModalOpen && (
        <ImportCustomersModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
        />
      )}

      {isExportModalOpen && (
        <ExportCustomersModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {(isReviewSendModalOpen || isReviewSendAllOpen) && (
        <ReviewSendModal
          isOpen={isReviewSendModalOpen || isReviewSendAllOpen}
          onClose={() => {
            setIsReviewSendModalOpen(false);
            setIsReviewSendAllOpen(false);
          }}
        />
      )}

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-70 max-w-sm w-full transition-all animate-bounce">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-stone-900 text-white border-stone-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const {
    currentPath,
    currentRoute,
    setCustomerToEdit,
    setIsAddCustomerModalOpen,
    setIsImportModalOpen,
    setIsExportModalOpen,
  } = useApp();

  const path = currentPath || currentRoute || '/app/dashboard';

  // Route matching
  if (
    path === '/' ||
    path === '/landing' ||
    path === '/features' ||
    path === '/demo' ||
    path === '/scgt-info'
  ) {
    return <LandingPage />;
  }

  if (path === '/pricing') {
    return <PricingPage />;
  }

  if (path === '/collect' || path.startsWith('/public')) {
    return <PublicCustomerCollection />;
  }

  if (path === '/login') {
    return <LoginPage />;
  }

  if (path === '/register') {
    return <RegisterPage />;
  }

  // App routes
  if (path.startsWith('/app/') || path === '/ops') {
    if (path === '/app/customers') {
      return (
        <AppShell>
          <CustomersList
            onOpenAddModal={() => {
              setCustomerToEdit(null);
              setIsAddCustomerModalOpen(true);
            }}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onEditCustomer={(c) => {
              setCustomerToEdit(c);
              setIsAddCustomerModalOpen(true);
            }}
          />
        </AppShell>
      );
    }

    if (path.startsWith('/app/settings')) {
      let initialTab: 'whatsapp' | 'sending' | 'profile' | 'team' | 'billing' | 'privacy' = 'whatsapp';
      if (path.includes('/profile')) initialTab = 'profile';
      else if (path.includes('/whatsapp')) initialTab = 'whatsapp';
      else if (path.includes('/sending')) initialTab = 'sending';
      else if (path.includes('/team')) initialTab = 'team';
      else if (path.includes('/billing')) initialTab = 'billing';
      else if (path.includes('/privacy')) initialTab = 'privacy';

      return (
        <AppShell>
          <SettingsPage initialTab={initialTab} />
        </AppShell>
      );
    }

    let Component = Dashboard;
    if (path === '/app/wishes') Component = WishGeneratorPage;
    else if (path === '/app/birthdays') Component = BirthdaysPage;
    else if (path === '/app/templates') Component = TemplatesPage;
    else if (path === '/app/scgt') Component = SCGTPage;
    else if (
      path === '/app/analytics' ||
      path === '/app/reports' ||
      path === '/app/messages' ||
      path === '/ops'
    ) {
      Component = AnalyticsPage;
    }

    return (
      <AppShell>
        <Component />
      </AppShell>
    );
  }

  // Fallback to Dashboard
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
