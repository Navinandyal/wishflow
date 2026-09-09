import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PLANS } from '../../data/initialData';
import { Navbar } from '../common/Navbar';
import { Check, ArrowRight, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { navigate, tenant, upgradePlan } = useApp();
  const [isAnnual, setIsAnnual] = useState(true);

  const handleSelectPlan = (planId: any) => {
    if (planId === 'free') {
      navigate('/register');
    } else {
      upgradePlan(planId);
      navigate('/app/dashboard');
    }
  };

  return (
    <div id="pricing-page" className="bg-stone-50 min-h-screen text-stone-900 flex flex-col">
      <Navbar />
      <div className="flex-1 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Transparent Indian SaaS Pricing
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-3">
            Simple, predictable plans that scale with your customer base
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            No hidden fees. Inclusive of automated cron dispatchers, Gemini AI models, and WhatsApp Meta Cloud API support.
          </p>

          {/* Monthly / Annual Billing Switcher */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 bg-white border border-stone-300 rounded-2xl shadow-xs">
            <button
              onClick={() => setIsAnnual(false)}
              className={`min-h-[40px] px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                !isAnnual ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`min-h-[40px] px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
                isAnnual ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-emerald-800/80 text-emerald-100 text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">
          {PLANS.map((plan) => {
            const isCurrent = tenant.planId === plan.id;
            const price = isAnnual
              ? Math.round(plan.priceAnnual / 12)
              : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`p-5 rounded-2xl bg-white border flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'border-emerald-500 shadow-xl ring-2 ring-emerald-500/20'
                    : 'border-stone-200 shadow-xs'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                    Recommended
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900">{plan.name}</h3>
                    {isCurrent && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-stone-900">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-stone-500">/ mo</span>
                    </div>
                    {isAnnual && plan.priceAnnual > 0 && (
                      <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                        Billed annually (₹{plan.priceAnnual.toLocaleString('en-IN')})
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 text-xs font-semibold text-stone-700 space-y-1">
                    <div>👥 Up to {plan.customerLimit.toLocaleString('en-IN')} contacts</div>
                    <div>⚡ {plan.aiCreditsPerMonth} AI Wishes / mo</div>
                    <div className={plan.ownNumberAllowed ? 'text-emerald-700 font-bold' : 'text-stone-400'}>
                      {plan.ownNumberAllowed ? '✓ Connect Own WhatsApp' : '✕ Assisted/Managed Only'}
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-stone-600">
                    {plan.features.slice(0, 5).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full min-h-[44px] py-2 text-xs font-bold rounded-xl transition-colors ${
                      plan.popular
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : `Choose ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* GST & Payment Information Note */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-stone-200 shadow-xs max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">
                100% Secure Payments via Razorpay
              </h4>
              <p className="text-[11px] text-stone-500">
                Supports UPI Autopay, Corporate Netbanking, Credit Cards & GST Invoices with 18% Input Tax Credit.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/app/settings/billing')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 shrink-0"
          >
            Manage Billing →
          </button>
        </div>
      </div>
    </div>
  </div>
);
};
