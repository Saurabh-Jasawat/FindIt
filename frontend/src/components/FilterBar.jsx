import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function FilterBar({ filters, setFilters, resetFilters }) {
  const categories = [
    { label: 'All Categories', value: '' },
    { label: '📱 Mobile', value: 'MOBILE' },
    { label: '👛 Wallet', value: 'WALLET' },
    { label: '🔑 Keys', value: 'KEYS' },
    { label: '📄 Document', value: 'DOCUMENT' },
    { label: '🪪 ID Card', value: 'ID_CARD' },
    { label: '🎒 Bag', value: 'BAG' },
    { label: '💻 Electronics', value: 'ELECTRONICS' },
    { label: '📦 Other', value: 'OTHER' },
  ];

  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
      
      {/* Type Toggle Chips (All / Lost / Found) - Horizontal Scroll on Mobile */}
      <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-fit overflow-x-auto">
        <button
          onClick={() => setFilters((prev) => ({ ...prev, type: '' }))}
          className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            filters.type === ''
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setFilters((prev) => ({ ...prev, type: 'LOST' }))}
          className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            filters.type === 'LOST'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-rose-600'
          }`}
        >
          🔴 Lost
        </button>
        <button
          onClick={() => setFilters((prev) => ({ ...prev, type: 'FOUND' }))}
          className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
            filters.type === 'FOUND'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-sky-600'
          }`}
        >
          🟢 Found
        </button>
      </div>

      {/* Dropdown Selectors - Grid on Mobile */}
      <div className="grid grid-cols-2 sm:flex items-center gap-2.5">
        {/* Category Dropdown */}
        <select
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active Only</option>
          <option value="RETURNED">Returned Only</option>
        </select>

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

    </div>
  );
}
