import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, ArrowLeft, Check, CheckCircle2, ShieldCheck, Building, Award } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { navigate, loginAs, updateBranding } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states preserved across steps
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'business' | 'scgt_member'>('business');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('Dental Clinic & Healthcare');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [scgtChapter, setScgtChapter] = useState('Pune Champions Chapter');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 300);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 300);
  };

  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    setError('');
    setStep(4);
  };

  const handleStep4Complete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setError('Please enter your business or practice name.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateBranding({
        businessName,
        industry,
        city,
        state,
      });
      // Complete registration and redirect to Onboarding
      loginAs('owner');
      navigate('/app/onboarding');
    }, 400);
  };

  return (
    <div id="auth-register-container" className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-stone-50">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-stone-200 p-6 sm:p-8 space-y-6">
        {/* Step Indicator 1 -> 2 -> 3 -> 4 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-900">
              Step {step} of 4:{' '}
              {step === 1 && 'Mobile Verification'}
              {step === 2 && 'Enter OTP'}
              {step === 3 && 'Personal Profile'}
              {step === 4 && 'Business & Networking'}
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              {step * 25}% Completed
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${step >= 1 ? 'bg-emerald-600' : 'bg-transparent'}`} />
            <div className={`h-full rounded-full transition-all ${step >= 2 ? 'bg-emerald-600' : 'bg-transparent'}`} />
            <div className={`h-full rounded-full transition-all ${step >= 3 ? 'bg-emerald-600' : 'bg-transparent'}`} />
            <div className={`h-full rounded-full transition-all ${step >= 4 ? 'bg-emerald-600' : 'bg-transparent'}`} />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* STEP 1: MOBILE */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900">Enter your mobile number</h2>
              <p className="text-xs text-stone-500">
                We'll verify your mobile number to set up your multi-tenant WishFlow account.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Indian Mobile Number *
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 select-none">
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  required
                  autoFocus
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98220 12345"
                  className="flex-1 min-h-[44px] px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue with SMS OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Enter 6-digit OTP</h2>
                <p className="text-xs text-stone-500">
                  Sent to <span className="font-semibold text-stone-900">+91 {mobile}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Change
              </button>
            </div>

            <div>
              <input
                type="text"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                maxLength={6}
                className="w-full min-h-[48px] px-4 py-2 text-center text-xl tracking-widest font-mono bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-stone-400 mt-2 text-center">
                Demo code: enter any 6 digits (e.g. 123456)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="min-h-[48px] px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Verify OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PROFILE */}
        {step === 3 && (
          <form onSubmit={handleStep3} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900">Your profile details</h2>
              <p className="text-xs text-stone-500">
                This name will appear on wishes and your business sign-off.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Kulkarni"
                className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. dr.rajesh@sunrisedental.in"
                className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password (Optional - for direct login)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
                className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="min-h-[48px] px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Business Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: BUSINESS / SCGT */}
        {step === 4 && (
          <form onSubmit={handleStep4Complete} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900">Account Type & Business Details</h2>
              <p className="text-xs text-stone-500">
                Tailor your WishFlow experience for business client retention or SCGT networking.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Account Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType('business')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    accountType === 'business'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold">Business Owner</span>
                  <span className="text-[10px] text-stone-500">
                    Clinics, retail, consultancies, salons
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('scgt_member')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    accountType === 'scgt_member'
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-semibold'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold">SCGT Member</span>
                  <span className="text-[10px] text-stone-500">
                    Networking chapter member
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Business / Clinic Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Sunrise Dental Care"
                className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Industry / Category *
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Dental Clinic & Healthcare">Dental Clinic & Healthcare</option>
                  <option value="Medical Specialist Clinic">Medical Specialist Clinic</option>
                  <option value="Chartered Accountancy & Finance">Chartered Accountancy & Finance</option>
                  <option value="Legal & Advisory Services">Legal & Advisory Services</option>
                  <option value="Real Estate & Architecture">Real Estate & Architecture</option>
                  <option value="Retail & Boutique">Retail & Boutique</option>
                  <option value="Hospitality & Restaurant">Hospitality & Restaurant</option>
                  <option value="IT Services & Consulting">IT Services & Consulting</option>
                  <option value="Other Business">Other Business</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Pune"
                  className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            {accountType === 'scgt_member' && (
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
                <label className="block text-xs font-semibold text-indigo-950">
                  Select your SCGT Chapter
                </label>
                <select
                  value={scgtChapter}
                  onChange={(e) => setScgtChapter(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-xs bg-white border border-indigo-300 rounded-xl"
                >
                  <option value="Pune Champions Chapter">Pune Champions Chapter</option>
                  <option value="Pune East Titans">Pune East Titans</option>
                  <option value="Pune Central Leaders">Pune Central Leaders</option>
                  <option value="Mumbai Gateway Achievers">Mumbai Gateway Achievers</option>
                  <option value="PCMC Innovators Chapter">PCMC Innovators Chapter</option>
                </select>
                <p className="text-[10px] text-indigo-700">
                  You can verify your SCGT membership number after onboarding to unlock the roster.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="min-h-[48px] px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Complete Registration</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          Already registered?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-emerald-700 font-semibold hover:underline"
          >
            Log in instead
          </button>
        </div>
      </div>
    </div>
  );
};
