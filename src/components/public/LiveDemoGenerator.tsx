import React, { useState } from 'react';
import { generateWishVariants, refineWishText } from '../../utils/aiGenerator';
import { WhatsAppBubble } from '../common/WhatsAppBubble';
import { Sparkles, Send, Copy, Check, RotateCw, Globe, Heart, ShieldCheck } from 'lucide-react';
import { WishVariant, Tenant } from '../../types';
import { INITIAL_TENANT } from '../../data/initialData';

export const LiveDemoGenerator: React.FC = () => {
  const [name, setName] = useState('Ananya Deshmukh');
  const [relationship, setRelationship] = useState<'VIP Customer' | 'Patient' | 'Client' | 'Referral Partner' | 'Friend'>('VIP Customer');
  const [industry, setIndustry] = useState('Dental Clinic & Healthcare');
  const [tone, setTone] = useState<'Warm & Heartfelt' | 'Professional & Respectful' | 'Cheerful & Festive' | 'Brief & Crisp' | 'Networking / Business Value'>('Warm & Heartfelt');
  const [language, setLanguage] = useState<'English' | 'Marathi' | 'Hindi'>('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const mockTenant: Tenant = {
    ...INITIAL_TENANT,
    profile: {
      ...INITIAL_TENANT.profile,
      businessName: 'Sunrise Dental Care',
      industry,
    },
  };

  const [variants, setVariants] = useState<WishVariant[]>(() => {
    return generateWishVariants({
      customer: { name: 'Ananya Deshmukh', relationship: 'VIP Customer' },
      tenant: mockTenant,
      tone: 'Warm & Heartfelt',
      language: 'English',
    });
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateWishVariants({
        customer: { name, relationship },
        tenant: mockTenant,
        tone,
        language,
      });
      setVariants(generated);
      setSelectedIndex(0);
      setIsGenerating(false);
    }, 450);
  };

  const handleRefine = (type: 'shorter' | 'warmer' | 'formal' | 'less_salesy') => {
    const current = variants[selectedIndex];
    const refined = refineWishText(current.text, type, name, 'Sunrise Dental Care');
    const updated = [...variants];
    updated[selectedIndex] = {
      ...current,
      text: refined,
      characterCount: refined.length,
      isEdited: true,
    };
    setVariants(updated);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(variants[selectedIndex].text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsAppTest = () => {
    const encoded = encodeURIComponent(variants[selectedIndex].text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div id="live-demo-wish-generator" className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
      {/* Demo Header */}
      <div className="bg-stone-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Interactive AI Wish Generator Demo
              <span className="text-[10px] uppercase font-semibold bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                Live Preview
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              Customize parameters to see how Gemini generates culturally warm, personalized WhatsApp wishes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
        {/* Left: Configuration Form Controls */}
        <div className="lg:col-span-5 p-5 sm:p-6 space-y-4 bg-stone-50/60">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Customer / Recipient Name
            </label>
            <input
              id="demo-input-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikram Joshi"
              className="w-full min-h-[44px] px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Relationship
              </label>
              <select
                id="demo-select-relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as any)}
                className="w-full min-h-[44px] px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              >
                <option value="VIP Customer">VIP Customer</option>
                <option value="Patient">Patient</option>
                <option value="Client">Corporate Client</option>
                <option value="Referral Partner">Referral Partner</option>
                <option value="Friend">Friend / Family</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Language
              </label>
              <select
                id="demo-select-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full min-h-[44px] px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              >
                <option value="English">English</option>
                <option value="Marathi">मराठी (Marathi)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tone of Voice
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {(
                [
                  'Warm & Heartfelt',
                  'Professional & Respectful',
                  'Cheerful & Festive',
                  'Brief & Crisp',
                  'Networking / Business Value',
                ] as const
              ).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`min-h-[44px] px-3 py-2 text-left rounded-xl text-xs font-medium border transition-all ${
                    tone === t
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            id="demo-generate-button"
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full min-h-[48px] px-4 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            {isGenerating ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Crafting AI Variants...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate 3 AI Wishes</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Live Preview & Variant Selection */}
        <div className="lg:col-span-7 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Select Variant ({selectedIndex + 1} of {variants.length})
            </span>
            <div className="flex items-center gap-1.5">
              {variants.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`min-h-[36px] px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    selectedIndex === idx
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Variant {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Actual WhatsApp Chat Preview Bubble */}
          <WhatsAppBubble
            message={variants[selectedIndex].text}
            recipientName={name || 'Customer'}
            businessName="Sunrise Dental Care"
            status="delivered"
            time="08:30 AM"
          />

          {/* Quick Refinement Chips */}
          <div>
            <div className="text-[11px] font-semibold text-stone-500 mb-1.5">
              Instant AI Polish & Adjustments:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleRefine('shorter')}
                className="min-h-[38px] px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium transition-colors"
              >
                ✂️ Shorter
              </button>
              <button
                type="button"
                onClick={() => handleRefine('warmer')}
                className="min-h-[38px] px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium transition-colors"
              >
                💖 Warmer
              </button>
              <button
                type="button"
                onClick={() => handleRefine('formal')}
                className="min-h-[38px] px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium transition-colors"
              >
                👔 More Formal
              </button>
              <button
                type="button"
                onClick={() => handleRefine('less_salesy')}
                className="min-h-[38px] px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium transition-colors"
              >
                🌿 Less Salesy
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100">
            <button
              onClick={handleCopy}
              className="min-h-[44px] px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Wish'}</span>
            </button>

            <button
              onClick={handleOpenWhatsAppTest}
              className="min-h-[44px] px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Test Send on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
