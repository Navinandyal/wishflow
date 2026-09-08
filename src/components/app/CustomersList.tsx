import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, ConsentStatus } from '../../types';
import { ConsentBadge } from '../common/StatusBadge';
import {
  Users,
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  MoreHorizontal,
  Sparkles,
  Edit2,
  Trash2,
  Archive,
  Eye,
  CheckSquare,
  Square,
  Cake,
  Calendar,
  Phone,
  Tag,
  X,
} from 'lucide-react';

interface CustomersListProps {
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  onOpenExportModal: () => void;
  onEditCustomer: (c: Customer) => void;
}

export const CustomersList: React.FC<CustomersListProps> = ({
  onOpenAddModal,
  onOpenImportModal,
  onOpenExportModal,
  onEditCustomer,
}) => {
  const {
    customers,
    archiveCustomer,
    deleteCustomer,
    setActiveCustomerForDrawer,
    setActiveWishTargetCustomer,
    navigate,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [selectedRelationship, setSelectedRelationship] = useState<string>('ALL');
  const [selectedConsent, setSelectedConsent] = useState<string>('ALL');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    customers.forEach((c) => c.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [customers]);

  // Filtered dataset
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Archived toggle
      if (!showArchived && c.archived) return false;
      if (showArchived && !c.archived) return false;

      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(query);
        const matchPhone = c.mobile.toLowerCase().includes(query);
        const matchCity = c.city.toLowerCase().includes(query);
        const matchTag = c.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchName && !matchPhone && !matchCity && !matchTag) return false;
      }

      // Tag filter
      if (selectedTag !== 'ALL' && !c.tags.includes(selectedTag)) return false;

      // Language filter
      if (selectedLanguage !== 'ALL' && c.preferredLanguage !== selectedLanguage) return false;

      // Relationship filter
      if (selectedRelationship !== 'ALL' && c.relationship !== selectedRelationship) return false;

      // Consent filter
      if (selectedConsent !== 'ALL' && c.consent.status !== selectedConsent) return false;

      return true;
    });
  }, [
    customers,
    searchQuery,
    selectedTag,
    selectedLanguage,
    selectedRelationship,
    selectedConsent,
    showArchived,
  ]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map((c) => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkArchive = () => {
    selectedIds.forEach((id) => archiveCustomer(id));
    setSelectedIds([]);
    showToast(`Archived ${selectedIds.length} customer contacts.`, 'info');
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} contacts?`)) {
      selectedIds.forEach((id) => deleteCustomer(id));
      setSelectedIds([]);
      showToast(`Deleted ${selectedIds.length} contacts.`, 'info');
    }
  };

  const handleGenerateWish = (c: Customer) => {
    setActiveWishTargetCustomer(c);
    navigate('/app/wishes');
  };

  return (
    <div id="customers-list-page" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>Customers Registry</span>
            <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
              {filteredCustomers.length} contacts
            </span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage contact profiles, birthdays, preferred languages, and WhatsApp consent records.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="customers-import-btn"
            onClick={onOpenImportModal}
            className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Upload className="w-4 h-4 text-stone-500" />
            <span>Import</span>
          </button>

          <button
            id="customers-export-btn"
            onClick={onOpenExportModal}
            className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-stone-500" />
            <span>Export</span>
          </button>

          <button
            id="customers-add-new-btn"
            onClick={onOpenAddModal}
            className="min-h-[44px] px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              id="customers-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, mobile, city, or tag..."
              className="w-full min-h-[44px] pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 p-0.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className={`min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors ${
                isFilterExpanded
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`min-h-[44px] px-3 py-2 text-xs font-medium rounded-xl border transition-colors ${
                showArchived
                  ? 'bg-stone-800 text-white border-stone-900'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {showArchived ? 'Viewing Archived' : 'Active'}
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {isFilterExpanded && (
          <div className="pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                Relationship
              </label>
              <select
                value={selectedRelationship}
                onChange={(e) => setSelectedRelationship(e.target.value)}
                className="w-full min-h-[38px] px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
              >
                <option value="ALL">All Relationships</option>
                <option value="VIP Customer">VIP Customer</option>
                <option value="Patient">Patient</option>
                <option value="Client">Client</option>
                <option value="Referral Partner">Referral Partner</option>
                <option value="Vendor">Vendor</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full min-h-[38px] px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
              >
                <option value="ALL">All Languages</option>
                <option value="English">English</option>
                <option value="Marathi">मराठी (Marathi)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                WhatsApp Consent
              </label>
              <select
                value={selectedConsent}
                onChange={(e) => setSelectedConsent(e.target.value)}
                className="w-full min-h-[38px] px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
              >
                <option value="ALL">All Consent States</option>
                <option value="ACTIVE">Active Consent</option>
                <option value="PENDING">Pending</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 mb-1">Tags</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full min-h-[38px] px-2 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg"
              >
                <option value="ALL">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Bulk Action Bar (if items selected) */}
        {selectedIds.length > 0 && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs animate-in fade-in">
            <span className="font-bold text-emerald-950">
              {selectedIds.length} contact{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkArchive}
                className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-700 font-semibold hover:bg-stone-100"
              >
                Archive
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Table / Mobile Card List */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {filteredCustomers.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Your customer list is empty.</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              No contacts matched your search or filters. Try clearing your filters or add your first customer.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={onOpenAddModal}
                className="min-h-[44px] px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
              >
                Add your first customer
              </button>
              <button
                onClick={onOpenImportModal}
                className="min-h-[44px] px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200"
              >
                Import Excel / CSV
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50/80 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200 select-none">
                <tr>
                  <th className="p-4 w-10">
                    <button
                      onClick={handleSelectAll}
                      className="p-1 text-stone-400 hover:text-stone-800"
                    >
                      {selectedIds.length === filteredCustomers.length &&
                      filteredCustomers.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Birthday</th>
                  <th className="py-3 px-4">Relationship</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Consent</th>
                  <th className="py-3 px-4">Last Wished</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCustomers.map((cust) => {
                  const isSelected = selectedIds.includes(cust.id);
                  const isToday =
                    cust.birthdayDay === new Date().getDate() &&
                    cust.birthdayMonth === new Date().getMonth() + 1;

                  return (
                    <tr
                      key={cust.id}
                      id={`customer-row-${cust.id}`}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        isSelected ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleSelect(cust.id)}
                          className="p-1 text-stone-400 hover:text-stone-800"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Customer Name + Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-800 font-bold flex items-center justify-center text-xs shrink-0 border border-stone-200">
                            {cust.name.slice(0, 2)}
                          </div>
                          <div>
                            <button
                              onClick={() => setActiveCustomerForDrawer(cust)}
                              className="font-bold text-stone-900 hover:text-emerald-700 text-left truncate max-w-[160px] block"
                            >
                              {cust.name}
                            </button>
                            <div className="text-[11px] text-stone-400 truncate max-w-[160px]">
                              {cust.city}, {cust.state}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-700 whitespace-nowrap">
                        {cust.mobile}
                      </td>

                      {/* Birthday */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-semibold ${
                              isToday
                                ? 'bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold'
                                : 'text-stone-800'
                            }`}
                          >
                            {cust.birthdayDay}/{cust.birthdayMonth}
                          </span>
                          {cust.birthdayYear && (
                            <span className="text-[11px] text-stone-400">
                              ('{cust.birthdayYear.toString().slice(-2)})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Relationship */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-stone-700">{cust.relationship}</span>
                      </td>

                      {/* Language */}
                      <td className="py-3 px-4">
                        <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                          {cust.preferredLanguage}
                        </span>
                      </td>

                      {/* Consent Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <ConsentBadge status={cust.consent.status} />
                      </td>

                      {/* Last Wished */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {cust.lastWishedYear ? (
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            {cust.lastWishedYear}
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400">Never</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleGenerateWish(cust)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Generate AI Wish"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setActiveCustomerForDrawer(cust)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditCustomer(cust)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Edit Contact"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => archiveCustomer(cust.id)}
                            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                            title={cust.archived ? 'Unarchive' : 'Archive'}
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Permanently delete ${cust.name}?`)) {
                                deleteCustomer(cust.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
