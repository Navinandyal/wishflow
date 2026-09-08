import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, CheckCircle2, ShieldCheck, QrCode, Copy, Check, Download, ArrowLeft } from 'lucide-react';

export const PublicCustomerCollection: React.FC = () => {
  const { tenant, addCustomer, navigate } = useApp();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [birthdayDay, setBirthdayDay] = useState(new Date().getDate());
  const [birthdayMonth, setBirthdayMonth] = useState(new Date().getMonth() + 1);
  const [birthdayYear, setBirthdayYear] = useState('1990');
  const [city, setCity] = useState(tenant.profile.city || 'Pune');
  const [language, setLanguage] = useState<'English' | 'Marathi' | 'Hindi'>('English');
  const [consentGiven, setConsentGiven] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!mobile.trim() || mobile.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!consentGiven) {
      setErrorMsg('Please check the permission box to receive WhatsApp birthday greetings.');
      return;
    }

    // Format phone with +91
    const cleanDigits = mobile.replace(/\D/g, '').slice(-10);
    const formattedMobile = `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`;

    addCustomer({
      name: name.trim(),
      mobile: formattedMobile,
      whatsAppNumber: formattedMobile,
      birthdayDay: Number(birthdayDay),
      birthdayMonth: Number(birthdayMonth),
      birthdayYear: birthdayYear ? Number(birthdayYear) : null,
      relationship: 'Patient',
      city: city.trim(),
      state: tenant.profile.state || 'Maharashtra',
      preferredLanguage: language,
      tags: ['Customer Registration QR'],
      consent: {
        status: 'ACTIVE',
        source: 'COLLECTION_PAGE',
        timestamp: new Date().toISOString(),
        channel: 'WHATSAPP',
        evidenceNote: 'Registered via public birthday signup link',
      },
      source: 'COLLECTION_PAGE',
    });

    setIsSubmitted(true);
  };

  const shareUrl = window.location.origin + `/public/${tenant.profile.customSlug || 'sunrise-dental-pune'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div id="public-collection-page" className="min-h-screen bg-stone-100 py-8 px-4 flex flex-col items-center justify-center">
      {/* Top Controls: Back to app / QR code options */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/app/dashboard')}
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 p-2 rounded-lg hover:bg-stone-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to App</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Show QR Standee</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share Link'}</span>
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
        {/* Business Branding Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-white p-1 mx-auto shadow-md mb-3 flex items-center justify-center overflow-hidden">
            {tenant.profile.logoUrl ? (
              <img
                src={tenant.profile.logoUrl}
                alt={tenant.profile.businessName}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <Sparkles className="w-8 h-8 text-emerald-600" />
            )}
          </div>
          <h1 className="text-lg font-bold text-white">{tenant.profile.businessName}</h1>
          <p className="text-xs text-emerald-200 mt-1">{tenant.profile.brandDescription}</p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-stone-900">Thank you, {name}! 🎉</h2>
              <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                Your birthday has been registered with {tenant.profile.businessName}. Look forward to a heartfelt celebratory wish on your special day!
              </p>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setName('');
                    setMobile('');
                  }}
                  className="min-h-[44px] px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
                >
                  Register Another Family Member
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-sm font-bold text-stone-900">
                  Register for Birthday Wishes & Club Privileges
                </h2>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Never miss out on your exclusive annual celebratory clinic gift!
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {errorMsg}
                </div>
              )}

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
                  className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  WhatsApp Mobile Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs font-semibold text-stone-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98765 43210"
                    maxLength={14}
                    className="w-full min-h-[44px] pl-12 pr-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Birthday Day & Month (Separate for accuracy) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Birthday *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={birthdayDay}
                    onChange={(e) => setBirthdayDay(Number(e.target.value))}
                    className="min-h-[44px] px-2 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
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
                    className="min-h-[44px] px-2 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    {months.map((m, idx) => (
                      <option key={m} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Year (Opt)"
                    value={birthdayYear}
                    onChange={(e) => setBirthdayYear(e.target.value)}
                    min={1930}
                    max={2026}
                    className="min-h-[44px] px-2 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Preferred Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full min-h-[44px] px-2 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="English">English</option>
                    <option value="Marathi">मराठी</option>
                    <option value="Hindi">हिंदी</option>
                  </select>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-stone-600 leading-relaxed">
                    I agree to receive birthday greetings and clinic announcements on WhatsApp from{' '}
                    <strong>{tenant.profile.businessName}</strong>. You may withdraw anytime.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Submit Birthday Details
              </button>

              <div className="text-center pt-2">
                <span className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                  Secured & powered by WishFlow AI
                </span>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* QR Code Standee Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 border border-stone-200 shadow-2xl">
            <h3 className="text-base font-bold text-stone-900">
              Reception Desk QR Standee
            </h3>
            <p className="text-xs text-stone-500">
              Place this printable QR at your reception desk or billing counter for quick customer registration.
            </p>

            {/* Generated QR Card Graphic */}
            <div className="p-5 bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-300 flex flex-col items-center">
              <div className="w-44 h-44 bg-white p-3 rounded-2xl shadow-md flex items-center justify-center border border-stone-200">
                {/* SVG QR Code Simulation */}
                <svg className="w-full h-full text-stone-900" viewBox="0 0 100 100">
                  <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                  <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                  <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                  <circle cx="50" cy="50" r="10" fill="#059669" />
                  <rect x="35" y="10" width="6" height="20" fill="currentColor" />
                  <rect x="50" y="10" width="12" height="6" fill="currentColor" />
                  <rect x="40" y="70" width="15" height="8" fill="currentColor" />
                  <rect x="65" y="45" width="25" height="8" fill="currentColor" />
                </svg>
              </div>
              <div className="mt-3 font-bold text-xs text-emerald-900">
                {tenant.profile.businessName}
              </div>
              <div className="text-[10px] text-emerald-700">Scan to receive Birthday Wishes</div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 min-h-[44px] py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Print Standee</span>
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="min-h-[44px] px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
