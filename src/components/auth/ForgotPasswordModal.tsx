import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, CheckCircle2, ShieldCheck, Mail, Smartphone } from 'lucide-react';

export const ForgotPasswordModal: React.FC = () => {
  const { navigate } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 400);
  };

  return (
    <div id="forgot-password-container" className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-stone-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/login')}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-stone-500">Back to Login</span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-stone-900">Reset your password</h1>
          <p className="text-xs text-stone-500 leading-relaxed">
            Enter your registered email address or mobile number to receive a secure recovery code.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Recovery Instructions Sent</h3>
            <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
              If an account matches <strong>{identifier}</strong>, we have dispatched a secure password reset link or OTP code.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/login')}
                className="w-full min-h-[44px] py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
              >
                Return to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Email Address or 10-Digit Mobile
              </label>
              <input
                type="text"
                required
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 98220 14589 or dr.rajesh@sunrisedental.in"
                className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              {loading ? 'Sending Reset Link...' : 'Send Recovery Instructions'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
