import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Download,
  Check,
} from 'lucide-react';

interface ImportCustomersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportCustomersModal: React.FC<ImportCustomersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addCustomer, showToast, customers } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Mapping states
  const [columnMapping, setColumnMapping] = useState({
    name: 'Customer Name',
    mobile: 'Phone Number',
    birthday: 'Date of Birth (DD/MM)',
    city: 'City',
    relationship: 'Relationship',
    language: 'Preferred Language',
  });

  // Simulated parsed rows
  const [previewRows, setPreviewRows] = useState([
    {
      name: 'Dr. Sameer Patil',
      mobile: '+91 98223 90123',
      birthday: '14/09/1985',
      city: 'Pune',
      relationship: 'Referral Partner',
      language: 'Marathi',
      status: 'NEW',
    },
    {
      name: 'Sunita Mehra',
      mobile: '+91 97654 11223',
      birthday: '22/09/1992',
      city: 'Mumbai',
      relationship: 'Patient',
      language: 'Hindi',
      status: 'NEW',
    },
    {
      name: 'Rohan Deshmukh',
      mobile: '+91 98220 14589', // duplicate phone of existing contact
      birthday: '08/09/1988',
      city: 'Pune',
      relationship: 'VIP Customer',
      language: 'Marathi',
      status: 'UPDATED',
    },
    {
      name: 'Kavita Joshi',
      mobile: '98200', // Invalid phone
      birthday: '31/02/1990', // Invalid date
      city: 'Nashik',
      relationship: 'Patient',
      language: 'English',
      status: 'ERROR',
      errorReason: 'Invalid 10-digit mobile number; invalid date (Feb 31)',
    },
  ]);

  if (!isOpen) return null;

  const handleSimulatedFileUpload = (name: string, size: string) => {
    setFileName(name);
    setFileSize(size);
    setStep(2);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleSimulatedFileUpload(file.name, `${(file.size / 1024).toFixed(1)} KB`);
    }
  };

  const handleConfirmImport = () => {
    // Add valid preview rows
    const validRows = previewRows.filter((r) => r.status !== 'ERROR');
    validRows.forEach((r) => {
      const parts = r.birthday.split('/');
      const day = parseInt(parts[0], 10) || 15;
      const month = parseInt(parts[1], 10) || 9;
      const year = parts[2] ? parseInt(parts[2], 10) : null;

      addCustomer({
        name: r.name,
        mobile: r.mobile,
        whatsAppNumber: r.mobile,
        birthdayDay: day,
        birthdayMonth: month,
        birthdayYear: year,
        city: r.city,
        state: 'Maharashtra',
        relationship: r.relationship as any,
        preferredLanguage: r.language as any,
        tags: ['Excel Import', 'Campaign 2026'],
        consent: {
          status: 'ACTIVE',
          source: 'IMPORTED',
          timestamp: new Date().toISOString(),
          channel: 'WHATSAPP',
          evidenceNote: `Imported via spreadsheet batch: ${fileName || 'contacts.xlsx'}`,
        },
        source: 'IMPORTED',
      });
    });

    setStep(4);
    showToast(`Successfully imported ${validRows.length} customer contacts!`, 'success');
  };

  const newCount = previewRows.filter((r) => r.status === 'NEW').length;
  const updatedCount = previewRows.filter((r) => r.status === 'UPDATED').length;
  const errorCount = previewRows.filter((r) => r.status === 'ERROR').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Import Customer Contacts (XLSX, CSV, vCard)
            </h2>
            <p className="text-xs text-stone-500">
              Step {step} of 4:{' '}
              {step === 1 && 'Upload Spreadsheet File'}
              {step === 2 && 'Map Table Columns'}
              {step === 3 && 'Dry Run & Validation Preview'}
              {step === 4 && 'Import Completed'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* STEP 1: FILE UPLOAD */}
          {step === 1 && (
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-8 border-2 border-dashed rounded-3xl text-center flex flex-col items-center justify-center gap-3 transition-colors ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-stone-300 bg-stone-50 hover:bg-stone-100/60'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 text-emerald-600 flex items-center justify-center shadow-xs">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-stone-900">
                    Drag and drop your spreadsheet here
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Supports Microsoft Excel (.xlsx, .xls), Comma-separated (.csv), or Contacts (.vcf)
                  </p>
                </div>

                <div className="pt-2">
                  <label className="min-h-[40px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Browse Files</span>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv,.vcf"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          handleSimulatedFileUpload(file.name, `${(file.size / 1024).toFixed(1)} KB`);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Sample Download Template */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-stone-900">Need an Excel format template?</div>
                  <div className="text-[11px] text-stone-500">
                    Includes columns for Name, Mobile, Birthday, City, Language & Relationship.
                  </div>
                </div>
                <button
                  onClick={() => {
                    const csvContent =
                      'data:text/csv;charset=utf-8,Name,Mobile,Birthday_Day,Birthday_Month,Birthday_Year,Relationship,City,Language\nDr. Amit Sharma,9822011111,15,8,1985,VIP Customer,Pune,Marathi\nPriya Patil,9822022222,24,10,1992,Patient,Mumbai,Hindi';
                    const encoded = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encoded);
                    link.setAttribute('download', 'wishflow_sample_customers.csv');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="min-h-[38px] px-3 py-1.5 bg-white border border-stone-300 rounded-xl font-semibold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Sample CSV</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: COLUMN MAPPING */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
                Detected columns from <strong>{fileName}</strong> ({fileSize}). Confirm how each column maps to WishFlow fields:
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 items-center gap-4 py-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-700">Customer Full Name *</span>
                  <select
                    value={columnMapping.name}
                    onChange={(e) => setColumnMapping({ ...columnMapping, name: e.target.value })}
                    className="min-h-[38px] px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Customer Name">Customer Name (Column A)</option>
                    <option value="Name">Name</option>
                    <option value="Full Name">Full Name</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 items-center gap-4 py-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-700">Mobile / WhatsApp Number *</span>
                  <select
                    value={columnMapping.mobile}
                    onChange={(e) => setColumnMapping({ ...columnMapping, mobile: e.target.value })}
                    className="min-h-[38px] px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Phone Number">Phone Number (Column B)</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Contact">Contact</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 items-center gap-4 py-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-700">Birthday (DD/MM or Date) *</span>
                  <select
                    value={columnMapping.birthday}
                    onChange={(e) => setColumnMapping({ ...columnMapping, birthday: e.target.value })}
                    className="min-h-[38px] px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Date of Birth (DD/MM)">Date of Birth (Column C)</option>
                    <option value="Birthday">Birthday</option>
                    <option value="DOB">DOB</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 items-center gap-4 py-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-700">City / Location</span>
                  <select
                    value={columnMapping.city}
                    onChange={(e) => setColumnMapping({ ...columnMapping, city: e.target.value })}
                    className="min-h-[38px] px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="City">City (Column D)</option>
                    <option value="Location">Location</option>
                    <option value="Ignore">-- Skip Column --</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 items-center gap-4 py-2">
                  <span className="font-semibold text-stone-700">Preferred Language</span>
                  <select
                    value={columnMapping.language}
                    onChange={(e) => setColumnMapping({ ...columnMapping, language: e.target.value })}
                    className="min-h-[38px] px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="Preferred Language">Preferred Language (Column E)</option>
                    <option value="Default to English">Default to English</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="min-h-[40px] px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="min-h-[40px] px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span>Run Dry-Run Preview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DRY RUN PREVIEW */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Summary KPIs */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <div className="text-xl font-extrabold text-emerald-800">{newCount}</div>
                  <div className="text-[11px] font-semibold text-emerald-700">New Contacts</div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="text-xl font-extrabold text-blue-800">{updatedCount}</div>
                  <div className="text-[11px] font-semibold text-blue-700">Updates / Merged</div>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
                  <div className="text-xl font-extrabold text-rose-800">{errorCount}</div>
                  <div className="text-[11px] font-semibold text-rose-700">Errors (Skipped)</div>
                </div>
              </div>

              {/* Rows List */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
                    <tr>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">Mobile</th>
                      <th className="p-2.5">Birthday</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {previewRows.map((row, i) => (
                      <tr key={i} className="hover:bg-stone-50">
                        <td className="p-2.5 font-semibold text-stone-900">{row.name}</td>
                        <td className="p-2.5 font-mono text-[11px]">{row.mobile}</td>
                        <td className="p-2.5">{row.birthday}</td>
                        <td className="p-2.5">
                          {row.status === 'NEW' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              NEW
                            </span>
                          )}
                          {row.status === 'UPDATED' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                              UPDATE
                            </span>
                          )}
                          {row.status === 'ERROR' && (
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800"
                              title={row.errorReason}
                            >
                              ERROR: {row.errorReason}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {errorCount > 0 && (
                <div className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl">
                  <span>{errorCount} row has formatting errors and will be safely omitted.</span>
                  <button
                    onClick={() => alert('Downloaded error rows report')}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    Download Error CSV
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="min-h-[40px] px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className="min-h-[40px] px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm and Import {newCount + updatedCount} Contacts</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Contacts Imported Successfully!
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                All valid customer records have been added to your database with opt-in provenance and birthday detection schedules.
              </p>

              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="min-h-[44px] px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Done & View Customers
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
