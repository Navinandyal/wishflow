import React, { useState, useEffect } from 'react';
import { Customer, ConsentStatus } from '../../types';
import { X, ChevronDown, ChevronUp, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

interface AddEditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: Partial<Customer>) => void;
  customerToEdit?: Customer | null;
}

export const AddEditCustomerModal: React.FC<AddEditCustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  customerToEdit,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [email, setEmail] = useState('');
  const [birthdayDay, setBirthdayDay] = useState<number>(new Date().getDate());
  const [birthdayMonth, setBirthdayMonth] = useState<number>(new Date().getMonth() + 1);
  const [birthdayYear, setBirthdayYear] = useState<string>('1990');
  const [anniversaryDate, setAnniversaryDate] = useState('');
  const [company, setCompany] = useState('');
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [relationship, setRelationship] = useState<Customer['relationship']>('Patient');
  const [preferredLanguage, setPreferredLanguage] = useState<'English' | 'Marathi' | 'Hindi'>('English');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Dental VIP']);
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('ACTIVE');
  const [consentSource, setConsentSource] = useState<string>('WALK_IN');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const months = [
    'January (1)', 'February (2)', 'March (3)', 'April (4)', 'May (5)', 'June (6)',
    'July (7)', 'August (8)', 'September (9)', 'October (10)', 'November (11)', 'December (12)'
  ];

  useEffect(() => {
    if (customerToEdit) {
      setName(customerToEdit.name);
      setMobile(customerToEdit.mobile);
      setWhatsAppNumber(customerToEdit.whatsAppNumber || customerToEdit.mobile);
      setEmail(customerToEdit.email || '');
      setBirthdayDay(customerToEdit.birthdayDay);
      setBirthdayMonth(customerToEdit.birthdayMonth);
      setBirthdayYear(customerToEdit.birthdayYear ? customerToEdit.birthdayYear.toString() : '');
      setAnniversaryDate(customerToEdit.anniversaryDate || '');
      setCompany(customerToEdit.company || '');
      setOccupation(customerToEdit.occupation || '');
      setCity(customerToEdit.city);
      setState(customerToEdit.state);
      setRelationship(customerToEdit.relationship);
      setPreferredLanguage(customerToEdit.preferredLanguage);
      setTags(customerToEdit.tags);
      setConsentStatus(customerToEdit.consent.status);
      setConsentSource(customerToEdit.consent.source);
      setNotes(customerToEdit.notes || '');
      setShowAdvanced(true);
    } else {
      setName('');
      setMobile('');
      setWhatsAppNumber('');
      setEmail('');
      setBirthdayDay(new Date().getDate());
      setBirthdayMonth(new Date().getMonth() + 1);
      setBirthdayYear('');
      setAnniversaryDate('');
      setCompany('');
      setOccupation('');
      setCity('Pune');
      setState('Maharashtra');
      setRelationship('Patient');
      setPreferredLanguage('English');
      setTags(['Dental VIP']);
      setConsentStatus('ACTIVE');
      setConsentSource('WALK_IN');
      setNotes('');
      setShowAdvanced(false);
    }
  }, [customerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide the customer name.');
      return;
    }
    if (!mobile.trim() || mobile.replace(/\D/g, '').length < 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    // Format phone with +91 if needed
    const cleanDigits = mobile.replace(/\D/g, '').slice(-10);
    const formattedPhone = `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`;

    const data: Partial<Customer> = {
      name: name.trim(),
      mobile: formattedPhone,
      whatsAppNumber: whatsAppNumber ? whatsAppNumber.trim() : formattedPhone,
      email: email.trim() || undefined,
      birthdayDay: Number(birthdayDay),
      birthdayMonth: Number(birthdayMonth),
      birthdayYear: birthdayYear ? Number(birthdayYear) : null,
      anniversaryDate: anniversaryDate.trim() || undefined,
      company: company.trim() || undefined,
      occupation: occupation.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      relationship,
      preferredLanguage,
      tags,
      notes: notes.trim() || undefined,
      consent: {
        status: consentStatus,
        source: consentSource as any,
        timestamp: customerToEdit ? customerToEdit.consent.timestamp : new Date().toISOString(),
        channel: 'WHATSAPP',
        evidenceNote: customerToEdit ? customerToEdit.consent.evidenceNote : 'Directly entered by clinic staff',
      },
    };

    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              {customerToEdit ? 'Edit Customer Contact' : 'Add New Customer Contact'}
            </h2>
            <p className="text-xs text-stone-500">
              {customerToEdit ? 'Update birthday and messaging preferences' : 'Quick add with smart defaults'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Quick Add Fields (Always Visible) */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Joshi"
                className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mobile / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 98220 12345"
                className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Birthday Fields */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Birthday (Day & Month) *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={birthdayDay}
                  onChange={(e) => setBirthdayDay(Number(e.target.value))}
                  className="min-h-[44px] px-2 py-2 text-xs bg-white border border-stone-300 rounded-xl"
                >
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Day {i + 1}
                    </option>
                  ))}
                </select>

                <select
                  value={birthdayMonth}
                  onChange={(e) => setBirthdayMonth(Number(e.target.value))}
                  className="min-h-[44px] px-2 py-2 text-xs bg-white border border-stone-300 rounded-xl"
                >
                  {months.map((m, idx) => (
                    <option key={m} value={idx + 1}>
                      {m}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Birth Year (Opt)"
                  value={birthdayYear}
                  onChange={(e) => setBirthdayYear(e.target.value)}
                  min={1920}
                  max={2026}
                  className="min-h-[44px] px-2 py-2 text-xs bg-white border border-stone-300 rounded-xl text-center"
                />
              </div>
            </div>

            {/* Relationship & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as any)}
                  className="w-full min-h-[44px] px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl"
                >
                  <option value="Patient">Patient</option>
                  <option value="VIP Customer">VIP Customer</option>
                  <option value="Client">Corporate Client</option>
                  <option value="Referral Partner">Referral Partner</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Friend">Friend</option>
                  <option value="Family">Family</option>
                  <option value="SCGT Member">SCGT Member</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Preferred Wish Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as any)}
                  className="w-full min-h-[44px] px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl"
                >
                  <option value="English">English</option>
                  <option value="Marathi">मराठी (Marathi)</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Toggle Advanced Section */}
          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-bold text-stone-700 hover:text-emerald-700 flex items-center gap-1.5"
            >
              <span>{showAdvanced ? 'Hide Advanced Attributes' : 'Show Advanced Attributes (City, Tags, Consent, Notes)'}</span>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Collapsible Advanced Section */}
          {showAdvanced && (
            <div className="space-y-4 pt-2 border-t border-stone-100 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Occupation (Optional)
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Tags Editor */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Tags & Segments
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type tag and press Add..."
                    className="flex-1 min-h-[38px] px-3 py-1 text-xs bg-white border border-stone-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1 bg-stone-100 hover:bg-stone-200 font-semibold rounded-xl text-xs"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1 border border-emerald-200"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Consent Settings */}
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">WhatsApp Opt-In Consent</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={consentStatus}
                    onChange={(e) => setConsentStatus(e.target.value as any)}
                    className="min-h-[38px] px-2 py-1 text-xs bg-white border border-stone-300 rounded-xl"
                  >
                    <option value="ACTIVE">ACTIVE Consent</option>
                    <option value="PENDING">PENDING</option>
                    <option value="WITHDRAWN">WITHDRAWN (Opt-out)</option>
                  </select>

                  <select
                    value={consentSource}
                    onChange={(e) => setConsentSource(e.target.value)}
                    className="min-h-[38px] px-2 py-1 text-xs bg-white border border-stone-300 rounded-xl"
                  >
                    <option value="WALK_IN">Walk-in Reception</option>
                    <option value="COLLECTION_PAGE">Public QR Link</option>
                    <option value="WHATSAPP_MESSAGE">WhatsApp Chat</option>
                    <option value="PAPER_FORM">Paper Registration</option>
                    <option value="IMPORTED">Import File</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Private Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes for staff reference..."
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              {customerToEdit ? 'Save Changes' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
