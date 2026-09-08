import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, WishTone, WishLanguage, WishVariant } from '../../types';
import { generateWishVariants, refineWishText } from '../../utils/aiGenerator';
import { WhatsAppBubble } from '../common/WhatsAppBubble';
import {
  Sparkles,
  Send,
  Save,
  RotateCw,
  Search,
  Copy,
  Check,
  Clock,
  ChevronDown,
  User,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const WishGeneratorPage: React.FC = () => {
  const {
    customers,
    tenant,
    activeWishTargetCustomer,
    setActiveWishTargetCustomer,
    sendMessage,
    navigate,
    showToast,
  } = useApp();

  // Selected customer
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    activeWishTargetCustomer ? activeWishTargetCustomer.id : customers[0]?.id || ''
  );

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Parameters
  const [tone, setTone] = useState<WishTone>('Warm & Heartfelt');
  const [language, setLanguage] = useState<WishLanguage>(
    selectedCustomer?.preferredLanguage || 'English'
  );
  const [customInstructions, setCustomInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [editingText, setEditingText] = useState('');
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Synchronize language when customer changes
  useEffect(() => {
    if (selectedCustomer) {
      setLanguage(selectedCustomer.preferredLanguage);
    }
  }, [selectedCustomerId]);

  // Initial generated variants
  const [variants, setVariants] = useState<WishVariant[]>(() => {
    if (!selectedCustomer) return [];
    return generateWishVariants({
      customer: selectedCustomer,
      tenant,
      tone: 'Warm & Heartfelt',
      language: selectedCustomer.preferredLanguage,
    });
  });

  useEffect(() => {
    if (selectedCustomer && variants.length > 0) {
      setEditingText(variants[selectedVariantIndex]?.text || '');
    }
  }, [selectedVariantIndex, variants]);

  const handleGenerate = () => {
    if (!selectedCustomer) return;
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateWishVariants({
        customer: selectedCustomer,
        tenant,
        tone,
        language,
        customInstructions,
      });
      setVariants(generated);
      setSelectedVariantIndex(0);
      setIsGenerating(false);
      showToast(`Generated 3 AI variants for ${selectedCustomer.name}!`, 'info');
    }, 450);
  };

  const handleRefine = (type: 'shorter' | 'warmer' | 'formal' | 'less_salesy') => {
    const current = variants[selectedVariantIndex];
    if (!current || !selectedCustomer) return;
    const refined = refineWishText(current.text, type, selectedCustomer.name, tenant.profile.businessName);
    const updated = [...variants];
    updated[selectedVariantIndex] = {
      ...current,
      text: refined,
      characterCount: refined.length,
      isEdited: true,
    };
    setVariants(updated);
    setEditingText(refined);
  };

  const handleTranslate = (targetLang: 'English' | 'Marathi' | 'Hindi') => {
    setLanguage(targetLang);
    const generated = generateWishVariants({
      customer: selectedCustomer,
      tenant,
      tone,
      language: targetLang,
      customInstructions,
    });
    setVariants(generated);
    setSelectedVariantIndex(0);
  };

  const handleSaveDraft = () => {
    showToast('Wish saved as draft in daily queue.', 'success');
  };

  const handleSendNow = () => {
    if (!selectedCustomer) return;
    const textToSend = isInlineEditing ? editingText : variants[selectedVariantIndex].text;
    sendMessage(
      selectedCustomer.id,
      textToSend,
      tenant.whatsAppStatus === 'connected' ? 'OWN_NUMBER' : 'ASSISTED',
      tone,
      language
    );
    navigate('/app/dashboard');
  };

  const handleCopy = () => {
    const text = isInlineEditing ? editingText : variants[selectedVariantIndex].text;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="wish-generator-container" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <span>AI Wish Generator</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Craft personalized, culturally nuanced WhatsApp birthday greetings powered by Google Gemini.
          </p>
        </div>

        {selectedCustomer && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">Target Birthday:</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {selectedCustomer.birthdayDay} / {selectedCustomer.birthdayMonth}
            </span>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-5 space-y-5 bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-sm">
          {/* Customer Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Select Customer / Recipient
            </label>
            <select
              id="generator-customer-select"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              {customers
                .filter((c) => !c.archived)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.relationship} • Birthday: {c.birthdayDay}/{c.birthdayMonth})
                  </option>
                ))}
            </select>
          </div>

          {/* Customer Snapshot Card */}
          {selectedCustomer && (
            <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-stone-900">
                <span>{selectedCustomer.name}</span>
                <span className="text-emerald-700 font-semibold">{selectedCustomer.relationship}</span>
              </div>
              <div className="text-[11px] text-stone-500 flex items-center justify-between">
                <span>WhatsApp: {selectedCustomer.mobile}</span>
                <span>City: {selectedCustomer.city}</span>
              </div>
              <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1 border-t border-stone-200/60">
                <span>Preferred: {selectedCustomer.preferredLanguage}</span>
                <span className="font-semibold text-emerald-800">
                  Consent: {selectedCustomer.consent.status}
                </span>
              </div>
            </div>
          )}

          {/* Language Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Wish Language
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['English', 'Marathi', 'Hindi'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`min-h-[40px] px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                    language === lang
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {lang === 'Marathi' ? 'मराठी (Marathi)' : lang === 'Hindi' ? 'हिंदी (Hindi)' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Tone of Voice
            </label>
            <div className="grid grid-cols-1 gap-1.5">
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
                  className={`min-h-[40px] px-3.5 py-2 text-left rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${
                    tone === t
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold'
                      : 'bg-stone-50/50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>{t}</span>
                  {tone === t && <span className="text-emerald-700 text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instructions */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Custom Prompt Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Mention their recent root canal follow-up, or keep under 25 words..."
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Generate Button */}
          <button
            id="generator-trigger-btn"
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Crafting AI Variants with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate 3 Fresh AI Variants</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Generated Output & Refinements */}
        <div className="lg:col-span-7 space-y-4">
          {/* Variant Selector Tabs */}
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800">
              AI Variant Output ({selectedVariantIndex + 1} of {variants.length})
            </span>
            <div className="flex items-center gap-1.5">
              {variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVariantIndex(i);
                    setIsInlineEditing(false);
                  }}
                  className={`min-h-[36px] px-3.5 py-1 text-xs font-bold rounded-xl transition-colors ${
                    selectedVariantIndex === i
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Variant {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp Preview Bubble */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-500">
                WhatsApp Chat Preview ({variants[selectedVariantIndex]?.characterCount || 0} chars)
              </span>
              <button
                onClick={() => setIsInlineEditing(!isInlineEditing)}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                {isInlineEditing ? 'Finish Editing' : 'Edit Text Directly'}
              </button>
            </div>

            {isInlineEditing ? (
              <div className="space-y-2">
                <textarea
                  rows={5}
                  value={editingText}
                  onChange={(e) => {
                    setEditingText(e.target.value);
                    const updated = [...variants];
                    updated[selectedVariantIndex] = {
                      ...updated[selectedVariantIndex],
                      text: e.target.value,
                      characterCount: e.target.value.length,
                      isEdited: true,
                    };
                    setVariants(updated);
                  }}
                  className="w-full p-3.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 font-sans leading-relaxed"
                />
                <p className="text-[11px] text-stone-400">
                  Tip: You can use standard WhatsApp formatting like *bold*, _italics_, or emoji.
                </p>
              </div>
            ) : (
              <WhatsAppBubble
                message={variants[selectedVariantIndex]?.text || ''}
                recipientName={selectedCustomer?.name || 'Customer'}
                businessName={tenant.profile.businessName}
                status="delivered"
                time="08:30 AM"
              />
            )}

            {/* Instant AI Refinement Chips */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-stone-500 mb-2">
                Quick AI Refinement Chips:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleRefine('shorter')}
                  className="min-h-[38px] px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-medium transition-colors"
                >
                  ✂️ Shorter
                </button>
                <button
                  type="button"
                  onClick={() => handleRefine('warmer')}
                  className="min-h-[38px] px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-medium transition-colors"
                >
                  💖 Warmer
                </button>
                <button
                  type="button"
                  onClick={() => handleRefine('formal')}
                  className="min-h-[38px] px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-medium transition-colors"
                >
                  👔 More Formal
                </button>
                <button
                  type="button"
                  onClick={() => handleRefine('less_salesy')}
                  className="min-h-[38px] px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-medium transition-colors"
                >
                  🌿 Less Salesy
                </button>
                <button
                  type="button"
                  onClick={() => handleTranslate(language === 'Marathi' ? 'English' : 'Marathi')}
                  className="min-h-[38px] px-3 py-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl font-medium transition-colors"
                >
                  🌐 {language === 'Marathi' ? 'Switch to English' : 'Translate to मराठी'}
                </button>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="min-h-[44px] px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="min-h-[44px] px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-stone-500" />
                  <span>Save as Draft</span>
                </button>
              </div>

              <button
                id="generator-send-now-btn"
                type="button"
                onClick={handleSendNow}
                disabled={!selectedCustomer || selectedCustomer.consent.status !== 'ACTIVE'}
                className="min-h-[44px] px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send on WhatsApp Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
