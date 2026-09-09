import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Download, ShieldAlert, FileSpreadsheet, Lock } from 'lucide-react';

interface ExportCustomersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportCustomersModal: React.FC<ExportCustomersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { customers, currentRole, showToast } = useApp();

  const [format, setFormat] = useState<'csv' | 'xlsx'>('csv');
  const [scope, setScope] = useState<'active_only' | 'all_including_archived'>('active_only');
  const [confirmedRisk, setConfirmedRisk] = useState(false);

  if (!isOpen) return null;

  const isOwner = currentRole === 'owner';

  const handleExport = () => {
    if (!isOwner) {
      showToast('Security Policy: Only the primary business owner can export customer database records.', 'error');
      return;
    }

    if (!confirmedRisk) {
      showToast('Please acknowledge data privacy compliance checkbox before exporting.', 'warning');
      return;
    }

    const exportedCustomers = customers.filter((c) =>
      scope === 'active_only' ? !c.archived : true
    );

    // Generate CSV data
    const headers = [
      'Name',
      'Mobile',
      'WhatsAppNumber',
      'BirthdayDay',
      'BirthdayMonth',
      'BirthdayYear',
      'Relationship',
      'PreferredLanguage',
      'City',
      'State',
      'ConsentStatus',
      'ConsentSource',
      'Tags',
      'LastWishedYear',
    ];

    const rows = exportedCustomers.map((c) => [
      `"${c.name}"`,
      `"${c.mobile}"`,
      `"${c.whatsAppNumber}"`,
      c.birthdayDay,
      c.birthdayMonth,
      c.birthdayYear || '',
      `"${c.relationship}"`,
      `"${c.preferredLanguage}"`,
      `"${c.city}"`,
      `"${c.state}"`,
      `"${c.consent.status}"`,
      `"${c.consent.source}"`,
      `"${c.tags.join(';')}"`,
      c.lastWishedYear || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `wishflow_customers_export_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Successfully exported ${exportedCustomers.length} customer records.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden">
        <div className="p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-stone-900">Export Customer Registry</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {!isOwner && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900">
              <Lock className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold">Staff Role Restriction:</span> You are currently viewing as Staff. Only the Business Owner can export customer contact lists. Switch to Owner role in the top navigation to test this capability.
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Export Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  format === 'csv'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                CSV (.csv)
              </button>
              <button
                type="button"
                onClick={() => setFormat('xlsx')}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                  format === 'xlsx'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Excel (.xlsx)
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Customer Scope</label>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as any)}
              className="w-full min-h-[40px] px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl"
            >
              <option value="active_only">Active Contacts Only ({customers.filter((c) => !c.archived).length})</option>
              <option value="all_including_archived">All Contacts Including Archived ({customers.length})</option>
            </select>
          </div>

          {/* Security Compliance Warning */}
          <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-rose-800 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Security & DPDP Act Warning</span>
            </div>
            <p className="text-[11px] text-rose-700 leading-relaxed">
              Exported files contain sensitive personal data including mobile numbers and dates of birth. Store securely and do not share across unencrypted channels.
            </p>
            <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmedRisk}
                onChange={(e) => setConfirmedRisk(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-rose-600 rounded border-rose-300"
              />
              <span className="text-[11px] text-rose-900 font-medium">
                I understand and take full responsibility for secure data storage.
              </span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!isOwner || !confirmedRisk}
              onClick={handleExport}
              className="min-h-[44px] px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
