import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Smartphone, RefreshCw, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate, loginAs } = useApp();

  const [mode, setMode] = useState<'otp' | 'password'>('otp');
  const [mobile, setMobile] = useState('9822014589');
  const [email, setEmail] = useState('dr.rajesh@sunrisedental.in');
  const [password, setPassword] = useState('password123');
  const [otpStep, setOtpStep] = useState<'input_phone' | 'input_otp'>('input_phone');
  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStep('input_otp');
      setTimer(45);
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setError('Invalid verification code. Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginAs('owner');
    }, 350);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginAs('owner');
    }, 350);
  };

  return (
    <div id="auth-login-container" className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-stone-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Welcome to WishFlow AI
          </h1>
          <p className="text-xs text-stone-500">
            Automated, AI-personalised birthday wishes on WhatsApp
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {mode === 'otp' && otpStep === 'input_phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 bg-stone-100 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 select-none">
                  🇮🇳 +91
                </div>
                <input
                  id="login-input-mobile"
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98220 14589"
                  className="flex-1 min-h-[44px] px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                We'll send a 6-digit OTP verification code via SMS/WhatsApp.
              </p>
            </div>

            <button
              id="login-send-otp-btn"
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Send OTP</span>}
            </button>
          </form>
        )}

        {mode === 'otp' && otpStep === 'input_otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center">
              <div className="text-xs text-stone-600">
                Code sent to <span className="font-bold text-stone-900">+91 {mobile}</span>
              </div>
              <button
                type="button"
                onClick={() => setOtpStep('input_phone')}
                className="text-[11px] text-emerald-700 font-semibold hover:underline mt-0.5"
              >
                Change mobile number
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 text-center">
                Enter 6-Digit OTP Code
              </label>
              <input
                id="login-input-otp"
                type="text"
                autoFocus
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                maxLength={6}
                className="w-full min-h-[48px] px-4 py-2 text-center text-lg tracking-widest font-mono bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex justify-between items-center text-[11px] text-stone-500 mt-2">
                <span>Resend code in {timer}s</span>
                <button
                  type="button"
                  onClick={() => setTimer(45)}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              </div>
            </div>

            <button
              id="login-verify-otp-btn"
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Verify & Continue</span>}
            </button>
          </form>
        )}

        {mode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email or Mobile
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[11px] text-emerald-700 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
            </button>
          </form>
        )}

        {/* Mode switcher & Google continue */}
        <div className="pt-2 border-t border-stone-100 space-y-3">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'otp' ? 'password' : 'otp');
                setOtpStep('input_phone');
                setError('');
              }}
              className="text-xs font-medium text-stone-600 hover:text-emerald-700 flex items-center gap-1.5"
            >
              {mode === 'otp' ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Use password instead</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-stone-400" />
                  <span>Use OTP verification instead</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => loginAs('owner')}
            className="w-full min-h-[44px] py-2 px-3 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-700 flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="text-center text-xs text-stone-500">
          Don't have an account yet?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-emerald-700 font-semibold hover:underline"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
};
