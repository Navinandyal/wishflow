import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Template } from '../../types';
import { WhatsAppBubble } from '../common/WhatsAppBubble';
import {
  FileText,
  Plus,
  Sparkles,
  Copy,
  Check,
  Edit2,
  Trash2,
  Tag,
  Search,
  Filter,
  Layers,
} from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const { templates, tenant, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Template Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Template['category']>('WARM');
  const [formLanguage, setFormLanguage] = useState<'English' | 'Marathi' | 'Hindi'>('English');
  const [formContent, setFormContent] = useState('');

  const filteredTemplates = templates.filter((t) => {
    if (selectedCategory !== 'ALL' && t.category !== selectedCategory) return false;
    if (selectedLanguage !== 'ALL' && t.language !== selectedLanguage) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenNew = () => {
    setEditingTemplate(null);
    setFormName('');
    setFormCategory('WARM');
    setFormLanguage('English');
    setFormContent(
      'Dear {{name}}, wishing you a wonderful Birthday from Dr. Rajesh Kulkarni and {{business_name}}! 🎂✨ May this year bring you glowing health and prosperity.'
    );
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Template) => {
    setEditingTemplate(t);
    setFormName(t.name);
    setFormCategory(t.category);
    setFormLanguage(t.language);
    setFormContent(t.content);
    setIsModalOpen(true);
  };

  const handleInsertVariable = (variable: string) => {
    setFormContent((prev) => `${prev} {{${variable}}}`);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) return;

    showToast(
      editingTemplate
        ? 'Template updated successfully!'
        : 'New wish template added to library!',
      'success'
    );
    setIsModalOpen(false);
  };

  return (
    <div id="templates-library-page" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600" />
            <span>Wish Templates Library</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Pre-approved WhatsApp messaging templates with dynamic placeholders and multilingual support.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="min-h-[44px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by title or content..."
            className="w-full min-h-[40px] pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="min-h-[40px] px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="PROFESSIONAL">Professional</option>
            <option value="WARM">Warm & Heartfelt</option>
            <option value="FESTIVE">Festive & Cheerful</option>
            <option value="SHORT">Short & Sweet</option>
            <option value="NETWORKING">Networking / SCGT</option>
            <option value="INDUSTRY">Healthcare / Dental</option>
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="min-h-[40px] px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium"
          >
            <option value="ALL">All Languages</option>
            <option value="English">English</option>
            <option value="Marathi">मराठी (Marathi)</option>
            <option value="Hindi">हिंदी (Hindi)</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">{t.name}</span>
                <span className="text-[10px] uppercase font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                  {t.language}
                </span>
              </div>

              {/* Tags & Category */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                  {t.category}
                </span>
                {t.isDefault && (
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                    Default
                  </span>
                )}
                <span className="text-[10px] text-stone-400">Used {t.useCount} times</span>
              </div>

              {/* Message Bubble Preview */}
              <WhatsAppBubble
                message={t.content
                  .replace(/{{name}}/g, 'Ananya Deshmukh')
                  .replace(/{{business_name}}/g, tenant.profile.businessName)
                  .replace(/{{city}}/g, 'Pune')}
                recipientName="Ananya Deshmukh"
                businessName={tenant.profile.businessName}
                status="delivered"
                time="08:30 AM"
              />
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleOpenEdit(t)}
                className="text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Template</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(t.content);
                  showToast('Template copied to clipboard!', 'info');
                }}
                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-stone-900">
              {editingTemplate ? 'Edit Wish Template' : 'Create Custom Wish Template'}
            </h2>

            <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Marathi Heartfelt Dental Clinic Wish"
                  className="w-full min-h-[44px] px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full min-h-[44px] px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="WARM">Warm & Heartfelt</option>
                    <option value="PROFESSIONAL">Professional</option>
                    <option value="FESTIVE">Festive & Cheerful</option>
                    <option value="SHORT">Short & Sweet</option>
                    <option value="NETWORKING">Networking / SCGT</option>
                    <option value="INDUSTRY">Industry Specific</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Language</label>
                  <select
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value as any)}
                    className="w-full min-h-[44px] px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  >
                    <option value="English">English</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Variables Inserter */}
              <div>
                <div className="text-[11px] font-semibold text-stone-500 mb-1.5">
                  Insert Dynamic Placeholder:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['name', 'business_name', 'city', 'relationship', 'custom_note'].map((varName) => (
                    <button
                      key={varName}
                      type="button"
                      onClick={() => handleInsertVariable(varName)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-mono text-[11px] border border-emerald-200"
                    >
                      +{`{{${varName}}}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Message Content * ({formContent.length} chars)
                </label>
                <textarea
                  rows={4}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 bg-stone-100 text-stone-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
